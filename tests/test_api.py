import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "system" in data

def test_live_city_endpoint():
    res = client.get("/api/live/Chennai")
    assert res.status_code == 200
    data = res.json()
    assert data["location"]["city"] == "Chennai"
    assert "aqi_prediction" in data
    assert "health_prediction" in data

def test_manual_prediction_endpoint():
    payload = {
        "pm2_5": 42.0, "pm10": 85.0, "no2": 30.0, "so2": 15.0,
        "o3": 50.0, "co": 0.9, "nh3": 16.0, "pb": 0.4,
        "temperature": 32.0, "humidity": 75.0, "wind_speed": 14.0,
        "wind_direction": 180.0, "pressure": 1010.0, "rainfall": 0.0,
        "cloud_cover": 30.0, "city": "Chennai", "state": "Tamil Nadu", "population": 7090000
    }
    res = client.post("/api/predict/manual", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["prediction_type"] == "MANUAL"
    assert data["aqi_prediction"]["predicted_aqi"] > 0
    assert data["health_prediction"]["health_impact_score"] > 0

def test_analytics_overview_endpoint():
    res = client.get("/api/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "total_predictions" in data
    assert "national_avg_aqi" in data
    assert "historical_7_days" in data
    assert "state_wise_ranking" in data
