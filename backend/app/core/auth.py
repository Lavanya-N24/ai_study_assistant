# app/core/auth.py
# -----------------
# JWT utilities and FastAPI dependency for protecting routes.
#
# Usage in any route:
#   from app.core.auth import get_current_user
#   @router.post("/")
#   async def my_route(user_id: str = Depends(get_current_user)):
#       ...

from fastapi import Header, HTTPException, status
from jose import jwt, JWTError

from app.core.config import settings


def create_access_token(user_id: str) -> str:
    """Create a JWT containing the user's Mongo _id."""
    payload = {"user_id": user_id}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def get_current_user(authorization: str = Header(..., description="Bearer <token>")) -> str:
    """
    FastAPI dependency – extracts and validates the JWT from the
    Authorization header.  Returns the `user_id` string.

    Raises 401 if the token is missing, malformed, or invalid.
    """
    # ── Parse "Bearer <token>" ────────────────────────────────────────────────
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must be: Bearer <token>",
        )

    token = parts[1]

    # ── Decode ────────────────────────────────────────────────────────────────
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )

    user_id: str | None = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing user_id.",
        )

    return user_id
