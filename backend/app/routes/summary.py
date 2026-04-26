# app/routes/summary.py
# ----------------------
# GET /summary – generates a structured summary of the indexed document.

import logging
from fastapi import APIRouter, HTTPException, Depends

from app.services.rag_service import get_vector_store
from app.services.ai_service import generate_summary
from app.models.schemas import SummaryResponse
from app.core.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/summary", tags=["Summary"])


@router.get("/", response_model=SummaryResponse, summary="Summarise the uploaded document")
async def get_summary(user_id: str = Depends(get_current_user)):
    """
    Pulls up to 20 representative chunks from the FAISS store and
    asks GPT to produce a well-structured, comprehensive summary.

    No query is needed – this endpoint works on the entire indexed document.
    """
    # ── Load chunks from the vector store ────────────────────────────────────
    try:
        store = get_vector_store()
    except RuntimeError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    # FAISS docstore holds all documents – retrieve up to 20 for summarisation
    try:
        all_docs = list(store.docstore._dict.values())
        chunks = [doc.page_content for doc in all_docs[:20]]
    except Exception as exc:
        logger.exception("Failed to read chunks from FAISS docstore.")
        raise HTTPException(status_code=500, detail=f"Could not read indexed content: {exc}")

    if not chunks:
        raise HTTPException(status_code=404, detail="No content found in the index.")

    # ── Generate summary via OpenAI ───────────────────────────────────────────
    try:
        summary = await generate_summary(chunks)
    except Exception as exc:
        logger.exception("OpenAI call failed for summary.")
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}")

    return SummaryResponse(summary=summary)
