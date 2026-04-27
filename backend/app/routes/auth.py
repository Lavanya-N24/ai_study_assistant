# app/routes/auth.py
# -------------------
# POST /auth/register  – create a new user
# POST /auth/login     – authenticate and return a JWT

import logging
import bcrypt
import os
from fastapi import APIRouter, HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests

from app.core.db import db
from app.core.auth import create_access_token
from app.models.schemas import RegisterRequest, LoginRequest, AuthResponse, GoogleAuthRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])


def hash_password(password: str) -> str:
    """Hash a plain-text password with bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


# ── Register ──────────────────────────────────────────────────────────────────

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(data: RegisterRequest):
    """
    1. Check if email already exists.
    2. Hash the password with bcrypt.
    3. Insert the user document into MongoDB.
    4. Return a JWT so the user is logged-in immediately.
    """
    # Duplicate check
    if db.users.find_one({"email": data.email}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    hashed_password = hash_password(data.password)

    result = db.users.insert_one({
        "email": data.email,
        "password": hashed_password,
    })

    token = create_access_token(user_id=str(result.inserted_id))

    return AuthResponse(token=token, message="Registration successful.")


# ── Login ─────────────────────────────────────────────────────────────────────
from app.core.config import settings

@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login and get JWT token",
)
async def login(data: LoginRequest):
    """
    1. Find user by email.
    2. Verify password against the stored bcrypt hash.
    3. Return a JWT on success.
    """
    user = db.users.find_one({"email": data.email})

    # BUG FIX: Handle users created via Google OAuth who don't have a 'password' field.
    # Without this check, accessing user["password"] would raise a KeyError (500 error).
    if not user or "password" not in user or not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(user_id=str(user["_id"]))

    return AuthResponse(token=token, message="Login successful.")


# ── Google OAuth ──────────────────────────────────────────────────────────────

@router.post(
    "/google",
    response_model=AuthResponse,
    summary="Login with Google OAuth",
)
async def google_login(data: GoogleAuthRequest):
    """
    1. Verify Google ID token.
    2. Extract email.
    3. Find or create user.
    4. Return JWT.
    """
    try:
        # Verify the token
        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            logger.error("GOOGLE_CLIENT_ID is not set in settings.")
            raise HTTPException(status_code=500, detail="Server misconfiguration.")
            
        idinfo = id_token.verify_oauth2_token(data.token, requests.Request(), client_id)
        
        email = idinfo.get("email")
        if not email:
            raise ValueError("Email not found in Google token")

        # Find or create user
        user = db.users.find_one({"email": email})
        if not user:
            # Create a new user without a password
            result = db.users.insert_one({
                "email": email,
                "auth_provider": "google"
            })
            user_id = str(result.inserted_id)
        else:
            user_id = str(user["_id"])

        token = create_access_token(user_id=user_id)
        return AuthResponse(token=token, message="Google Login successful.")

    except ValueError as e:
        logger.error(f"Google token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token.",
        )
