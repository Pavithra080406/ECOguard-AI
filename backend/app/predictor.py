import joblib
import pickle
import numpy as np
import pandas as pd
import logging
from app.config import settings
from app.feature_generator import build_aqi_features
from app.health_feature_generator import build_health_28_features

logger = logging.getLogger(__name__)

class ModelPredictor:
    def __init__(self):
        self.aqi_model = None
        self.aqi_encoders = {}
        self.health_model = None
        self.health_encoders = {}
        self.health_thresholds = {"low_threshold": 3.8955, "high_threshold": 5.0735}
        self.health_mapping = {0: "Low Risk", 1: "Moderate Risk", 2: "High Risk"}
        self.load_models()

    def load_models(self):
        # AQI Model
        try:
            with open(settings.AQI_MODEL_PATH, "rb") as f:
                self.aqi_model = pickle.load(f)
            logger.info("AQI XGBoost model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load AQI model: {e}")

        # AQI Encoders
        try:
            self.aqi_encoders = joblib.load(settings.AQI_ENCODERS_PATH)
            logger.info("AQI label encoders loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load AQI label encoders: {e}")

        # Health Model
        try:
            with open(settings.HEALTH_MODEL_PATH, "rb") as f:
                self.health_model = pickle.load(f)
            logger.info("Health Impact XGBoost regression model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Health model: {e}")

        # Health Encoders
        try:
            self.health_encoders = joblib.load(settings.HEALTH_ENCODERS_PATH)
            logger.info("Health label encoders loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Health label encoders: {e}")

        # Health Thresholds
        try:
            if settings.HEALTH_THRESHOLDS_PATH.exists():
                with open(settings.HEALTH_THRESHOLDS_PATH, "rb") as f:
                    self.health_thresholds = pickle.load(f)
                logger.info(f"Health thresholds loaded: {self.health_thresholds}")
        except Exception as e:
            logger.error(f"Failed to load Health thresholds: {e}")

        # Health Mapping
        try:
            if settings.HEALTH_MAPPING_PATH.exists():
                with open(settings.HEALTH_MAPPING_PATH, "rb") as f:
                    self.health_mapping = pickle.load(f)
                logger.info(f"Health mapping loaded: {self.health_mapping}")
        except Exception as e:
            logger.error(f"Failed to load Health mapping: {e}")

    def get_aqi_category(self, aqi_val: float):
        if aqi_val <= 50.0:
            return {
                "category": "Good",
                "color_code": "#10B981",
                "meaning": "Air quality is satisfactory, and air pollution poses little or no risk."
            }
        elif aqi_val <= 100.0:
            return {
                "category": "Moderate",
                "color_code": "#F59E0B",
                "meaning": "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for sensitive individuals."
            }
        elif aqi_val <= 150.0:
            return {
                "category": "Unhealthy for Sensitive Groups",
                "color_code": "#F97316",
                "meaning": "Members of sensitive groups may experience health effects. The general public is less likely to be affected."
            }
        elif aqi_val <= 200.0:
            return {
                "category": "Unhealthy",
                "color_code": "#EF4444",
                "meaning": "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
            }
        elif aqi_val <= 300.0:
            return {
                "category": "Very Unhealthy",
                "color_code": "#8B5CF6",
                "meaning": "Health alert: everyone may experience more serious health effects."
            }
        else:
            return {
                "category": "Hazardous",
                "color_code": "#7C2D12",
                "meaning": "Health warnings of emergency conditions. The entire population is more likely to be affected."
            }

    def predict_aqi(self, env_data: dict) -> tuple[float, pd.DataFrame]:
        df_feats = build_aqi_features(env_data, self.aqi_encoders)
        if self.aqi_model is not None:
            pred = float(self.aqi_model.predict(df_feats)[0])
            # Ensure non-negative AQI
            aqi_val = max(0.0, float(pred))
        else:
            # Physics-based baseline estimation
            p = env_data.get("pollutants", {})
            aqi_val = float(p.get("pm2_5", 35.0) * 1.8 + p.get("pm10", 65.0) * 0.5)
        return round(aqi_val, 1), df_feats

    def predict_health(self, env_data: dict) -> tuple[float, int, str, str, pd.DataFrame]:
        df_feats = build_health_28_features(env_data, self.health_encoders)
        if self.health_model is not None:
            raw_pred = float(self.health_model.predict(df_feats)[0])
            health_score = float(raw_pred)
        else:
            # Baseline fallback estimation
            p = env_data.get("pollutants", {})
            health_score = float(3.0 + p.get("pm2_5", 35.0) * 0.04)

        low_t = self.health_thresholds.get("low_threshold", 3.8955)
        high_t = self.health_thresholds.get("high_threshold", 5.0735)

        if health_score <= low_t:
            risk_class = 0
            risk_label = "Low Risk"
            risk_desc = "Environmental exposure poses low health risk for the population."
        elif health_score <= high_t:
            risk_class = 1
            risk_label = "Moderate Risk"
            risk_desc = "Moderate risk of respiratory or cardiovascular irritation in sensitive groups."
        else:
            risk_class = 2
            risk_label = "High Risk"
            risk_desc = "Elevated risk of health impacts. Prolonged outdoor activity should be reduced."

        return round(health_score, 2), risk_class, risk_label, risk_desc, df_feats

predictor = ModelPredictor()
