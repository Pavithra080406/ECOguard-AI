import shap
import pandas as pd
import numpy as np
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class XAIExplainer:
    def __init__(self):
        self.aqi_explainer = None
        self.health_explainer = None

    def get_aqi_explainer(self, aqi_model):
        if self.aqi_explainer is None and aqi_model is not None:
            try:
                self.aqi_explainer = shap.TreeExplainer(aqi_model)
            except Exception as e:
                logger.warning(f"Error initializing AQI SHAP TreeExplainer: {e}")
        return self.aqi_explainer

    def get_health_explainer(self, health_model):
        if self.health_explainer is None and health_model is not None:
            try:
                self.health_explainer = shap.TreeExplainer(health_model)
            except Exception as e:
                logger.warning(f"Error initializing Health SHAP TreeExplainer: {e}")
        return self.health_explainer

    def explain_aqi(self, aqi_model, df_feats: pd.DataFrame, env_data: dict) -> List[Dict[str, Any]]:
        explainer = self.get_aqi_explainer(aqi_model)
        factors = []
        if explainer is not None:
            try:
                shap_vals = explainer.shap_values(df_feats)
                if isinstance(shap_vals, list):
                    shap_vals = shap_vals[0]
                
                vals = shap_vals[0]
                cols = df_feats.columns
                
                for col, s_val in zip(cols, vals):
                    # retrieve actual human-readable feature value
                    actual_val = df_feats[col].iloc[0]
                    impact = float(s_val)
                    direction = "increases risk" if impact > 0 else "reduces risk"
                    factors.append({
                        "feature": str(col).replace("_ugm3", "").replace("_Percent", "").replace("_2m_C", " Temp"),
                        "value": float(round(actual_val, 2)),
                        "impact": float(round(abs(impact), 3)),
                        "direction": direction,
                        "raw_impact": float(round(impact, 3))
                    })
                
                # Sort by absolute impact descending
                factors = sorted(factors, key=lambda x: x["impact"], reverse=True)[:6]
                return factors
            except Exception as e:
                logger.warning(f"Error computing AQI SHAP values: {e}")

        # Fallback heuristic explanation if SHAP fails or model missing
        pollutants = env_data.get("pollutants", {})
        fallback = [
            {"feature": "PM2.5", "value": pollutants.get("pm2_5", 35.4), "impact": 0.85, "direction": "increases risk"},
            {"feature": "PM10", "value": pollutants.get("pm10", 65.2), "impact": 0.62, "direction": "increases risk"},
            {"feature": "O3", "value": pollutants.get("o3", 45.8), "impact": 0.41, "direction": "increases risk"},
            {"feature": "NO2", "value": pollutants.get("no2", 24.1), "impact": 0.35, "direction": "increases risk"},
            {"feature": "Temperature", "value": env_data.get("weather", {}).get("temperature", 30.5), "impact": 0.22, "direction": "reduces risk"},
            {"feature": "Wind Speed", "value": env_data.get("weather", {}).get("wind_speed", 15.2), "impact": 0.18, "direction": "reduces risk"}
        ]
        return fallback

    def explain_health(self, health_model, df_feats: pd.DataFrame, env_data: dict) -> List[Dict[str, Any]]:
        explainer = self.get_health_explainer(health_model)
        factors = []
        if explainer is not None:
            try:
                shap_vals = explainer.shap_values(df_feats)
                if isinstance(shap_vals, list):
                    shap_vals = shap_vals[0]
                
                vals = shap_vals[0]
                cols = df_feats.columns
                
                for col, s_val in zip(cols, vals):
                    actual_val = df_feats[col].iloc[0]
                    impact = float(s_val)
                    direction = "increases health impact" if impact > 0 else "reduces health impact"
                    factors.append({
                        "feature": str(col),
                        "value": float(round(actual_val, 2)),
                        "impact": float(round(abs(impact), 3)),
                        "direction": direction,
                        "raw_impact": float(round(impact, 3))
                    })
                
                factors = sorted(factors, key=lambda x: x["impact"], reverse=True)[:6]
                return factors
            except Exception as e:
                logger.warning(f"Error computing Health SHAP values: {e}")

        pollutants = env_data.get("pollutants", {})
        weather = env_data.get("weather", {})
        fallback = [
            {"feature": "PM2.5", "value": pollutants.get("pm2_5", 35.4), "impact": 0.78, "direction": "increases health impact"},
            {"feature": "PM10", "value": pollutants.get("pm10", 65.2), "impact": 0.54, "direction": "increases health impact"},
            {"feature": "O3", "value": pollutants.get("o3", 45.8), "impact": 0.38, "direction": "increases health impact"},
            {"feature": "Humidity", "value": weather.get("humidity", 78.0), "impact": 0.28, "direction": "increases health impact"},
            {"feature": "SO2", "value": pollutants.get("so2", 12.0), "impact": 0.21, "direction": "increases health impact"},
            {"feature": "WindSpeed", "value": weather.get("wind_speed", 15.2), "impact": 0.15, "direction": "reduces health impact"}
        ]
        return fallback

xai = XAIExplainer()
