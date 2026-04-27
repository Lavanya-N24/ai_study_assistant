# app/services/ai_service.py
# ---------------------------
# All direct calls to the Groq Chat API live here.
# Routes never import `groq` directly – they call these helpers.
#
# Model used: llama-3.3-70b-versatile (free, fast, highly capable)
# Groq runs on custom LPU hardware so responses are typically
# 5-10x faster than OpenAI at zero cost.

import json
import logging
from typing import List

from groq import AsyncGroq

from app.core.config import settings
from app.models.schemas import QuizQuestion, QuizOption

logger = logging.getLogger(__name__)

# Single AsyncGroq client – reused across all requests (thread-safe)
_client = AsyncGroq(api_key=settings.GROQ_API_KEY)


# ── Internal helper ──────────────────────────────────────────────────────────

async def _chat_completion(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    """
    Low-level wrapper around Groq Chat Completions.

    Args:
        system_prompt: Instructions / persona for the model.
        user_prompt:   The actual user message.
        temperature:   Creativity level (lower = more factual).

    Returns:
        Model's reply as a plain string.
    """
    response = await _client.chat.completions.create(
        model=settings.GROQ_MODEL,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ],
    )
    return response.choices[0].message.content.strip()


# ── Public service functions ──────────────────────────────────────────────────

async def answer_question(context_chunks: List[str], question: str) -> str:
    """
    Use RAG context to answer the user's question.

    The system prompt explicitly instructs the model NOT to invent
    information outside the provided context (anti-hallucination guard).

    Args:
        context_chunks: Relevant text chunks retrieved from FAISS.
        question:       The user's question.

    Returns:
        Grounded answer from the model.
    """
    context = "\n\n---\n\n".join(context_chunks)

    system_prompt = (
        "You are a helpful and precise AI study assistant. "
        "Answer the user's question using ONLY the context provided below. "
        "If the answer is not present in the context, respond with: "
        "'I could not find that information in the uploaded document.' "
        "Do not make up facts. Be concise, clear, and academic in tone.\n\n"
        f"CONTEXT:\n{context}"
    )

    user_prompt = f"Question: {question}"

    logger.info("Sending RAG query to Groq [%s]: %s", settings.GROQ_MODEL, question[:80])
    return await _chat_completion(system_prompt, user_prompt, temperature=0.2)


async def generate_summary(context_chunks: List[str]) -> str:
    """
    Produce a structured summary of the document from its chunks.

    Args:
        context_chunks: All (or sampled) text chunks from the document.

    Returns:
        Multi-paragraph summary string.
    """
    # Use up to 20 chunks to keep within token limits
    sample = context_chunks[:20]
    context = "\n\n".join(sample)

    system_prompt = (
        "You are an expert academic summariser. "
        "Create a comprehensive, well-structured summary of the document content below. "
        "Use clear headings (##) and bullet points where appropriate. "
        "Cover the main topics, key concepts, and important conclusions. "
        "Keep the summary informative but concise."
    )

    user_prompt = f"Document content:\n\n{context}"

    logger.info("Generating document summary via Groq…")
    return await _chat_completion(system_prompt, user_prompt, temperature=0.4)


async def generate_quiz(context_chunks: List[str]) -> List[QuizQuestion]:
    """
    Generate exactly 5 MCQ questions from the document content.

    Returns structured QuizQuestion objects (parsed from the JSON the
    model is instructed to produce).

    Args:
        context_chunks: Text chunks to base the quiz on.

    Returns:
        List of 5 QuizQuestion objects.

    Raises:
        ValueError: If the model returns malformed JSON.
    """
    sample = context_chunks[:15]
    context = "\n\n".join(sample)

    system_prompt = (
        "You are an expert quiz creator. "
        "Based on the document content provided, generate EXACTLY 5 multiple-choice questions. "
        "Each question must have 4 options labeled A, B, C, D. "
        "Return ONLY a valid JSON array – no markdown fences, no explanation – in this exact format:\n"
        '[\n'
        '  {\n'
        '    "question": "...",\n'
        '    "options": [\n'
        '      {"label": "A", "text": "..."},\n'
        '      {"label": "B", "text": "..."},\n'
        '      {"label": "C", "text": "..."},\n'
        '      {"label": "D", "text": "..."}\n'
        '    ],\n'
        '    "answer": "A",\n'
        '    "explanation": "Brief explanation of why this is correct."\n'
        '  }\n'
        ']'
    )

    user_prompt = f"Document content:\n\n{context}"

    logger.info("Generating quiz questions via Groq…")
    raw_json = await _chat_completion(system_prompt, user_prompt, temperature=0.5)

    # ── Robust JSON Extraction ───────────────────────────────────────────────
    # The model might return text before/after the JSON. We find the first '[' 
    # and last ']' to extract the pure JSON array.
    raw_json = raw_json.strip()
    start_idx = raw_json.find("[")
    end_idx = raw_json.rfind("]")
    
    if start_idx != -1 and end_idx != -1:
        raw_json = raw_json[start_idx : end_idx + 1]

    try:
        data = json.loads(raw_json)
    except json.JSONDecodeError as exc:
        logger.error("Groq returned invalid JSON for quiz: %s", raw_json[:300])
        raise ValueError(f"Model returned invalid JSON: {exc}") from exc

    questions: List[QuizQuestion] = []
    for item in data[:5]:   # enforce max 5 even if model returns more
        options = [QuizOption(label=o["label"], text=o["text"]) for o in item["options"]]
        questions.append(
            QuizQuestion(
                question=item["question"],
                options=options,
                answer=item["answer"],
                explanation=item.get("explanation", ""),
            )
        )

    return questions
