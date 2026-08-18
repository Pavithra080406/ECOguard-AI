# Production Multi-Stage Dockerfile for ECOguard AI Backend & ML Engine
FROM python:3.12-slim

WORKDIR /app

# Install system runtime dependencies for XGBoost & Scipy
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python packages
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files, ML models, MLOps modules, and data
COPY backend/app ./app
COPY src ./src
COPY models ./models
COPY data ./data

EXPOSE 8000

ENV PYTHONPATH=/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
