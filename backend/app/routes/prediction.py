import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from app.schemas import FullPredictionResponse, LivePredictionRequest, ManualPredictionRequest
from app.live_data import get_live_environmental_data
from app.predictor import predictor
from app.xai import xai
from app.advisory import generate_health_advisory, generate_ai_summary
from app.database import db

router = APIRouter(prefix="/api", tags=["Full Prediction Pipeline"])

def execute_pipeline(env_data: dict, prediction_type: str = "LIVE") -> dict:
    pred_id = f"pred_{uuid.uuid4().hex[:10]}"
    pred_time = datetime.now().isoformat()

    # 1. AQI Prediction
    aqi_val, df_aqi = predictor.predict_aqi(env_data)
    cat_info = predictor.get_aqi_category(aqi_val)
    aqi_shap = xai.explain_aqi(predictor.aqi_model, df_aqi, env_data)

    # 2. Health Prediction (28 features)
    health_score, risk_class, risk_label, risk_desc, df_health = predictor.predict_health(env_data)
    health_shap = xai.explain_health(predictor.health_model, df_health, env_data)

    # 3. Advisory & Decision Support
    advice, decision_support = generate_health_advisory(
        aqi_val, cat_info["category"], health_score, risk_class, health_shap, env_data.get("weather", {})
    )

    # 4. Dynamic AI Summary
    summary_text = generate_ai_summary(
        env_data["city"], aqi_val, cat_info["category"], health_score, risk_label, health_shap
    )

    pollutants = env_data.get("pollutants", {})
    weather = env_data.get("weather", {})

    record = {
        "prediction_id": pred_id,
        "prediction_time": pred_time,
        "prediction_type": prediction_type,
        "location": {
            "city": env_data["city"],
            "state": env_data["state"],
            "latitude": float(env_data["lat"]),
            "longitude": float(env_data["lon"])
        },
        "weather": {
            "temperature": float(weather.get("temperature", 30.0)),
            "humidity": float(weather.get("humidity", 70.0)),
            "wind_speed": float(weather.get("wind_speed", 15.0)),
            "wind_direction": float(weather.get("wind_direction", 180.0)),
            "pressure": float(weather.get("pressure", 1013.25)),
            "cloud_cover": float(weather.get("cloud_cover", 20.0)),
            "rainfall": float(weather.get("rainfall", 0.0))
        },
        "pollutants": {
            "pm2_5": float(pollutants.get("pm2_5", 35.0)),
            "pm10": float(pollutants.get("pm10", 65.0)),
            "no2": float(pollutants.get("no2", 25.0)),
            "so2": float(pollutants.get("so2", 10.0)),
            "o3": float(pollutants.get("o3", 40.0)),
            "co": float(pollutants.get("co", 0.8)),
            "nh3": float(pollutants.get("nh3", 15.0)),
            "pb": float(pollutants.get("pb", 0.5))
        },
        "aqi_prediction": {
            "predicted_aqi": aqi_val,
            "aqi_category": cat_info["category"],
            "aqi_meaning": cat_info["meaning"],
            "color_code": cat_info["color_code"],
            "top_factors": aqi_shap
        },
        "health_prediction": {
            "health_impact_score": health_score,
            "risk_class": risk_class,
            "risk_label": risk_label,
            "risk_description": risk_desc,
            "model_estimate": "XGBRegressor model continuous score mapped to 3-class thresholds (Low <= 3.8955, Moderate <= 5.0735, High > 5.0735)",
            "top_health_factors": health_shap,
            "health_advice": advice
        },
        "decision_support": decision_support,
        "ai_summary": summary_text,
        "model_version": "1.0.0-xgb"
    }

    # Store into MongoDB
    db.insert_prediction("prediction_history", record)

    return record

@router.get("/live/{city}", response_model=FullPredictionResponse)
def get_live_prediction_by_city(city: str):
    try:
        env_data = get_live_environmental_data(city)
        return execute_pipeline(env_data, prediction_type="LIVE")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live prediction error for {city}: {str(e)}")

@router.post("/predict/live", response_model=FullPredictionResponse)
def post_live_prediction(req: LivePredictionRequest):
    try:
        env_data = get_live_environmental_data(req.city)
        return execute_pipeline(env_data, prediction_type="LIVE")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live prediction error: {str(e)}")

@router.post("/predict/manual", response_model=FullPredictionResponse)
def post_manual_prediction(req: ManualPredictionRequest):
    try:
        env_data = {
            "city": req.city,
            "state": req.state,
            "lat": 13.0827,
            "lon": 80.2707,
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
        return execute_pipeline(env_data, prediction_type="MANUAL")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Manual prediction error: {str(e)}")

@router.get("/history/aqi")
def get_aqi_history(limit: int = Query(20, ge=1, le=100), city: str = None):
    return db.get_history("prediction_history", limit=limit, city=city)

@router.get("/history/health")
def get_health_history(limit: int = Query(20, ge=1, le=100), city: str = None):
    return db.get_history("prediction_history", limit=limit, city=city)

@router.get("/model/info")
def get_model_info():
    return {
        "aqi_model": {
            "type": "XGBRegressor",
            "features_count": 22,
            "features": [
                'PM2_5_ugm3', 'PM10_ugm3', 'CO_ugm3', 'NO2_ugm3', 'SO2_ugm3', 'O3_ugm3',
                'Dust_ugm3', 'Temp_2m_C', 'Humidity_Percent', 'Dew_Point_C',
                'Wind_Speed_10m_kmh', 'Pressure_MSL_hPa', 'Cloud_Cover_Percent',
                'Month', 'Hour', 'Day_of_Week', 'Season', 'Is_Weekend',
                'City', 'State', 'Latitude', 'Longitude'
            ]
        },
        "health_model": {
            "type": "XGBRegressor (Continuous HealthImpactScore)",
            "features_count": 28,
            "features": [
                'City', 'State', 'Latitude', 'Longitude', 'Month', 'DayOfWeek', 'Season',
                'PM2.5', 'PM10', 'NO2', 'SO2', 'O3', 'CO', 'NH3', 'Pb',
                'Temperature', 'Humidity', 'WindSpeed', 'WindDirection', 'Pressure',
                'Rainfall', 'CloudCover', 'Population', 'DayOfYear',
                'Month_Sin', 'Month_Cos', 'DayOfYear_Sin', 'DayOfYear_Cos'
            ],
            "thresholds": predictor.health_thresholds,
            "mapping": predictor.health_mapping,
            "baseline_metrics": {"MAE": 0.9790, "RMSE": 1.3196, "R2": 0.5411}
        }
    }
