# ECOguard AI – Intelligent Air Quality Forecasting and Health Risk Assessment Platform

ECOguard AI is an environmental intelligence and health risk assessment platform that combines live air-quality data, weather data, machine-learning-based AQI prediction, health-impact regression modeling, SHAP explainable AI, personalized health advisories, analytics, and MLOps monitoring.

---

## Core System Architecture

```
                                  ECOguard AI
                                       |
                       +---------------+---------------+
                       |                               |
                LIVE PREDICTION                 MANUAL PREDICTION
                       |                               |
                 Current Data                     User Inputs
                       |                               |
                       +---------------+---------------+
                                       |
                                       v
                                AQI XGBoost MODEL
                                       |
                                       v
                                Predicted AQI
                                       |
                                       v
                             28 Health Features
                                       |
                                       v
                             HEALTH XGBRegressor MODEL
                                       |
                                       v
                             Health Impact Score
                                       |
                                       v
                             3-Class Risk Mapping
                            (Low / Moderate / High)
                                       |
                                       v
                              Explainable AI (SHAP)
                                       |
                                       v
                                Health Advisory
                                       |
                                       v
                                   Analytics
                                       |
                                       v
                                     MLOps
                            +----------+----------+
                            |          |          |
                          MLflow     CI/CD    Monitoring
                                       |
                                  Model/Data Drift
                                       |
                                  Retraining Loop
```

---

## Key Features

1. **Dual Prediction Pipelines**: Live prediction for any city via OpenWeather API (with offline fallback DB) and manual parameter simulation.
2. **AQI XGBoost Regression**: Continuous AQI prediction using 22 environmental & time features.
3. **Health XGBoost Regression (28 Features)**: Predicts continuous `HealthImpactScore` mapped onto 3 risk levels using trained thresholds:
   - **Low Risk**: `HealthImpactScore <= 3.8955`
   - **Moderate Risk**: `3.8955 < HealthImpactScore <= 5.0735`
   - **High Risk**: `HealthImpactScore > 5.0735`
4. **SHAP Explainable AI**: TreeExplainer attribution identifying exact feature contributions, magnitudes, and directions (*increases risk* vs. *reduces risk*).
5. **Non-Diagnostic Health Advisory**: Context-aware guidance for general public, children, elderly, asthma/COPD, and cardiovascular sensitive groups.
6. **MongoDB Persistence & History**: Logs all predictions to MongoDB collection `ecoguard_ai.prediction_history`.
7. **MLOps & Data Drift Monitoring**: Kolmogorov-Smirnov test and Population Stability Index (PSI) monitoring feature distribution shifts against training baseline.
8. **React + Vite Dashboard**: Clean glassmorphism UI built with Tailwind CSS, Lucide icons, and Recharts.

---

## Directory Structure

```
ECOguard-AI/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── live_data.py
│   │   ├── live_features.py
│   │   ├── feature_generator.py
│   │   ├── health_feature_generator.py
│   │   ├── predictor.py
│   │   ├── xai.py
│   │   ├── advisory.py
│   │   ├── analytics.py
│   │   ├── schemas.py
│   │   └── routes/
│   │       ├── aqi.py
│   │       ├── health.py
│   │       ├── prediction.py
│   │       └── analytics.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── data/
│   └── processed/
│       ├── aqi_cleaned.csv
│       └── health_cleaned.csv
├── models/
│   ├── aqi_model.pkl
│   ├── label_encoders.pkl
│   ├── health_impact_3class_model.pkl
│   ├── health_label_encoders.pkl
│   ├── health_3class_thresholds.pkl
│   └── health_3class_mapping.pkl
├── src/
│   ├── monitoring/
│   │   ├── data_drift.py
│   │   └── model_monitor.py
│   └── mlops/
│       ├── mlflow_tracker.py
│       └── retrain.py
├── tests/
│   ├── conftest.py
│   ├── test_aqi_model.py
│   ├── test_health_model.py
│   ├── test_end_to_end.py
│   └── test_api.py
├── .github/
│   └── workflows/
│       └── ci_cd.yml
├── .env
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Environment Variables (`.env`)

```env
OPENWEATHER_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=ecoguard_ai
MLFLOW_TRACKING_URI=http://localhost:5000
MODELS_DIR=models
```

---

## Setup & Running Instructions

### 1. Backend Setup

```bash
# Navigate to project root
cd ECOguard-AI

# Activate virtualenv (or create one)
# Python 3.12 recommended
pip install -r backend/requirements.txt

# Run FastAPI backend server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend server runs at: `http://localhost:8000`
Swagger API Documentation: `http://localhost:8000/docs`

---

### 2. Frontend Setup (Two Separate Portals)

#### A. Public User Website (For General Public & Real-World Users)
```bash
cd frontend
npm install
npm run dev
```
Public Portal runs at: 👉 **`http://localhost:3000`**

#### B. Creator & MLOps Engineering Portal (For Project Creator/Admin)
```bash
cd creator-portal
npm install
npm run dev
```
Creator Portal runs at: 👉 **`http://localhost:3001`**

---

### 3. Running Automated Tests

```bash
# Run pytest with backend in PYTHONPATH
powershell -Command "$env:PYTHONPATH='backend'; python -m pytest -v"
```

All 10 test cases covering health thresholds, 28-feature structure, SHAP explanations, missing Pb/NH3 handling, and API endpoints will execute.

---

### 4. Running Docker Compose

```bash
docker-compose up --build
```

Starts Frontend (Port 3000), Backend (Port 8000), and MongoDB (Port 27017).

---

## API Endpoints Reference

- `GET /health` - System health check
- `GET /api/live/{city}` - Complete live prediction pipeline for selected city
- `POST /api/predict/aqi` - Standalone AQI prediction
- `POST /api/predict/health` - Standalone Health prediction
- `POST /api/predict/live` - POST endpoint for live prediction pipeline
- `POST /api/predict/manual` - Manual simulation prediction
- `GET /api/history/aqi` - MongoDB historical prediction records
- `GET /api/history/health` - MongoDB historical health prediction records
- `GET /api/analytics/overview` - Analytics summary metrics and city averages
- `GET /api/model/info` - Model specifications and feature lists
