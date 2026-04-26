# app/routes/history.py
# --------------------
# GET /history/  – list user's study history
# POST /history/ – add a new activity

import logging
from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, status

from app.core.db import db
from app.core.auth import get_current_user
from app.models.schemas import ActivityCreate, ActivityResponse, HistoryResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/", response_model=HistoryResponse, summary="Get user study history")
async def get_history(user_id: str = Depends(get_current_user)):
    """
    Fetches up to 50 most recent activities for the authenticated user.
    """
    cursor = db.history.find({"user_id": user_id}).sort("timestamp", -1).limit(50)
    
    activities = []
    for doc in cursor:
        activities.append(ActivityResponse(
            id=str(doc["_id"]),
            title=doc["title"],
            type=doc["type"],
            score=doc.get("score", "N/A"),
            timestamp=doc["timestamp"],
            date=doc["date"]
        ))
    
    return HistoryResponse(activities=activities)


@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED, summary="Add a study activity")
async def add_activity(data: ActivityCreate, user_id: str = Depends(get_current_user)):
    """
    Creates a new history record for the user.
    """
    now = datetime.now()
    
    # Format date exactly as the frontend expects
    date_str = now.strftime("%b %d, %Y, %I:%M %p")
    
    activity_doc = {
        "user_id": user_id,
        "title": data.title,
        "type": data.type,
        "score": data.score,
        "timestamp": now.timestamp() * 1000, # ms for JS compatibility
        "date": date_str
    }
    
    result = db.history.insert_one(activity_doc)
    
    return ActivityResponse(
        id=str(result.inserted_id),
        title=data.title,
        type=data.type,
        score=data.score,
        timestamp=activity_doc["timestamp"],
        date=activity_doc["date"]
    )
