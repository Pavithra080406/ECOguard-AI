from fastapi import APIRouter, HTTPException
from app.schemas import ManualPredictionRequest, HealthPredictionOutput
from app.predictor import predictor
from app.xai import xai
from app.advisory import generate_health_advisory

router = APIRouter(prefix="/api/predict", tags=["Health Assessment"])

@router.post("/health", response_model=HealthPredictionOutput)
def predict_health_only(req: ManualPredictionRequest):
    try:
        env_data = {
            "city": req.city,
            "state": req.state,
            "population": req.population,
            "pollutants": {
                "pm2_5": req.pm2_5, "pm10": req.pm10, "no2": req.no2,
                "so2": req.so2, "o3": req.o3, "co": req.co,
                "nh3": req.nh3, "pb": req.pb
            },
            "weather": {
                "temperature": req.temperature, "humidity": req.humidity,
                "wind_speed": req.wind_speed, "wind_direction": req.wind_direction,
                "pressure": req.pressure, "rainfall": req.rainfall,
                "cloud_cover": req.cloud_cover
            }
        }
        health_score, risk_class, risk_label, risk_desc, df_feats = predictor.predict_health(env_data)
        shap_factors = xai.explain_health(predictor.health_model, df_feats, env_data)

        # Get AQI baseline for contextual advisory
        aqi_val, _ = predictor.predict_aqi(env_data)
        cat_info = predictor.get_aqi_category(aqi_val)
        advice, _ = generate_health_advisory(aqi_val, cat_info["category"], health_score, risk_class, shap_factors, env_data["weather"])

        return {
            "health_impact_score": health_score,
            "risk_class": risk_class,
            "risk_label": risk_label,
            "risk_description": risk_desc,
            "model_estimate": "XGBRegressor model continuous score mapped to 3-class thresholds (Low <= 3.8955, Moderate <= 5.0735, High > 5.0735)",
            "top_health_factors": shap_factors,
            "health_advice": advice
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health Prediction Error: {str(e)}")
