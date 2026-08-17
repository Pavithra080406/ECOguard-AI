from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import db
from app.routes import aqi, health, prediction, analytics, mlops

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Air Quality Forecasting and Health Risk Assessment Platform"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    db.connect()

@app.get("/")
def root():
    return {
        "message": "Welcome to ECOguard AI API",
        "health_check": "/health",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected" if not db.use_in_memory else "in-memory-fallback"
    }

# Include API Routers
app.include_router(aqi.router)
app.include_router(health.router)
app.include_router(prediction.router)
app.include_router(analytics.router)
app.include_router(mlops.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
