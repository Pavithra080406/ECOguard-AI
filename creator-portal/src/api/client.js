const BASE_URL = '/api';

export async function fetchModelInfo() {
  const res = await fetch(`${BASE_URL}/model/info`);
  if (!res.ok) throw new Error(`Model info error: ${res.statusText}`);
  return res.json();
}

export async function fetchPredictionHistory(limit = 50, city = '') {
  let url = `${BASE_URL}/history/aqi?limit=${limit}`;
  if (city) url += `&city=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audit history error: ${res.statusText}`);
  return res.json();
}

export async function fetchAnalyticsOverview() {
  const res = await fetch(`${BASE_URL}/analytics/overview`);
  if (!res.ok) throw new Error(`Analytics overview error: ${res.statusText}`);
  return res.json();
}

export async function fetchDriftReport() {
  const res = await fetch(`${BASE_URL}/mlops/drift`);
  if (!res.ok) throw new Error(`Drift report error: ${res.statusText}`);
  return res.json();
}

export async function fetchMLOpsStatus() {
  const res = await fetch(`${BASE_URL}/mlops/status`);
  if (!res.ok) throw new Error(`MLOps status error: ${res.statusText}`);
  return res.json();
}

export async function triggerRetraining() {
  const res = await fetch(`${BASE_URL}/mlops/retrain`, { method: 'POST' });
  if (!res.ok) throw new Error(`Retraining error: ${res.statusText}`);
  return res.json();
}
