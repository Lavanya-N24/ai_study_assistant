# app/services/pdf_service.py
# ----------------------------
# Handles everything related to reading a PDF and splitting it
# into chunks suitable for embedding.

import io
import logging
from typing import List

from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Read raw bytes of a PDF file and return all extracted text
    as a single string.

    Args:
        file_bytes: Raw binary content of the uploaded PDF.

    Returns:
        Full plain-text of the PDF.

    Raises:
        ValueError: If no text could be extracted (e.g. scanned image PDF).
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        pages_text: List[str] = []

        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text()
            if text:
                pages_text.append(text)
            else:
                logger.warning("Page %d produced no text – possibly an image.", page_num)

        full_text = "\n".join(pages_text).strip()

        if not full_text:
            raise ValueError(
                "No readable text found in the PDF. "
                "Ensure it is not a scanned/image-only document."
            )

        logger.info("Extracted %d characters from PDF (%d pages).", len(full_text), len(reader.pages))
        return full_text

    except ValueError:
        raise  # re-raise our own errors unchanged
    except Exception as exc:
        logger.exception("Unexpected error while reading PDF.")
        raise RuntimeError(f"Failed to read PDF: {exc}") from exc


def split_text_into_chunks(text: str) -> List[str]:
    """
    Split a large block of text into overlapping chunks that fit
    within the embedding model's token limits.

    Uses RecursiveCharacterTextSplitter so it tries to break on
    paragraph → sentence → word boundaries before cutting mid-word.

    Args:
        text: Full document text.

    Returns:
        List of text chunks (strings).
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],   # prefer natural breaks
    )
    chunks = splitter.split_text(text)
    logger.info("Split text into %d chunks.", len(chunks))
    return chunks
