# app/routes/upload.py
# ----------------------
# POST /upload – accepts a PDF, builds the FAISS index, and returns
# a summary of what was indexed.

import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from app.services.pdf_service import extract_text_from_pdf, split_text_into_chunks
from app.services.rag_service import build_and_save_index
from app.models.schemas import UploadResponse
from app.core.auth import get_current_user
from app.core.db import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/", response_model=UploadResponse, summary="Upload a PDF and index it")
async def upload_pdf(
    file: UploadFile = File(..., description="PDF file to upload"),
    user_id: str = Depends(get_current_user),
):
    """
    Pipeline:
    1. Validate that the uploaded file is a PDF.
    2. Read its bytes and extract plain text with PyPDF.
    3. Split text into overlapping chunks.
    4. Embed chunks via OpenAI and store in a local FAISS index.
    5. Save document metadata to MongoDB for the authenticated user.
    """
    # ── Validation ────────────────────────────────────────────────────────────
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # ── Read file bytes ───────────────────────────────────────────────────────
    try:
        file_bytes = await file.read()
    except Exception as exc:
        logger.exception("Failed to read uploaded file.")
        raise HTTPException(status_code=500, detail=f"Could not read file: {exc}")

    # ── Extract text ──────────────────────────────────────────────────────────
    try:
        text = extract_text_from_pdf(file_bytes)
    except ValueError as exc:
        # User-facing error (e.g. image-only PDF)
        raise HTTPException(status_code=422, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    # ── Chunk ─────────────────────────────────────────────────────────────────
    chunks = split_text_into_chunks(text)
    if not chunks:
        raise HTTPException(status_code=422, detail="Text could not be split into chunks.")

    # ── Embed & index ─────────────────────────────────────────────────────────
    try:
        indexed_count = build_and_save_index(chunks)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    # ── Save document metadata to MongoDB ─────────────────────────────────────
    try:
        db.documents.insert_one({
            "user_id": user_id,
            "filename": file.filename,
        })
    except Exception as exc:
        logger.warning("Failed to save document metadata to MongoDB: %s", exc)

    return UploadResponse(
        message="PDF uploaded and indexed successfully.",
        filename=file.filename,
        chunks_indexed=indexed_count,
    )
