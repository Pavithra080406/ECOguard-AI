import React, { useState } from 'react';
import AQIGauge from '../components/AQIGauge';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import { fetchManualPrediction, ALL_INDIA_STATES } from '../api/client';
import {
  Sliders, Play, RefreshCw, AlertCircle, MapPin, Wind, Sparkles,
  Shield, ShieldAlert, Baby, User, Users, Stethoscope, Activity, HeartPulse
} from 'lucide-react';

export default function ManualPredictionPage() {
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
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

  const currentDistricts = ALL_INDIA_STATES.find(s => s.state === selectedState)?.districts || [];

  const handleStateChange = (st) => {
    setSelectedState(st);
    const dists = ALL_INDIA_STATES.find(s => s.state === st)?.districts || [];
    const firstCity = dists[0] || 'Delhi';
    setForm(prev => ({
      ...prev,
      state: st,
      city: firstCity
    }));
  };

  const handleCitySelect = (cityName) => {
    setForm(prev => ({
      ...prev,
      city: cityName
    }));
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

  // Derive dominant pollutant in simulated form
  const dominantPollutant = form.pm2_5 > 60 ? 'Fine Particulate Matter (PM2.5)'
    : form.no2 > 40 ? 'Nitrogen Dioxide (NO2)'
    : form.o3 > 50 ? 'Ground-Level Ozone (O3)'
    : form.so2 > 20 ? 'Sulfur Dioxide (SO2)'
    : 'Particulate Dust (PM10)';

  const simAqi = result?.aqi_prediction?.predicted_aqi || 0;
  const simRiskClass = result?.health_prediction?.risk_class ?? 1;

  // Demographic & Clinical simulation impacts
  const simulationDemographics = [
    {
      id: 'children',
      title: 'Infants & School Children (0–14 yrs)',
      icon: Baby,
      subtext: 'High respiratory rate & developing airway caliber',
      concern: simRiskClass === 2
        ? `High particle load (PM2.5: ${form.pm2_5} µg/m³) penetrates deep into developing alveoli, causing airway inflammation, persistent cough, and wheezing.`
        : simRiskClass === 1
        ? `Moderate exposure can cause mild nasal and throat dryness during active outdoor school playground sports.`
        : `Safe baseline conditions. Normal outdoor play and school sports are safe.`,
      advisory: simRiskClass === 2
        ? 'Suspend high-intensity outdoor games; keep children in clean, air-filtered indoor rooms.'
        : 'Ensure active hydration and avoid play along heavy traffic corridors.'
    },
    {
      id: 'commuters',
      title: 'Adult Commuters & Daily Workers',
      icon: User,
      subtext: 'Extended physical exposure during transit',
      concern: simRiskClass === 2
        ? `High ambient pollutant load triggers pharyngeal burning, vocal cord irritation, reduced lung volume, and early fatigue during outdoor commute.`
        : `Mild throat dryness; manageable with standard commuter pacing.`,
      advisory: simRiskClass === 2
        ? 'Wear an N95/FFP2 protective mask while on roads or two-wheelers. Avoid rush-hour street workouts.'
        : 'Normal transit routines permitted; stay hydrated.'
    },
    {
      id: 'seniors',
      title: 'Older Adults & Senior Citizens (60+ yrs)',
      icon: Users,
      subtext: 'Reduced lung elasticity & existing vascular stiffness',
      concern: simRiskClass === 2
        ? `Simulated conditions elevate blood pressure and cardiac workload while exacerbating nocturnal shortness of breath.`
        : `Slight fatigue during long walks; minimal cardiac strain under rested baseline.`,
      advisory: simRiskClass === 2
        ? 'Avoid early morning walks when ground inversion traps pollutants; walk in well-ventilated indoor halls.'
        : 'Safe for daily morning and evening walks.'
    },
    {
      id: 'asthma',
      title: 'Patients with Asthma & COPD',
      icon: Stethoscope,
      subtext: 'Airway hyper-sensitivity & chronic inflammation',
      concern: simRiskClass === 2
        ? `Inhaled pollutants provoke rapid mast-cell degranulation, acute bronchospasms, and sudden drops in peak flow.`
        : `Minor airway sensitivity; potential reaction if exposed to sudden dust or cold air.`,
      advisory: simRiskClass === 2
        ? 'Keep rescue bronchodilator inhalers within immediate reach at all times; run indoor HEPA filtration.'
        : 'Maintain prescribed routine inhaler schedule and monitor peak flow.'
    },
    {
      id: 'cardiac',
      title: 'Cardiovascular & Hypertension Patients',
      icon: Activity,
      subtext: 'Vascular sensitivity & myocardial oxygen demand',
      concern: simRiskClass === 2
        ? `Fine particulates trigger arterial vasoconstriction, elevating systolic pressure and cardiac workload.`
        : `Standard baseline cardiovascular comfort with nominal atmospheric strain.`,
      advisory: simRiskClass === 2
        ? 'Avoid sudden strenuous physical exertion outdoors. Monitor blood pressure and resting pulse.'
        : 'Continue routine prescribed cardiovascular medications.'
    },
    {
      id: 'pregnancy',
      title: 'Expectant Mothers & Maternal Health',
      icon: HeartPulse,
      subtext: 'Prenatal wellness & maternal oxygenation',
      concern: simRiskClass === 2
        ? `Elevated ambient pollution increases maternal fatigue, headaches, and systemic oxidative stress.`
        : `Favorable atmospheric conditions with minimal prenatal respiratory strain.`,
      advisory: simRiskClass === 2
        ? 'Spend time in clean, well-ventilated indoor spaces. Practice gentle prenatal breathing exercises.'
        : 'Safe for routine outdoor prenatal walks.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-indigo-400" />
          <span>Air Quality & Health Scenario Simulator</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Simulate customized environmental, weather, and pollutant parameters for any Indian State, UT, and District to forecast AQI and detailed clinical risk impact
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-3xl space-y-6 border border-slate-800">
        {/* Location Selection across 28 States & 8 UTs */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">
            Target Region in India (28 States & 8 UTs)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>State / Union Territory</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
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
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>City / District</span>
              </label>
              <select
                value={form.city}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {currentDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Population Density (Est.)</label>
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
          <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-3">
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
              <div key={item.name} className="space-y-1 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
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
          <h3 className="text-xs uppercase tracking-widest text-sky-400 font-bold mb-3">
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
              <div key={item.name} className="space-y-1 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
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
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Simulating Environmental Forecast for {form.city}, {form.state}...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Scenario Simulation for {form.city}</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Scenario Simulation Forecast Output ({form.city}, {form.state})
              </h2>
              <p className="text-xs text-slate-400">
                Detailed air quality index, physiological health assessment, and clinical demographic advisories
              </p>
            </div>
            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">
              Simulated AQI: <strong className="text-emerald-400">{simAqi}</strong>
            </span>
          </div>

          {/* Main Gauges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* AI Clinical & Environmental Advisory Banner */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-950/70 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Simulated Environmental Health Assessment • {form.city}, {form.state}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {result.advisory?.primary_health_advice || (
                `Under this simulated scenario in ${form.city}, ${dominantPollutant} is the dominant air stressor. The projected AQI of ${simAqi} creates a ${result.health_prediction?.risk_label.toLowerCase()} condition across sensitive demographics.`
              )}
            </p>
          </div>

          {/* Actionable Daily Living Guidelines Grid */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Simulated Actionable Health & Lifestyle Guidelines</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Outdoor Exercise</span>
                <span className="text-xs font-bold text-slate-100 mt-1 block">
                  {result.advisory?.activity_guidelines?.outdoor_exercise || (simRiskClass === 2 ? "Avoid strenuous outdoor workouts" : "Permitted with normal pacing")}
                </span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Mask Advisory</span>
                <span className="text-xs font-bold text-slate-100 mt-1 block">
                  {result.advisory?.activity_guidelines?.mask_recommendation || (simRiskClass === 2 ? "N95 / FFP2 mask strongly advised" : "Optional for general public")}
                </span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Home Ventilation</span>
                <span className="text-xs font-bold text-slate-100 mt-1 block">
                  {result.advisory?.activity_guidelines?.ventilation || (simRiskClass === 2 ? "Keep windows sealed against particulates" : "Safe to ventilate indoor living spaces")}
                </span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Sensitive Groups</span>
                <span className="text-xs font-bold text-amber-300 mt-1 block">
                  {result.advisory?.activity_guidelines?.sensitive_groups_action || "Keep rescue inhalers accessible"}
                </span>
              </div>
            </div>
          </div>

          {/* Demographic & Clinical Impact Matrix (6 Cards) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Simulated Demographic & Clinical Vulnerability Matrix ({form.city})</span>
              </h3>
              <span className="text-xs text-slate-400">
                Risk Classification: <strong className="text-emerald-400">{result.health_prediction?.risk_label}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulationDemographics.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="glass-card p-4 rounded-2xl flex flex-col justify-between space-y-3 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-rose-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{card.title}</h4>
                          <span className="text-[10px] text-slate-400 block">{card.subtext}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                          Physiological Impact
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{card.concern}</p>
                      </div>

                      <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">
                          Targeted Health Precaution
                        </span>
                        <p className="text-emerald-200 text-[11px] leading-relaxed">{card.advisory}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Factor Attribution Breakdown */}
          <SHAPBarChart
            title={`Simulated Pollutant Contribution Factors (${form.city})`}
            factors={result.health_prediction?.top_health_factors}
          />
        </div>
      )}
    </div>
  );
}
