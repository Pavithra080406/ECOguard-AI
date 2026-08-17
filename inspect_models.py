import pickle
import sklearn.preprocessing

class LabelEncoder(sklearn.preprocessing.LabelEncoder):
    pass

import sys
sys.modules['LabelEncoder'] = sys.modules[__name__]

try:
    with open('D:/EcoGuard-AI/models/health_label_encoders.pkl', 'rb') as f:
        health_enc = pickle.load(f)
    print("Health Encoders loaded:", health_enc)
except Exception as e:
    print("Health enc error:", e)

try:
    with open('D:/EcoGuard-AI/models/label_encoders.pkl', 'rb') as f:
        aqi_enc = pickle.load(f)
    print("AQI Encoders loaded:", aqi_enc)
except Exception as e:
    print("AQI enc error:", e)

try:
    with open('D:/EcoGuard-AI/models/health_3class_thresholds.pkl', 'rb') as f:
        thresh = pickle.load(f)
    print("Thresholds:", thresh)
except Exception as e:
    print("Thresholds error:", e)

try:
    with open('D:/EcoGuard-AI/models/health_3class_mapping.pkl', 'rb') as f:
        mapping = pickle.load(f)
    print("Mapping:", mapping)
except Exception as e:
    print("Mapping error:", e)

import xgboost as xgb
try:
    with open('D:/EcoGuard-AI/models/aqi_model.pkl', 'rb') as f:
        aqi_model = pickle.load(f)
    print("AQI Model loaded successfully:", type(aqi_model))
    if hasattr(aqi_model, 'feature_names_in_'):
        print("AQI Model Features:", list(aqi_model.feature_names_in_))
except Exception as e:
    print("AQI Model error:", e)

try:
    with open('D:/EcoGuard-AI/models/health_impact_3class_model.pkl', 'rb') as f:
        health_model = pickle.load(f)
    print("Health Model loaded successfully:", type(health_model))
    if hasattr(health_model, 'feature_names_in_'):
        print("Health Model Features:", list(health_model.feature_names_in_))
except Exception as e:
    print("Health Model error:", e)
