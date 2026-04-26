# app/services/rag_service.py
# ----------------------------
# Manages the FAISS vector store:
#   - Building / updating the index from text chunks
#   - Persisting the index to disk
#   - Loading the index back on startup or on demand
#   - Similarity search for relevant context chunks
#
# Embeddings are generated locally using HuggingFace sentence-transformers
# (all-MiniLM-L6-v2) — completely free, no API key required.

import os
import logging
from typing import List, Optional

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from app.core.config import settings

logger = logging.getLogger(__name__)

# Module-level cache so we don't reload the index on every request
_vector_store: Optional[FAISS] = None

# Embedding model cache (loading takes ~2s the first time; reuse after that)
_embeddings: Optional[HuggingFaceEmbeddings] = None


def _get_embeddings() -> HuggingFaceEmbeddings:
    """
    Return a cached HuggingFace embeddings instance.
    The model is downloaded once and cached locally by sentence-transformers.
    """
    global _embeddings
    if _embeddings is None:
        logger.info("Loading HuggingFace embedding model: %s", settings.EMBEDDING_MODEL)
        _embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
    return _embeddings


def build_and_save_index(chunks: List[str]) -> int:
    """
    Generate embeddings for *chunks*, build a FAISS index, and
    persist it to disk so it survives server restarts.

    Args:
        chunks: List of text strings to embed.

    Returns:
        Number of chunks successfully indexed.

    Raises:
        RuntimeError: On any embedding / storage failure.
    """
    global _vector_store

    try:
        embeddings = _get_embeddings()

        logger.info("Generating embeddings for %d chunks…", len(chunks))
        vector_store = FAISS.from_texts(texts=chunks, embedding=embeddings)

        # Persist to the configured local path
        os.makedirs(settings.FAISS_INDEX_PATH, exist_ok=True)
        vector_store.save_local(settings.FAISS_INDEX_PATH)

        # Update in-memory cache
        _vector_store = vector_store

        logger.info("FAISS index saved to '%s'.", settings.FAISS_INDEX_PATH)
        return len(chunks)

    except Exception as exc:
        logger.exception("Failed to build FAISS index.")
        raise RuntimeError(f"Index build failed: {exc}") from exc


def load_index() -> Optional[FAISS]:
    """
    Load the FAISS index from disk into the module-level cache.
    Returns None if no index exists yet (no PDF has been uploaded).
    """
    global _vector_store

    index_file = os.path.join(settings.FAISS_INDEX_PATH, "index.faiss")
    if not os.path.exists(index_file):
        logger.warning("No FAISS index found at '%s'.", settings.FAISS_INDEX_PATH)
        return None

    try:
        embeddings = _get_embeddings()
        _vector_store = FAISS.load_local(
            settings.FAISS_INDEX_PATH,
            embeddings,
            allow_dangerous_deserialization=True,  # required by LangChain >= 0.1.x
        )
        logger.info("FAISS index loaded from '%s'.", settings.FAISS_INDEX_PATH)
        return _vector_store

    except Exception as exc:
        logger.exception("Failed to load FAISS index.")
        raise RuntimeError(f"Index load failed: {exc}") from exc


def get_vector_store() -> FAISS:
    """
    Return the in-memory vector store, loading from disk if needed.

    Raises:
        RuntimeError: If no index exists (user hasn't uploaded a PDF yet).
    """
    global _vector_store

    if _vector_store is None:
        _vector_store = load_index()

    if _vector_store is None:
        raise RuntimeError(
            "No document index found. Please upload a PDF first via POST /upload."
        )

    return _vector_store


def retrieve_relevant_chunks(query: str, top_k: int = 4) -> List[str]:
    """
    Perform a similarity search and return the top-k most relevant
    text chunks for the given *query*.

    Args:
        query: The user's question / search string.
        top_k: How many chunks to return.

    Returns:
        List of chunk strings ordered by relevance (most relevant first).
    """
    store = get_vector_store()
    docs = store.similarity_search(query, k=top_k)
    return [doc.page_content for doc in docs]
