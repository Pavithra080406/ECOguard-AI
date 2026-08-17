import mlflow
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def log_experiment(run_name: str, params: dict, metrics: dict, artifacts_dir: Path = None):
    try:
        mlflow.set_tracking_uri("http://localhost:5000")
        mlflow.set_experiment("ECOguard_AI_Experiment_Tracking")
        with mlflow.start_run(run_name=run_name):
            mlflow.log_params(params)
            mlflow.log_metrics(metrics)
            if artifacts_dir and artifacts_dir.exists():
                mlflow.log_artifacts(str(artifacts_dir))
            logger.info(f"Successfully logged experiment run '{run_name}' to MLflow.")
    except Exception as e:
        logger.warning(f"MLflow logging failed or MLflow server not reachable: {e}")
