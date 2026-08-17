import os
from pathlib import Path
from dotenv import load_dotenv

# Load root .env
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "ECOguard AI"
    VERSION: str = "1.0.0"
    
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "ecoguard_ai")
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
    
    MODELS_DIR: Path = BASE_DIR / "models"
    DATA_DIR: Path = BASE_DIR / "data"
    
    AQI_MODEL_PATH: Path = MODELS_DIR / "aqi_model.pkl"
    AQI_ENCODERS_PATH: Path = MODELS_DIR / "label_encoders.pkl"
    HEALTH_MODEL_PATH: Path = MODELS_DIR / "health_impact_3class_model.pkl"
    HEALTH_ENCODERS_PATH: Path = MODELS_DIR / "health_label_encoders.pkl"
    HEALTH_THRESHOLDS_PATH: Path = MODELS_DIR / "health_3class_thresholds.pkl"
    HEALTH_MAPPING_PATH: Path = MODELS_DIR / "health_3class_mapping.pkl"

settings = Settings()
