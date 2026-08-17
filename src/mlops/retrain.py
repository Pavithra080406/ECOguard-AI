import pandas as pd
import numpy as np
from pathlib import Path
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import pickle
import logging

logger = logging.getLogger(__name__)

BASELINE_METRICS = {
    "MAE": 0.9790,
    "RMSE": 1.3196,
    "R2": 0.5411
}

def retrain_health_model(data_path: str = "data/processed/health_cleaned.csv", model_output_path: str = "models/health_impact_3class_model.pkl"):
    path = Path(data_path)
    if not path.exists():
        print(f"Dataset path {data_path} does not exist.")
        return False

    print(f"Loading health training dataset from {data_path}...")
    df = pd.read_csv(path)

    # Temporal split: Train on Date <= 2024-12-31, Test on Date >= 2025-01-01
    if "Date" in df.columns:
        df["Date"] = pd.to_datetime(df["Date"])
        train_df = df[df["Date"] <= "2024-12-31"]
        test_df = df[df["Date"] >= "2025-01-01"]
    else:
        # Fallback split if Date column missing
        train_df = df.iloc[:int(len(df)*0.8)]
        test_df = df.iloc[int(len(df)*0.8):]

    features = [
        'City', 'State', 'Latitude', 'Longitude', 'Month', 'DayOfWeek', 'Season',
        'PM2.5', 'PM10', 'NO2', 'SO2', 'O3', 'CO', 'NH3', 'Pb',
        'Temperature', 'Humidity', 'WindSpeed', 'WindDirection', 'Pressure',
        'Rainfall', 'CloudCover', 'Population', 'DayOfYear',
        'Month_Sin', 'Month_Cos', 'DayOfYear_Sin', 'DayOfYear_Cos'
    ]

    target = "HealthImpactScore"

    # Encode categoricals for training
    health_encoders = joblib.load("models/health_label_encoders.pkl")
    
    for col in ['City', 'State', 'DayOfWeek', 'Season']:
        if col in health_encoders and col in train_df.columns:
            enc = health_encoders[col]
            train_df[col] = train_df[col].apply(lambda x: enc.transform([str(x)])[0] if str(x) in enc.classes_ else 0)
            test_df[col] = test_df[col].apply(lambda x: enc.transform([str(x)])[0] if str(x) in enc.classes_ else 0)

    X_train = train_df[features]
    y_train = train_df[target]
    X_test = test_df[features]
    y_test = test_df[target]

    print(f"Training XGBRegressor on {len(X_train)} samples, testing on {len(X_test)} samples...")

    model = xgb.XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    mae = float(mean_absolute_error(y_test, preds))
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    r2 = float(r2_score(y_test, preds))

    print(f"Retrained Model Evaluation Results:")
    print(f"  MAE:  {mae:.4f} (Baseline: {BASELINE_METRICS['MAE']})")
    print(f"  RMSE: {rmse:.4f} (Baseline: {BASELINE_METRICS['RMSE']})")
    print(f"  R²:   {r2:.4f} (Baseline: {BASELINE_METRICS['R2']})")

    # Only promote if model performance improves or equals baseline threshold
    if mae <= BASELINE_METRICS["MAE"] or r2 >= BASELINE_METRICS["R2"]:
        print(">>> Model metrics improved or verified baseline! Registering new model version...")
        with open(model_output_path, "wb") as f:
            pickle.dump(model, f)
        print(f"New model saved to {model_output_path}.")
        return True
    else:
        print(">>> Retrained model did not exceed baseline quality. Retaining existing production model.")
        return False

if __name__ == "__main__":
    retrain_health_model()
