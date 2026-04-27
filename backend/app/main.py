# app/main.py
# ------------
# Application entry point.
# Creates the FastAPI app, wires up all routers, and configures
# CORS, logging, and startup validation.

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import upload, chat, summary, quiz, auth, history

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs once at startup before the server accepts requests.
    - Validates that critical env vars are present.
    - Pre-loads the FAISS index if one already exists on disk.
    """
    logger.info("=== AI Study Assistant – starting up ===")

    # Validate env vars (raises EnvironmentError with a clear message if missing)
    settings.validate()

    # Attempt to pre-load an existing FAISS index so first request is fast
    try:
        from app.services.rag_service import load_index
        idx = load_index()
        if idx:
            logger.info("Pre-loaded existing FAISS index from disk.")
        else:
            logger.info("No existing FAISS index found – upload a PDF to get started.")
    except Exception:
        logger.warning("Could not pre-load FAISS index (non-fatal).")

    yield   # Application runs here

    logger.info("=== AI Study Assistant – shutting down ===")


# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Study Assistant",
    description=(
        "A RAG-powered study assistant that lets students upload a PDF "
        "and then chat with it, get a summary, or generate a quiz."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS – restricted for security and to allow credentials (Authorization headers) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(summary.router)
app.include_router(quiz.router)
app.include_router(history.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"], summary="Health check")
async def health():
    """Returns 200 OK if the server is running."""
    return {"status": "ok", "version": "1.0.0"}
