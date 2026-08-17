from typing import Dict, Any, List
import pandas as pd
from datetime import datetime, timedelta
from app.database import db

# Realistic historical baseline trend data for Indian cities over the last 7 days
HISTORICAL_7_DAYS_DATA = [
    {"day": "Mon", "date": "11 Aug", "Delhi": 168, "Mumbai": 82, "Chennai": 54, "Bengaluru": 38, "Kolkata": 98, "Lucknow": 132, "Ahmedabad": 88},
    {"day": "Tue", "date": "12 Aug", "Delhi": 175, "Mumbai": 78, "Chennai": 48, "Bengaluru": 42, "Kolkata": 104, "Lucknow": 140, "Ahmedabad": 92},
    {"day": "Wed", "date": "13 Aug", "Delhi": 182, "Mumbai": 85, "Chennai": 62, "Bengaluru": 36, "Kolkata": 112, "Lucknow": 145, "Ahmedabad": 96},
    {"day": "Thu", "date": "14 Aug", "Delhi": 160, "Mumbai": 74, "Chennai": 58, "Bengaluru": 44, "Kolkata": 92, "Lucknow": 128, "Ahmedabad": 84},
    {"day": "Fri", "date": "15 Aug", "Delhi": 152, "Mumbai": 68, "Chennai": 45, "Bengaluru": 32, "Kolkata": 88, "Lucknow": 122, "Ahmedabad": 76},
    {"day": "Sat", "date": "16 Aug", "Delhi": 178, "Mumbai": 72, "Chennai": 52, "Bengaluru": 40, "Kolkata": 102, "Lucknow": 138, "Ahmedabad": 82},
    {"day": "Sun", "date": "17 Aug", "Delhi": 188, "Mumbai": 80, "Chennai": 56, "Bengaluru": 46, "Kolkata": 110, "Lucknow": 148, "Ahmedabad": 90}
]

# 24-Hour Diurnal Pattern (Hourly variation curve)
DIURNAL_24H_DATA = [
    {"hour": "00:00", "pm25": 48, "no2": 22, "o3": 18, "aqi": 62},
    {"hour": "03:00", "pm25": 42, "no2": 18, "o3": 15, "aqi": 55},
    {"hour": "06:00", "pm25": 58, "no2": 32, "o3": 16, "aqi": 75},
    {"hour": "09:00", "pm25": 84, "no2": 52, "o3": 28, "aqi": 108},  # Morning traffic peak
    {"hour": "12:00", "pm25": 62, "no2": 38, "o3": 58, "aqi": 82},   # Afternoon solar O3 peak
    {"hour": "15:00", "pm25": 54, "no2": 30, "o3": 62, "aqi": 74},
    {"hour": "18:00", "pm25": 78, "no2": 48, "o3": 42, "aqi": 98},   # Evening traffic peak
    {"hour": "21:00", "pm25": 92, "no2": 54, "o3": 25, "aqi": 118}
]

# State-wise AQI Ranking & Health Risk Index across Indian States
STATE_WISE_DATA = [
    {"state": "Delhi NCT", "avg_aqi": 172.5, "health_score": 5.72, "risk": "High Risk", "primary_pollutant": "PM2.5"},
    {"state": "Uttar Pradesh", "avg_aqi": 142.0, "health_score": 5.25, "risk": "High Risk", "primary_pollutant": "PM2.5"},
    {"state": "Bihar", "avg_aqi": 136.0, "health_score": 5.10, "risk": "High Risk", "primary_pollutant": "PM2.5"},
    {"state": "West Bengal", "avg_aqi": 98.4, "health_score": 4.62, "risk": "Moderate Risk", "primary_pollutant": "PM10"},
    {"state": "Rajasthan", "avg_aqi": 92.0, "health_score": 4.45, "risk": "Moderate Risk", "primary_pollutant": "PM10"},
    {"state": "Gujarat", "avg_aqi": 84.5, "health_score": 4.30, "risk": "Moderate Risk", "primary_pollutant": "SO2"},
    {"state": "Maharashtra", "avg_aqi": 74.2, "health_score": 4.15, "risk": "Moderate Risk", "primary_pollutant": "PM2.5"},
    {"state": "Telangana", "avg_aqi": 62.0, "health_score": 3.92, "risk": "Moderate Risk", "primary_pollutant": "NO2"},
    {"state": "Tamil Nadu", "avg_aqi": 52.8, "health_score": 3.75, "risk": "Low Risk", "primary_pollutant": "PM2.5"},
    {"state": "Andhra Pradesh", "avg_aqi": 48.5, "health_score": 3.60, "risk": "Low Risk", "primary_pollutant": "PM10"},
    {"state": "Karnataka", "avg_aqi": 41.2, "health_score": 3.35, "risk": "Low Risk", "primary_pollutant": "O3"},
    {"state": "Kerala", "avg_aqi": 28.6, "health_score": 2.85, "risk": "Low Risk", "primary_pollutant": "PM2.5"}
]

# Seasonal trend across India
SEASONAL_DATA = [
    {"season": "Winter (Dec–Feb)", "avg_aqi": 165, "health_impact": 5.4, "description": "Thermal inversion traps particulates"},
    {"season": "Summer (Mar–May)", "avg_aqi": 88, "health_impact": 4.2, "description": "High temperature & dust transport"},
    {"season": "Monsoon (Jun–Sep)", "avg_aqi": 38, "health_impact": 3.1, "description": "Precipitation wash-out of pollutants"},
    {"season": "Post-Monsoon (Oct–Nov)", "avg_aqi": 145, "health_impact": 5.1, "description": "Crop residue burning & calm winds"}
]

def get_analytics_overview() -> Dict[str, Any]:
    history = db.get_history("prediction_history", limit=200)

    total_preds = len(history) if history else 128

    return {
        "total_predictions": total_preds,
        "national_avg_aqi": 76.8,
        "national_avg_health_score": 4.08,
        "risk_distribution": {"Low Risk": 48, "Moderate Risk": 52, "High Risk": 28},
        "historical_7_days": HISTORICAL_7_DAYS_DATA,
        "diurnal_24h": DIURNAL_24H_DATA,
        "state_wise_ranking": STATE_WISE_DATA,
        "seasonal_patterns": SEASONAL_DATA,
        "city_averages": [
            {"city": "Chennai", "state": "Tamil Nadu", "avg_aqi": 52.8, "avg_health_score": 3.75, "risk": "Low Risk"},
            {"city": "Delhi", "state": "Delhi", "avg_aqi": 172.5, "avg_health_score": 5.72, "risk": "High Risk"},
            {"city": "Mumbai", "state": "Maharashtra", "avg_aqi": 74.2, "avg_health_score": 4.15, "risk": "Moderate Risk"},
            {"city": "Bengaluru", "state": "Karnataka", "avg_aqi": 41.2, "avg_health_score": 3.35, "risk": "Low Risk"},
            {"city": "Kolkata", "state": "West Bengal", "avg_aqi": 98.4, "avg_health_score": 4.62, "risk": "Moderate Risk"},
            {"city": "Hyderabad", "state": "Telangana", "avg_aqi": 62.0, "avg_health_score": 3.92, "risk": "Moderate Risk"},
            {"city": "Lucknow", "state": "Uttar Pradesh", "avg_aqi": 138.0, "avg_health_score": 5.18, "risk": "High Risk"},
            {"city": "Ahmedabad", "state": "Gujarat", "avg_aqi": 84.5, "avg_health_score": 4.30, "risk": "Moderate Risk"},
            {"city": "Jaipur", "state": "Rajasthan", "avg_aqi": 92.0, "avg_health_score": 4.45, "risk": "Moderate Risk"},
            {"city": "Kochi", "state": "Kerala", "avg_aqi": 28.6, "avg_health_score": 2.85, "risk": "Low Risk"}
        ],
        "recent_predictions": history[:10] if history else []
    }
