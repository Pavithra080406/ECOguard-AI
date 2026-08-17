from fastapi import APIRouter, HTTPException
from app.schemas import ManualPredictionRequest, AQIPredictionOutput
from app.predictor import predictor
from app.xai import xai

router = APIRouter(prefix="/api/predict", tags=["AQI Prediction"])

@router.post("/aqi", response_model=AQIPredictionOutput)
def predict_aqi_only(req: ManualPredictionRequest):
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
        aqi_val, df_feats = predictor.predict_aqi(env_data)
        cat_info = predictor.get_aqi_category(aqi_val)
        shap_factors = xai.explain_aqi(predictor.aqi_model, df_feats, env_data)

        return {
            "predicted_aqi": aqi_val,
            "aqi_category": cat_info["category"],
            "aqi_meaning": cat_info["meaning"],
            "color_code": cat_info["color_code"],
            "top_factors": shap_factors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AQI Prediction Error: {str(e)}")
