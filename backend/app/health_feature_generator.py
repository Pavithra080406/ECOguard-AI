import numpy as np
import pandas as pd
import logging
from app.live_features import generate_time_features

logger = logging.getLogger(__name__)

HEALTH_FEATURE_COLUMNS = [
    'City', 'State', 'Latitude', 'Longitude', 'Month', 'DayOfWeek', 'Season',
    'PM2.5', 'PM10', 'NO2', 'SO2', 'O3', 'CO', 'NH3', 'Pb',
    'Temperature', 'Humidity', 'WindSpeed', 'WindDirection', 'Pressure',
    'Rainfall', 'CloudCover', 'Population', 'DayOfYear',
    'Month_Sin', 'Month_Cos', 'DayOfYear_Sin', 'DayOfYear_Cos'
]

def safe_encode_category(encoder, value):
    try:
        val_str = str(value)
        if hasattr(encoder, 'classes_') and val_str in encoder.classes_:
            return int(encoder.transform([val_str])[0])
        elif hasattr(encoder, 'classes_'):
            # Fallback to closest match or first class index
            return 0
        else:
            return 0
    except Exception as e:
        logger.warning(f"Error encoding {value}: {e}")
        return 0

def build_health_28_features(env_data: dict, health_encoders: dict) -> pd.DataFrame:
    """
    Transforms environmental data dict into exact 28-feature DataFrame expected by Health ML Model.
    """
    time_feats = generate_time_features()

    raw_city = env_data.get("city", "Chennai")
    raw_state = env_data.get("state", "Tamil Nadu")
    raw_season = time_feats["Season"]
    raw_day_of_week = time_feats["DayOfWeek"]

    encoded_city = safe_encode_category(health_encoders.get("City"), raw_city)
    encoded_state = safe_encode_category(health_encoders.get("State"), raw_state)
    encoded_season = safe_encode_category(health_encoders.get("Season"), raw_season)
    encoded_dow = safe_encode_category(health_encoders.get("DayOfWeek"), raw_day_of_week)

    pollutants = env_data.get("pollutants", {})
    weather = env_data.get("weather", {})

    # Extract pollutants safely with standard baseline imputations for missing Pb/NH3
    pm2_5 = float(pollutants.get("pm2_5", 35.0))
    pm10 = float(pollutants.get("pm10", 65.0))
    no2 = float(pollutants.get("no2", 25.0))
    so2 = float(pollutants.get("so2", 10.0))
    o3 = float(pollutants.get("o3", 40.0))
    co = float(pollutants.get("co", 0.8))
    nh3 = float(pollutants.get("nh3", 15.0) if pollutants.get("nh3") is not None else 15.0)
    pb = float(pollutants.get("pb", 0.5) if pollutants.get("pb") is not None else 0.5)

    # Weather
    temp = float(weather.get("temperature", 30.0))
    humidity = float(weather.get("humidity", 70.0))
    wind_speed = float(weather.get("wind_speed", 15.0))
    wind_dir = float(weather.get("wind_direction", 180.0))
    pressure = float(weather.get("pressure", 1013.25))
    rainfall = float(weather.get("rainfall", 0.0))
    cloud_cover = float(weather.get("cloud_cover", 20.0))

    lat = float(env_data.get("lat", 13.0827))
    lon = float(env_data.get("lon", 80.2707))
    population = float(env_data.get("population", 7090000.0))

    feature_dict = {
        'City': encoded_city,
        'State': encoded_state,
        'Latitude': lat,
        'Longitude': lon,
        'Month': time_feats['Month'],
        'DayOfWeek': encoded_dow,
        'Season': encoded_season,
        'PM2.5': pm2_5,
        'PM10': pm10,
        'NO2': no2,
        'SO2': so2,
        'O3': o3,
        'CO': co,
        'NH3': nh3,
        'Pb': pb,
        'Temperature': temp,
        'Humidity': humidity,
        'WindSpeed': wind_speed,
        'WindDirection': wind_dir,
        'Pressure': pressure,
        'Rainfall': rainfall,
        'CloudCover': cloud_cover,
        'Population': population,
        'DayOfYear': time_feats['DayOfYear'],
        'Month_Sin': time_feats['Month_Sin'],
        'Month_Cos': time_feats['Month_Cos'],
        'DayOfYear_Sin': time_feats['DayOfYear_Sin'],
        'DayOfYear_Cos': time_feats['DayOfYear_Cos']
    }

    df = pd.DataFrame([feature_dict])[HEALTH_FEATURE_COLUMNS]
    return df
