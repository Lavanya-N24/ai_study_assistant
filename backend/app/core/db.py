# app/core/db.py
# ----------------
# MongoDB connection.
# Exports a `db` handle used by auth routes and for persisting
# chat / document metadata.

import logging
from pymongo import MongoClient

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Connect to MongoDB ────────────────────────────────────────────────────────
client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

logger.info("MongoDB client initialised (db=%s).", settings.MONGO_DB_NAME)
