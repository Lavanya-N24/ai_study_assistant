# app/routes/chat.py
# -------------------
# POST /chat – RAG-powered question answering.
# Retrieves relevant context from FAISS and sends it to OpenAI.

import logging
from fastapi import APIRouter, HTTPException, Depends

from app.services.rag_service import retrieve_relevant_chunks
from app.services.ai_service import answer_question
from app.models.schemas import ChatRequest, ChatResponse
from app.core.auth import get_current_user
from app.core.db import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse, summary="Ask a question about the uploaded document")
async def chat(request: ChatRequest, user_id: str = Depends(get_current_user)):
    """
    RAG pipeline:
    1. Embed the user's question (done internally by FAISS similarity search).
    2. Retrieve the top-k most relevant chunks from the FAISS index.
    3. Pass context + question to OpenAI GPT.
    4. Return the grounded answer (hallucination is prevented via system prompt).
    5. Save the chat to MongoDB for the authenticated user.
    """
    # ── Retrieve context ──────────────────────────────────────────────────────
    try:
        chunks = retrieve_relevant_chunks(request.question, top_k=request.top_k)
    except RuntimeError as exc:
        # Typically means no PDF has been uploaded yet
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.exception("Vector search failed.")
        raise HTTPException(status_code=500, detail=f"Retrieval error: {exc}")

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No relevant content found for your question. Try rephrasing."
        )

    # ── Generate answer ───────────────────────────────────────────────────────
    try:
        answer = await answer_question(context_chunks=chunks, question=request.question)
    except Exception as exc:
        logger.exception("OpenAI call failed for chat.")
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}")

    # ── Save chat to MongoDB ──────────────────────────────────────────────────
    try:
        db.chats.insert_one({
            "user_id": user_id,
            "query": request.question,
            "response": answer,
        })
    except Exception as exc:
        logger.warning("Failed to save chat to MongoDB: %s", exc)

    # Return the answer along with the source excerpts for transparency
    return ChatResponse(answer=answer, sources=chunks)
