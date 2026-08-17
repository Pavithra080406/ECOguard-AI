import numpy as np
import pandas as pd
from scipy import stats
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def calculate_ks_drift(reference_data: np.ndarray, current_data: np.ndarray, alpha: float = 0.05):
    """
    Performs 2-sample Kolmogorov-Smirnov test to detect distribution drift.
    """
    if len(reference_data) == 0 or len(current_data) == 0:
        return {"statistic": 0.0, "p_value": 1.0, "drift_detected": False}
    
    stat, p_val = stats.ks_2samp(reference_data, current_data)
    drift_detected = bool(p_val < alpha)
    return {
        "statistic": float(round(stat, 4)),
        "p_value": float(round(p_val, 5)),
        "drift_detected": drift_detected
    }

def calculate_psi(reference: np.ndarray, current: np.ndarray, num_buckets: int = 10) -> float:
    """
    Calculates Population Stability Index (PSI).
    PSI < 0.1: No significant distribution change
    0.1 <= PSI < 0.2: Moderate distribution change
    PSI >= 0.2: Significant distribution shift (drift)
    """
    if len(reference) == 0 or len(current) == 0:
        return 0.0

    percentiles = np.linspace(0, 100, num_buckets + 1)
    buckets = np.percentile(reference, percentiles)
    buckets[0] -= 1e-5
    buckets[-1] += 1e-5

    ref_counts, _ = np.histogram(reference, bins=buckets)
    curr_counts, _ = np.histogram(current, bins=buckets)

    ref_pct = np.maximum(ref_counts / len(reference), 1e-4)
    curr_pct = np.maximum(curr_counts / len(current), 1e-4)

    psi_val = np.sum((curr_pct - ref_pct) * np.log(curr_pct / ref_pct))
    return float(round(psi_val, 4))

def analyze_dataset_drift(reference_df: pd.DataFrame, current_df: pd.DataFrame, features: list):
    report = {}
    for feat in features:
        if feat in reference_df.columns and feat in current_df.columns:
            ref_vals = reference_df[feat].dropna().values
            curr_vals = current_df[feat].dropna().values

            ks_res = calculate_ks_drift(ref_vals, curr_vals)
            psi_res = calculate_psi(ref_vals, curr_vals)

            status = "No Drift"
            if psi_res >= 0.2 or ks_res["drift_detected"]:
                status = "Drift Detected"

            report[feat] = {
                "ks_stat": ks_res["statistic"],
                "p_value": ks_res["p_value"],
                "psi": psi_res,
                "status": status
            }
    return report

if __name__ == "__main__":
    # Test script standalone
    data_path = Path("data/processed/health_cleaned.csv")
    if data_path.exists():
        df = pd.read_csv(data_path)
        ref = df.sample(frac=0.5, random_state=42)
        curr = df.drop(ref.index)
        feats = ["PM2.5", "PM10", "NO2", "Temperature", "Humidity"]
        res = analyze_dataset_drift(ref, curr, feats)
        print("Data Drift Analysis Report:")
        print(res)
