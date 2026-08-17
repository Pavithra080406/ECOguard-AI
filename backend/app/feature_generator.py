import pandas as pd
import logging
from app.live_features import calculate_dew_point, generate_time_features
from app.health_feature_generator import safe_encode_category

logger = logging.getLogger(__name__)

AQI_FEATURE_COLUMNS = [
    'PM2_5_ugm3', 'PM10_ugm3', 'CO_ugm3', 'NO2_ugm3', 'SO2_ugm3', 'O3_ugm3',
    'Dust_ugm3', 'Temp_2m_C', 'Humidity_Percent', 'Dew_Point_C',
    'Wind_Speed_10m_kmh', 'Pressure_MSL_hPa', 'Cloud_Cover_Percent',
    'Month', 'Hour', 'Day_of_Week', 'Season', 'Is_Weekend',
    'City', 'State', 'Latitude', 'Longitude'
]

def build_aqi_features(env_data: dict, aqi_encoders: dict) -> pd.DataFrame:
    """
    Transforms environmental data dict into exact 22-feature DataFrame expected by AQI ML Model.
    """
    time_feats = generate_time_features()
    pollutants = env_data.get("pollutants", {})
    weather = env_data.get("weather", {})

    temp = float(weather.get("temperature", 30.0))
    humidity = float(weather.get("humidity", 70.0))
    dew_point = calculate_dew_point(temp, humidity)

    dust = float(pollutants.get("dust", pollutants.get("pm10", 65.0) * 0.8))

    raw_city = env_data.get("city", "Chennai")
    raw_state = env_data.get("state", "Tamil Nadu")
    raw_season = time_feats["Season"]

    encoded_city = safe_encode_category(aqi_encoders.get("City"), raw_city)
    encoded_state = safe_encode_category(aqi_encoders.get("State"), raw_state)
    encoded_season = safe_encode_category(aqi_encoders.get("Season"), raw_season)

    feature_dict = {
        'PM2_5_ugm3': float(pollutants.get("pm2_5", 35.0)),
        'PM10_ugm3': float(pollutants.get("pm10", 65.0)),
        'CO_ugm3': float(pollutants.get("co", 0.8)) * 1000.0 if float(pollutants.get("co", 0.8)) < 50 else float(pollutants.get("co", 800.0)),
        'NO2_ugm3': float(pollutants.get("no2", 25.0)),
        'SO2_ugm3': float(pollutants.get("so2", 10.0)),
        'O3_ugm3': float(pollutants.get("o3", 40.0)),
        'Dust_ugm3': dust,
        'Temp_2m_C': temp,
        'Humidity_Percent': humidity,
        'Dew_Point_C': dew_point,
        'Wind_Speed_10m_kmh': float(weather.get("wind_speed", 15.0)),
        'Pressure_MSL_hPa': float(weather.get("pressure", 1013.25)),
        'Cloud_Cover_Percent': float(weather.get("cloud_cover", 20.0)),
        'Month': time_feats['Month'],
        'Hour': time_feats['Hour'],
        'Day_of_Week': time_feats['DayOfWeek'],
        'Season': encoded_season,
        'Is_Weekend': time_feats['Is_Weekend'],
        'City': encoded_city,
        'State': encoded_state,
        'Latitude': float(env_data.get("lat", 13.0827)),
        'Longitude': float(env_data.get("lon", 80.2707))
    }

    df = pd.DataFrame([feature_dict])[AQI_FEATURE_COLUMNS]
    return df
