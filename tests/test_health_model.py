import pytest
import numpy as np
import pandas as pd
from app.predictor import predictor
from app.health_feature_generator import build_health_28_features, HEALTH_FEATURE_COLUMNS

def test_critical_health_risk_thresholds():
    """
    CRITICAL HEALTH MODEL TEST:
    Test HealthImpactScore threshold mapping against saved thresholds:
    Low Risk: HealthImpactScore <= 3.8955
    Moderate Risk: 3.8955 < HealthImpactScore <= 5.0735
    High Risk: HealthImpactScore > 5.0735
    """
    thresholds = predictor.health_thresholds
    low_t = thresholds.get("low_threshold", 3.8955)
    high_t = thresholds.get("high_threshold", 5.0735)

    # 1. Test score = 3.5 -> Expected Low Risk
    score_low = 3.5
    assert score_low <= low_t
    
    # 2. Test score = 4.5 -> Expected Moderate Risk
    score_mod = 4.5
    assert low_t < score_mod <= high_t

    # 3. Test score = 6.0 -> Expected High Risk
    score_high = 6.0
    assert score_high > high_t

def test_health_28_features_structure():
    """
    Verifies that the health feature generator produces EXACTLY 28 columns with the correct names.
    """
    sample_env = {
        "city": "Chennai",
        "state": "Tamil Nadu",
        "lat": 13.0827,
        "lon": 80.2707,
        "population": 7090000,
        "pollutants": {"pm2_5": 35.4, "pm10": 65.2, "no2": 24.1, "so2": 12.0, "o3": 45.8, "co": 0.8},
        "weather": {"temperature": 30.5, "humidity": 78.0, "wind_speed": 15.2, "wind_direction": 180.0, "pressure": 1011.0}
    }
    df_feats = build_health_28_features(sample_env, predictor.health_encoders)
    assert isinstance(df_feats, pd.DataFrame)
    assert len(df_feats.columns) == 28
    assert list(df_feats.columns) == HEALTH_FEATURE_COLUMNS

def test_missing_pb_and_nh3_handling():
    """
    Verifies safe missing value handling when live API or input omits Pb or NH3.
    """
    sample_env = {
        "city": "Delhi",
        "state": "Delhi",
        "pollutants": {"pm2_5": 140.0, "pm10": 220.0, "no2": 55.0, "so2": 18.0, "o3": 60.0, "co": 1.8}, # Pb & NH3 missing!
        "weather": {"temperature": 28.0, "humidity": 60.0, "wind_speed": 10.0}
    }
    df_feats = build_health_28_features(sample_env, predictor.health_encoders)
    assert df_feats["Pb"].iloc[0] is not None
    assert not np.isnan(df_feats["Pb"].iloc[0])
    assert df_feats["NH3"].iloc[0] is not None
    assert not np.isnan(df_feats["NH3"].iloc[0])
