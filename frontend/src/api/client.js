const BASE_URL = '/api';

export async function fetchLivePrediction(city) {
  const res = await fetch(`${BASE_URL}/live/${encodeURIComponent(city)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch live prediction for ${city}: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchManualPrediction(formData) {
  const res = await fetch(`${BASE_URL}/predict/manual`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    throw new Error(`Manual prediction failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAnalyticsOverview() {
  const res = await fetch(`${BASE_URL}/analytics/overview`);
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics overview: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchPredictionHistory(limit = 20, city = '') {
  let url = `${BASE_URL}/history/aqi?limit=${limit}`;
  if (city) url += `&city=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch history: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchModelInfo() {
  const res = await fetch(`${BASE_URL}/model/info`);
  if (!res.ok) {
    throw new Error(`Failed to fetch model info: ${res.statusText}`);
  }
  return res.json();
}
