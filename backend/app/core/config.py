# app/core/config.py
# ------------------
# Centralised configuration using python-dotenv.
# All other modules import settings from here
# instead of reading os.environ directly.

import os
from dotenv import load_dotenv

# Load variables from the .env file at project root
load_dotenv()


class Settings:
    """Application-wide settings loaded from environment variables."""

    # Groq credentials (free at https://console.groq.com)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Groq LLM model
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # HuggingFace embedding model (runs locally, no API key needed)
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

    # Local path where the FAISS vector store will be persisted
    FAISS_INDEX_PATH: str = os.getenv("FAISS_INDEX_PATH", "faiss_index")

    # Text-splitting parameters
    CHUNK_SIZE: int = 1000   # characters per chunk
    CHUNK_OVERLAP: int = 150  # overlap between consecutive chunks

    # MongoDB connection string
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "ai_study")

    # JWT settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-change-me-in-production")
    JWT_ALGORITHM: str = "HS256"

    def validate(self) -> None:
        """Raise a clear error early if critical settings are missing."""
        if not self.GROQ_API_KEY:
            raise EnvironmentError(
                "GROQ_API_KEY is not set. "
                "Get a free key at https://console.groq.com and add it to your .env file."
            )


# Single shared instance – import this everywhere
settings = Settings()
