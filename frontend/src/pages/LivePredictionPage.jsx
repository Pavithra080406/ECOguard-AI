import React, { useState, useEffect } from 'react';
import AQIGauge from '../components/AQIGauge';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import WeatherCards from '../components/WeatherCards';
import { fetchLivePrediction } from '../api/client';
import { RefreshCw, Clock, Wind, ShieldCheck, MapPin } from 'lucide-react';

export default function LivePredictionPage() {
  const [city, setCity] = useState('Chennai');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLive = async () => {
    setLoading(true);
    try {
      const res = await fetchLivePrediction(city);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLive();
  }, [city]);

  const indianCities = [
    { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Delhi', state: 'Delhi NCT' },
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Bengaluru', state: 'Karnataka' },
    { city: 'Kolkata', state: 'West Bengal' },
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Ahmedabad', state: 'Gujarat' },
    { city: 'Pune', state: 'Maharashtra' },
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Lucknow', state: 'Uttar Pradesh' },
    { city: 'Chandigarh', state: 'Punjab' },
    { city: 'Bhopal', state: 'Madhya Pradesh' },
    { city: 'Patna', state: 'Bihar' },
    { city: 'Kochi', state: 'Kerala' },
    { city: 'Guwahati', state: 'Assam' },
    { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Wind className="w-5 h-5 text-teal-400" />
            <span>Live Air Quality & Weather Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-pollutant telemetry, meteorological conditions & health vulnerability forecast
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {indianCities.map(c => (
                <option key={c.city} value={c.city}>{c.city} ({c.state})</option>
              ))}
            </select>
          </div>

          <button
            onClick={loadLive}
            disabled={loading}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {!loading && data && (
        <>
          {/* Timestamp & Location bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 px-2 font-mono gap-1">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Location: <strong className="text-slate-200 ml-1">{data.location.city}, {data.location.state}</strong>
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> Telemetry Retrieved: {new Date(data.prediction_time).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            {/* Pollutants Breakdown */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
                Ambient Pollutant Concentrations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'PM2.5', val: data.pollutants.pm2_5, unit: 'µg/m³', color: 'text-amber-400' },
                  { name: 'PM10', val: data.pollutants.pm10, unit: 'µg/m³', color: 'text-orange-400' },
                  { name: 'NO2', val: data.pollutants.no2, unit: 'µg/m³', color: 'text-sky-400' },
                  { name: 'SO2', val: data.pollutants.so2, unit: 'µg/m³', color: 'text-purple-400' },
                  { name: 'O3', val: data.pollutants.o3, unit: 'µg/m³', color: 'text-teal-400' },
                  { name: 'CO', val: data.pollutants.co, unit: 'mg/m³', color: 'text-blue-400' },
                  { name: 'NH3', val: data.pollutants.nh3, unit: 'µg/m³', color: 'text-indigo-400' },
                  { name: 'Pb', val: data.pollutants.pb, unit: 'µg/m³', color: 'text-slate-400' },
                ].map((p, i) => (
                  <div key={i} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">{p.name}</span>
                    <span className={`text-base font-bold font-mono ${p.color}`}>
                      {p.val?.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">{p.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <WeatherCards weather={data.weather} />

          {/* Recommendations Card */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Recommended Environmental Health Guidelines</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {data.health_prediction.health_advice.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <SHAPBarChart
            title="Environmental Health Risk Contribution Factors"
            factors={data.health_prediction.top_health_factors}
          />
        </>
      )}
    </div>
  );
}
