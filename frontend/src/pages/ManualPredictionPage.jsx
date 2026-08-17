import React, { useState } from 'react';
import AQIGauge from '../components/AQIGauge';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import { fetchManualPrediction } from '../api/client';
import { Sliders, Play, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function ManualPredictionPage() {
  const [form, setForm] = useState({
    pm2_5: 45.0,
    pm10: 85.0,
    no2: 32.0,
    so2: 14.0,
    o3: 52.0,
    co: 1.1,
    nh3: 16.0,
    pb: 0.35,
    temperature: 31.5,
    humidity: 72.0,
    wind_speed: 14.0,
    wind_direction: 180.0,
    pressure: 1010.0,
    rainfall: 0.0,
    cloud_cover: 30.0,
    city: 'Chennai',
    state: 'Tamil Nadu',
    population: 7090000
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const indianStates = [
    { city: 'Chennai', state: 'Tamil Nadu', pop: 7090000 },
    { city: 'Delhi', state: 'Delhi NCT', pop: 19000000 },
    { city: 'Mumbai', state: 'Maharashtra', pop: 12500000 },
    { city: 'Bengaluru', state: 'Karnataka', pop: 8400000 },
    { city: 'Kolkata', state: 'West Bengal', pop: 4500000 },
    { city: 'Hyderabad', state: 'Telangana', pop: 6800000 },
    { city: 'Ahmedabad', state: 'Gujarat', pop: 5600000 },
    { city: 'Jaipur', state: 'Rajasthan', pop: 3046000 },
    { city: 'Lucknow', state: 'Uttar Pradesh', pop: 2817000 },
    { city: 'Kochi', state: 'Kerala', pop: 677000 },
    { city: 'Chandigarh', state: 'Punjab', pop: 1055000 },
  ];

  const handleCitySelect = (cityName) => {
    const found = indianStates.find(s => s.city === cityName);
    if (found) {
      setForm(prev => ({
        ...prev,
        city: found.city,
        state: found.state,
        population: found.pop
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchManualPrediction(form);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <span>Air Quality & Health Scenario Simulator</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust atmospheric and environmental parameters to forecast air quality index and projected health risk scores
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-6">
        {/* Location Selection */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">
            Target Indian Region
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">City Hub</label>
              <select
                value={form.city}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {indianStates.map(s => (
                  <option key={s.city} value={s.city}>{s.city} ({s.state})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">State / Territory</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Population Density (Est.)</label>
              <input
                type="number"
                name="population"
                value={form.population}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Pollutants Section */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Air Pollutant Concentrations (µg/m³ or mg/m³)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'PM2.5 (Fine dust)', name: 'pm2_5', min: 0, max: 500, step: 0.1 },
              { label: 'PM10 (Coarse dust)', name: 'pm10', min: 0, max: 600, step: 0.1 },
              { label: 'NO2 (Nitrogen Dioxide)', name: 'no2', min: 0, max: 300, step: 0.1 },
              { label: 'SO2 (Sulfur Dioxide)', name: 'so2', min: 0, max: 200, step: 0.1 },
              { label: 'O3 (Ground Ozone)', name: 'o3', min: 0, max: 300, step: 0.1 },
              { label: 'CO (Carbon Monoxide)', name: 'co', min: 0, max: 50, step: 0.1 },
              { label: 'NH3 (Ammonia)', name: 'nh3', min: 0, max: 200, step: 0.1 },
              { label: 'Pb (Lead)', name: 'pb', min: 0, max: 10, step: 0.01 },
            ].map(item => (
              <div key={item.name} className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.label}</span>
                  <span className="font-mono text-emerald-400">{form[item.name]}</span>
                </div>
                <input
                  type="number"
                  name={item.name}
                  value={form[item.name]}
                  onChange={handleChange}
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Weather Section */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-sky-400 font-semibold mb-3">
            Atmospheric & Meteorological Conditions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Temperature (°C)', name: 'temperature', min: -10, max: 55, step: 0.1 },
              { label: 'Humidity (%)', name: 'humidity', min: 0, max: 100, step: 1 },
              { label: 'Wind Speed (km/h)', name: 'wind_speed', min: 0, max: 120, step: 0.1 },
              { label: 'Wind Direction (°)', name: 'wind_direction', min: 0, max: 360, step: 1 },
              { label: 'Pressure (hPa)', name: 'pressure', min: 800, max: 1200, step: 0.5 },
              { label: 'Rainfall (mm)', name: 'rainfall', min: 0, max: 200, step: 0.1 },
              { label: 'Cloud Cover (%)', name: 'cloud_cover', min: 0, max: 100, step: 1 },
            ].map(item => (
              <div key={item.name} className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.label}</span>
                  <span className="font-mono text-sky-400">{form[item.name]}</span>
                </div>
                <input
                  type="number"
                  name={item.name}
                  value={form[item.name]}
                  onChange={handleChange}
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Simulating Environmental Forecast...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Run Scenario Simulation</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <h2 className="text-base font-bold text-slate-100">Scenario Simulation Forecast Output</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AQIGauge
              aqi={result.aqi_prediction.predicted_aqi}
              category={result.aqi_prediction.aqi_category}
              colorCode={result.aqi_prediction.color_code}
              meaning={result.aqi_prediction.aqi_meaning}
            />

            <HealthRiskGauge
              score={result.health_prediction.health_impact_score}
              riskClass={result.health_prediction.risk_class}
              riskLabel={result.health_prediction.risk_label}
              riskDesc={result.health_prediction.risk_description}
            />
          </div>

          <SHAPBarChart
            title="Simulated Environmental Risk Contribution Factors"
            factors={result.health_prediction.top_health_factors}
          />
        </div>
      )}
    </div>
  );
}
