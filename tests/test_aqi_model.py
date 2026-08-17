import pytest
from app.predictor import predictor
from app.feature_generator import build_aqi_features, AQI_FEATURE_COLUMNS

def test_aqi_feature_generator_structure():
    sample_env = {
        "city": "Chennai",
        "state": "Tamil Nadu",
        "lat": 13.0827,
        "lon": 80.2707,
        "pollutants": {"pm2_5": 38.5, "pm10": 72.4, "no2": 26.2, "so2": 11.5, "o3": 42.1, "co": 0.85},
        "weather": {"temperature": 31.2, "humidity": 78, "wind_speed": 16.5, "pressure": 1009, "cloud_cover": 40}
    }
    df_feats = build_aqi_features(sample_env, predictor.aqi_encoders)
    assert len(df_feats.columns) == 22
    assert list(df_feats.columns) == AQI_FEATURE_COLUMNS

def test_aqi_prediction_execution():
    sample_env = {
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pollutants": {"pm2_5": 38.5, "pm10": 72.4, "no2": 26.2, "so2": 11.5, "o3": 42.1, "co": 0.85},
        "weather": {"temperature": 31.2, "humidity": 78, "wind_speed": 16.5}
    }
    aqi_val, df_feats = predictor.predict_aqi(sample_env)
    assert isinstance(aqi_val, float)
    assert aqi_val >= 0.0
    cat_info = predictor.get_aqi_category(aqi_val)
    assert "category" in cat_info
    assert "color_code" in cat_info
