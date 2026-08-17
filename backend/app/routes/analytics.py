from fastapi import APIRouter
from app.analytics import get_analytics_overview

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Monitoring"])

@router.get("/overview")
def analytics_overview():
    return get_analytics_overview()
