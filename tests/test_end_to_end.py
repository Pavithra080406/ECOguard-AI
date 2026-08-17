import pytest
from app.routes.prediction import execute_pipeline
from app.live_data import get_live_environmental_data

def test_chennai_end_to_end_pipeline():
    city = "Chennai"
    env_data = get_live_environmental_data(city)
    assert env_data["city"] == "Chennai"
    assert "pollutants" in env_data
    assert "weather" in env_data

    result = execute_pipeline(env_data, prediction_type="LIVE")

    assert "prediction_id" in result
    assert result["location"]["city"] == "Chennai"
    
    # AQI check
    assert "predicted_aqi" in result["aqi_prediction"]
    assert "top_factors" in result["aqi_prediction"]
    assert len(result["aqi_prediction"]["top_factors"]) > 0

    # Health check
    assert "health_impact_score" in result["health_prediction"]
    assert "risk_class" in result["health_prediction"]
    assert result["health_prediction"]["risk_class"] in [0, 1, 2]
    assert "risk_label" in result["health_prediction"]
    assert "top_health_factors" in result["health_prediction"]

    # Advisory & AI Summary check
    assert "decision_support" in result
    assert len(result["decision_support"]["recommended_actions"]) > 0
    assert "ai_summary" in result
    assert "Chennai" in result["ai_summary"]
