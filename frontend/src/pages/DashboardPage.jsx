import React, { useState, useEffect } from 'react';
import AQIGauge from '../components/AQIGauge';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import WeatherCards from '../components/WeatherCards';
import { fetchLivePrediction, ALL_INDIA_STATES } from '../api/client';
import { Search, MapPin, AlertCircle, RefreshCw, Sparkles, HeartPulse, Wind, ShieldAlert, Layers } from 'lucide-react';

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available districts for current state
  const currentDistricts = ALL_INDIA_STATES.find(s => s.state === selectedState)?.districts || [];

  const loadPrediction = async (city, state = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLivePrediction(city, state);
      setData(res);
      if (res.location?.state) {
        setSelectedState(res.location.state);
        setSelectedDistrict(res.location.city);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrediction(selectedDistrict, selectedState);
  }, []);

  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const dists = ALL_INDIA_STATES.find(s => s.state === newState)?.districts || [];
    const firstDist = dists[0] || 'Delhi';
    setSelectedDistrict(firstDist);
    loadPrediction(firstDist, newState);
  };

  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist);
    loadPrediction(newDist, selectedState);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      loadPrediction(searchInput.trim(), selectedState);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Section */}
      <div className="glass-card p-6 rounded-3xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All 28 States & 8 Union Territories Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              National Air Quality & Health Intelligence Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time atmospheric monitoring, XGBoost AQI forecasting, and clinical health vulnerability assessment across India
            </p>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search any Indian city/district..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* State & District Dual Filter Selectors */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select State / UT ({ALL_INDIA_STATES.length})</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {ALL_INDIA_STATES.map(s => (
                <option key={s.state} value={s.state}>
                  {s.state} ({s.type === 'Union Territory' ? 'UT' : 'State'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span>Select City / District ({currentDistricts.length})</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {currentDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Quick Popular State Pills */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick State Hubs
            </label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                { name: 'Tamil Nadu', dist: 'Chennai' },
                { name: 'Delhi NCT', dist: 'Delhi' },
                { name: 'Maharashtra', dist: 'Mumbai' },
                { name: 'Karnataka', dist: 'Bengaluru' },
                { name: 'Uttar Pradesh', dist: 'Lucknow' },
                { name: 'West Bengal', dist: 'Kolkata' },
                { name: 'Gujarat', dist: 'Ahmedabad' },
                { name: 'Kerala', dist: 'Kochi' }
              ].map(hub => (
                <button
                  key={hub.name}
                  onClick={() => {
                    setSelectedState(hub.name);
                    setSelectedDistrict(hub.dist);
                    loadPrediction(hub.dist, hub.name);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    selectedState === hub.name
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {hub.name}
                </button>
              ))}
            </div>
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
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">
            Fetching real-time atmospheric data & running AI models for {selectedDistrict}, {selectedState}...
          </span>
        </div>
      ) : data ? (
        <>
          {/* Main Gauges Section */}
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

          {/* AI Environmental & Clinical Advisory Card */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Environmental & Clinical Health Advisory • {data.location?.city}, {data.location?.state}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {data.advisory?.primary_health_advice}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Outdoor Exercise</span>
                <span className="text-xs font-bold text-slate-100 mt-1 block">{data.advisory?.activity_guidelines?.outdoor_exercise}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Mask Advisory</span>
                <span className="text-xs font-bold text-slate-100 mt-1 block">{data.advisory?.activity_guidelines?.mask_recommendation}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Home Ventilation</span>
                <span className="text-xs font-bold text-slate-100 mt-1 block">{data.advisory?.activity_guidelines?.ventilation}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Sensitive Groups</span>
                <span className="text-xs font-bold text-amber-300 mt-1 block">{data.advisory?.activity_guidelines?.sensitive_groups_action}</span>
              </div>
            </div>
          </div>

          {/* Real-time Weather & Atmospheric Parameters */}
          <WeatherCards weather={data.weather} pollutants={data.pollutants} />

          {/* Explainable AI Risk Attribution */}
          <SHAPBarChart
            title={`Environmental Health Risk Attribution Factors (${data.location?.city})`}
            factors={data.health_prediction?.top_health_factors}
          />
        </>
      ) : null}
    </div>
  );
}
