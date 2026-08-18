import React, { useState, useEffect } from 'react';
import AQIGauge from '../components/AQIGauge';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import WeatherCards from '../components/WeatherCards';
import { fetchLivePrediction, ALL_INDIA_STATES } from '../api/client';
import { Wind, RefreshCw, AlertCircle, Sparkles, MapPin, Activity } from 'lucide-react';

export default function LivePredictionPage() {
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentDistricts = ALL_INDIA_STATES.find(s => s.state === selectedState)?.districts || [];

  const handleFetch = async (city, state) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLivePrediction(city, state);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch(selectedDistrict, selectedState);
  }, []);

  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const dists = ALL_INDIA_STATES.find(s => s.state === newState)?.districts || [];
    const first = dists[0] || 'Delhi';
    setSelectedDistrict(first);
    handleFetch(first, newState);
  };

  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist);
    handleFetch(newDist, selectedState);
  };

  return (
    <div className="space-y-6">
      {/* State & District Control Center */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center space-x-2">
              <Wind className="w-6 h-6 text-teal-400" />
              <span>Live Air Quality & Meteorology Radar</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select any district or city from all 28 States & 8 Union Territories across India for live sensor ingestion
            </p>
          </div>

          <button
            onClick={() => handleFetch(selectedDistrict, selectedState)}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-lg shadow-teal-500/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Sensor Telemetry</span>
          </button>
        </div>

        {/* Dual Hierarchy Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800/80">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>State / Union Territory</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {ALL_INDIA_STATES.map(s => (
                <option key={s.state} value={s.state}>
                  {s.state} ({s.type === 'Union Territory' ? 'UT' : 'State'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>City / District</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {currentDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="glass-card p-16 rounded-3xl text-center flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">
            Fetching atmospheric sensor telemetry for {selectedDistrict}, {selectedState}...
          </span>
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AQIGauge
              aqi={data.aqi_prediction.predicted_aqi}
              category={data.aqi_prediction.aqi_category}
              colorCode={data.aqi_prediction.color_code}
              meaning={data.aqi_prediction.aqi_meaning}
            />

            <HealthRiskGauge
              score={data.health_prediction.health_impact_score}
              riskClass={data.health_prediction.risk_class}
              riskLabel={data.health_prediction.risk_label}
              riskDesc={data.health_prediction.risk_description}
            />
          </div>

          <WeatherCards weather={data.weather} pollutants={data.pollutants} />

          <SHAPBarChart
            title={`Real-Time Factor Attribution (${data.location?.city}, ${data.location?.state})`}
            factors={data.health_prediction?.top_health_factors}
          />
        </div>
      ) : null}
    </div>
  );
}
