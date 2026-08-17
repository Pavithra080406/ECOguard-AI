import React, { useState, useEffect } from 'react';
import AQIGauge from '../components/AQIGauge';
import HealthRiskGauge from '../components/HealthRiskGauge';
import WeatherCards from '../components/WeatherCards';
import SHAPBarChart from '../components/SHAPBarChart';
import { fetchLivePrediction } from '../api/client';
import { Search, MapPin, RefreshCw, Activity, AlertCircle, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [city, setCity] = useState('Chennai');
  const [searchInput, setSearchInput] = useState('Chennai');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (targetCity) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLivePrediction(targetCity);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
    }
  };

  const indianCitiesList = [
    'Chennai', 'Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad',
    'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Patna', 'Bhopal'
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>National Air Quality & Health Intelligence Platform</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time atmospheric monitoring, air quality forecasting & health vulnerability assessment across India
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Indian city..."
              className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-emerald-600/20"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Indian City Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center mr-1 flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Indian Hubs:
        </span>
        {indianCitiesList.map((c) => (
          <button
            key={c}
            onClick={() => { setCity(c); setSearchInput(c); }}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
              city.toLowerCase() === c.toLowerCase()
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && (
        <div className="glass-card p-12 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-sm font-medium text-slate-300">Retrieving live atmospheric telemetry & generating predictions for {city}...</span>
        </div>
      )}

      {error && (
        <div className="glass-card p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-400" />
          <div>
            <h4 className="font-semibold text-sm">Environmental Telemetry Service Error</h4>
            <p className="text-xs text-rose-300/80">{error}</p>
          </div>
        </div>
      )}

      {!loading && data && (
        <>
          {/* Main Visual Gauges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* AI Summary Card */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Environmental Health Summary</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {data.ai_summary}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                <span>Location: {data.location.city}, {data.location.state}</span>
                <span>Lat: {data.location.latitude.toFixed(2)}°, Lon: {data.location.longitude.toFixed(2)}°</span>
              </div>
            </div>
          </div>

          {/* Weather Grid */}
          <WeatherCards weather={data.weather} />

          {/* Pollutants & Contributing Factors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SHAPBarChart
              title="Air Quality Contributing Pollutants"
              factors={data.aqi_prediction.top_factors}
            />
            <SHAPBarChart
              title="Health Risk Environmental Drivers"
              factors={data.health_prediction.top_health_factors}
            />
          </div>
        </>
      )}
    </div>
  );
}
