# app/models/schemas.py
# ----------------------
# Pydantic request / response models used across all routes.
# Keeping them here gives a single source of truth for the API contract.

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    """Payload for user registration."""
    email: str = Field(..., min_length=5, description="User email address")
    password: str = Field(..., min_length=6, description="User password (min 6 chars)")


class LoginRequest(BaseModel):
    """Payload for user login."""
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class AuthResponse(BaseModel):
    """Returned after successful register or login."""
    token: str
    message: str


class GoogleAuthRequest(BaseModel):
    """Payload for Google OAuth login."""
    token: str = Field(..., description="Google ID Token")


# ── Upload ────────────────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    """Returned after a PDF is successfully processed and indexed."""
    message: str
    filename: str
    chunks_indexed: int


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    """Payload sent by the client when asking a question."""
    question: str = Field(..., min_length=3, description="User's question")
    top_k: int = Field(default=4, ge=1, le=10, description="Number of context chunks to retrieve")


class ChatResponse(BaseModel):
    """RAG-powered answer returned to the client."""
    answer: str
    sources: Optional[List[str]] = None   # excerpt snippets used as context


# ── Summary ───────────────────────────────────────────────────────────────────

class SummaryResponse(BaseModel):
    """A structured summary of the uploaded document."""
    summary: str


# ── Quiz ──────────────────────────────────────────────────────────────────────

class QuizOption(BaseModel):
    """A single MCQ option."""
    label: str          # e.g. "A", "B", "C", "D"
    text: str


class QuizQuestion(BaseModel):
    """One multiple-choice question with its answer."""
    question: str
    options: List[QuizOption]
    answer: str         # correct label, e.g. "B"
    explanation: str    # brief rationale


class QuizResponse(BaseModel):
    """Five MCQ questions generated from the document."""
    questions: List[QuizQuestion]


# ── History ───────────────────────────────────────────────────────────────────

class ActivityBase(BaseModel):
    """Base fields for a study activity."""
    title: str
    type: str  # 'upload' | 'chat' | 'summary' | 'quiz'
    score: Optional[str] = "N/A"


class ActivityCreate(ActivityBase):
    """Payload for creating a new history entry."""
    pass


class ActivityResponse(ActivityBase):
    """A history entry returned from the database."""
    id: str
    date: str
    timestamp: float


class HistoryResponse(BaseModel):
    """List of activities for a user."""
    activities: List[ActivityResponse]
