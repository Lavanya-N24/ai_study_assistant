# app/routes/quiz.py
# -------------------
# GET /quiz – generates 5 MCQ questions from the indexed document.

import logging
from fastapi import APIRouter, HTTPException, Depends

from app.services.rag_service import get_vector_store
from app.services.ai_service import generate_quiz
from app.models.schemas import QuizResponse
from app.core.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.get("/", response_model=QuizResponse, summary="Generate 5 MCQ questions from the document")
async def get_quiz(user_id: str = Depends(get_current_user)):
    """
    Retrieves content from the FAISS index and prompts GPT to return
    exactly 5 well-formed multiple-choice questions with explanations.

    The model is instructed to return structured JSON so questions can
    be consumed directly by any frontend quiz component.
    """
    # ── Load chunks from the vector store ────────────────────────────────────
    try:
        store = get_vector_store()
    except RuntimeError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    try:
        all_docs = list(store.docstore._dict.values())
        chunks = [doc.page_content for doc in all_docs[:15]]
    except Exception as exc:
        logger.exception("Failed to read chunks from FAISS docstore.")
        raise HTTPException(status_code=500, detail=f"Could not read indexed content: {exc}")

    if not chunks:
        raise HTTPException(status_code=404, detail="No content found in the index.")

    # ── Generate quiz via OpenAI ──────────────────────────────────────────────
    try:
        questions = await generate_quiz(chunks)
    except ValueError as exc:
        # Malformed JSON from model
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception as exc:
        logger.exception("OpenAI call failed for quiz generation.")
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}")

    return QuizResponse(questions=questions)
