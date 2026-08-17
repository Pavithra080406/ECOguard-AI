from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class LivePredictionRequest(BaseModel):
    city: str = Field(..., example="Chennai")

class ManualPredictionRequest(BaseModel):
    # Air pollutants
    pm2_5: float = Field(..., ge=0, description="PM2.5 concentration in ug/m3", example=35.4)
    pm10: float = Field(..., ge=0, description="PM10 concentration in ug/m3", example=65.2)
    no2: float = Field(..., ge=0, description="NO2 concentration in ug/m3", example=24.1)
    so2: float = Field(..., ge=0, description="SO2 concentration in ug/m3", example=12.0)
    o3: float = Field(..., ge=0, description="O3 concentration in ug/m3", example=45.8)
    co: float = Field(..., ge=0, description="CO concentration in ug/m3", example=0.8)
    nh3: float = Field(15.0, ge=0, description="NH3 concentration in ug/m3", example=15.0)
    pb: float = Field(0.5, ge=0, description="Pb concentration in ug/m3", example=0.5)

    # Weather
    temperature: float = Field(..., description="Temperature in Celsius", example=30.5)
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity %", example=78.0)
    wind_speed: float = Field(..., ge=0, description="Wind speed in km/h", example=15.2)
    wind_direction: float = Field(180.0, ge=0, le=360, description="Wind direction in degrees", example=180.0)
    pressure: float = Field(1013.25, ge=800, le=1200, description="Pressure in hPa", example=1011.0)
    rainfall: float = Field(0.0, ge=0, description="Rainfall in mm", example=0.0)
    cloud_cover: float = Field(20.0, ge=0, le=100, description="Cloud cover %", example=25.0)

    # Location & Demographics
    city: str = Field("Chennai", example="Chennai")
    state: str = Field("Tamil Nadu", example="Tamil Nadu")
    population: float = Field(7090000.0, ge=0, description="City population", example=7090000.0)

class LocationInfo(BaseModel):
    city: str
    state: str
    latitude: float
    longitude: float

class WeatherInfo(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    wind_direction: Optional[float] = 180.0
    pressure: float
    cloud_cover: float
    rainfall: Optional[float] = 0.0

class PollutantsInfo(BaseModel):
    pm2_5: float
    pm10: float
    no2: float
    so2: float
    o3: float
    co: float
    nh3: Optional[float] = 15.0
    pb: Optional[float] = 0.5

class FactorImpact(BaseModel):
    feature: str
    value: float
    impact: float
    direction: str

class AQIPredictionOutput(BaseModel):
    predicted_aqi: float
    aqi_category: str
    aqi_meaning: str
    color_code: str
    top_factors: List[FactorImpact]

class HealthPredictionOutput(BaseModel):
    health_impact_score: float
    risk_class: int
    risk_label: str
    risk_description: str
    model_estimate: str
    top_health_factors: List[FactorImpact]
    health_advice: List[str]

class DecisionSupportOutput(BaseModel):
    aqi_status: str
    primary_pollutant: str
    recommended_actions: List[str]
    sensitive_groups_guidance: Dict[str, str]

class FullPredictionResponse(BaseModel):
    prediction_id: str
    prediction_time: str
    prediction_type: str
    location: LocationInfo
    weather: WeatherInfo
    pollutants: PollutantsInfo
    aqi_prediction: AQIPredictionOutput
    health_prediction: HealthPredictionOutput
    decision_support: DecisionSupportOutput
    ai_summary: str
