import time
import numpy as np
import logging

logger = logging.getLogger(__name__)

class ModelMonitor:
    def __init__(self):
        self.latency_records = []
        self.prediction_scores = []
        self.error_count = 0
        self.total_requests = 0

    def log_prediction(self, duration_ms: float, predicted_score: float, is_error: bool = False):
        self.total_requests += 1
        if is_error:
            self.error_count += 1
        else:
            self.latency_records.append(duration_ms)
            self.prediction_scores.append(predicted_score)

    def get_metrics(self):
        avg_latency = float(np.mean(self.latency_records)) if self.latency_records else 0.0
        p95_latency = float(np.percentile(self.latency_records, 95)) if self.latency_records else 0.0
        mean_score = float(np.mean(self.prediction_scores)) if self.prediction_scores else 0.0
        error_rate = float(self.error_count / self.total_requests) if self.total_requests > 0 else 0.0

        return {
            "total_requests": self.total_requests,
            "error_rate": round(error_rate, 4),
            "avg_latency_ms": round(avg_latency, 2),
            "p95_latency_ms": round(p95_latency, 2),
            "mean_prediction_score": round(mean_score, 2)
        }

model_monitor = ModelMonitor()
