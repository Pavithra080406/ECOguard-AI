import React, { useState, useEffect } from 'react';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import { fetchLivePrediction, ALL_INDIA_STATES } from '../api/client';
import {
  HeartPulse, Baby, User, Users, Activity, ShieldAlert,
  AlertCircle, RefreshCw, CheckCircle2, ChevronRight, Stethoscope, MapPin
} from 'lucide-react';

export default function HealthAssessmentPage() {
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDistricts = ALL_INDIA_STATES.find(s => s.state === selectedState)?.districts || [];

  const loadHealthData = async (city, state) => {
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
    loadHealthData(selectedDistrict, selectedState);
  }, []);

  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const dists = ALL_INDIA_STATES.find(s => s.state === newState)?.districts || [];
    const first = dists[0] || 'Delhi';
    setSelectedDistrict(first);
    loadHealthData(first, newState);
  };

  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist);
    loadHealthData(newDist, selectedState);
  };

  const riskClass = data?.health_prediction?.risk_class ?? 1;

  const demographicImpacts = [
    {
      title: "Children & Infants (0–14 yrs)",
      icon: Baby,
      color: "emerald",
      physiology: "Higher ventilation rate per body weight & developing respiratory airways.",
      riskLevel: riskClass === 2 ? "High Alert" : riskClass === 1 ? "Moderate Caution" : "Low Risk",
      impact: riskClass === 2
        ? "Micro-particles (PM2.5) penetrate deep alveolar regions causing acute airway inflammation and wheezing."
        : "Minor susceptibility during strenuous playground activities; normal baseline precautions.",
      advisory: riskClass === 2
        ? "Limit outdoor morning activities; avoid outdoor school sports and keep indoor air purified."
        : "Encourage active hydration and avoid prolonged play near heavy traffic corridors."
    },
    {
      title: "Adults & Daily Commuters",
      icon: User,
      color: "sky",
      physiology: "Extended exposure to vehicular NOx, diesel particulate matter, and ozone.",
      riskLevel: riskClass === 2 ? "Elevated Strain" : riskClass === 1 ? "Mild Irritation" : "Nominal Risk",
      impact: riskClass === 2
        ? "Throat irritation, reduced lung volume, fatigue, and headaches during peak commuter hours."
        : "Standard tolerance; slight dryness or fatigue on heavily congested arterial roads.",
      advisory: riskClass === 2
        ? "Wear an N95 mask while commuting on two-wheelers or open transit; schedule runs for afternoon hours."
        : "Stay hydrated and use public transit or carpooling where possible."
    },
    {
      title: "Senior Citizens (60+ yrs)",
      icon: Users,
      color: "purple",
      physiology: "Reduced cardiopulmonary reserve and pre-existing vascular stiffening.",
      riskLevel: riskClass === 2 ? "Critical Precaution" : riskClass === 1 ? "Moderate Alert" : "Safe",
      impact: riskClass === 2
        ? "Increased arterial blood pressure, elevated arrhythmia risk, and exacerbated dyspnea."
        : "Mild fatigue during morning walks; manageable with leisurely pacing.",
      advisory: riskClass === 2
        ? "Postpone early morning walks until sunlight disperses ground inversion layers; stay indoors."
        : "Opt for afternoon walks; maintain regular prescribed blood pressure medications."
    },
    {
      title: "Asthma & Respiratory Illness (COPD)",
      icon: Stethoscope,
      color: "rose",
      physiology: "Hyper-reactive bronchial airways triggered by PM2.5, SO2, and ground ozone.",
      riskLevel: riskClass === 2 ? "Severe Risk" : riskClass === 1 ? "Moderate Sensitivity" : "Controlled",
      impact: riskClass === 2
        ? "Acute bronchospasm, frequent coughing fits, reduced peak flow, and increased rescue inhaler reliance."
        : "Intermittent chest tightness; potential reaction to sudden cold air or construction dust.",
      advisory: riskClass === 2
        ? "Keep fast-acting bronchodilator inhalers accessible at all times; use HEPA air purifiers indoors."
        : "Monitor peak flow numbers and avoid dusty environments or incense smoke."
    },
    {
      title: "Cardiovascular & Hypertension Patients",
      icon: Activity,
      color: "amber",
      physiology: "Systemic vascular inflammation, platelet activation, and autonomic nervous strain.",
      riskLevel: riskClass === 2 ? "High Alert" : riskClass === 1 ? "Moderate Caution" : "Low Risk",
      impact: riskClass === 2
        ? "Elevated myocardial oxygen demand, autonomic imbalance, and increased ischemic event susceptibility."
        : "Minor endothelial stress; minimal risk under rested baseline conditions.",
      advisory: riskClass === 2
        ? "Avoid strenuous physical exertion; monitor resting pulse and blood pressure closely."
        : "Continue prescribed cardioprotective regimens and maintain healthy hydration."
    },
    {
      title: "Expectant Mothers",
      icon: HeartPulse,
      color: "pink",
      physiology: "Altered maternal hemodynamic state & transplacental particle transfer considerations.",
      riskLevel: riskClass === 2 ? "High Precaution" : riskClass === 1 ? "Moderate Alert" : "Normal",
      impact: riskClass === 2
        ? "Oxidative stress and potential systemic inflammatory response impacting maternal well-being."
        : "Standard physiological adaptations; minimal acute adverse triggers.",
      advisory: riskClass === 2
        ? "Avoid outdoor transit during rush hours; practice indoor prenatal yoga and breathing exercises."
        : "Maintain adequate indoor air circulation and stay well-hydrated."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & State/District Selector */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center space-x-2">
              <HeartPulse className="w-6 h-6 text-rose-400" />
              <span>Demographic & Clinical Health Vulnerability Risk Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Physiological risk profiling and medical advisories for all age groups and sensitive clinical conditions across all Indian states & UTs
            </p>
          </div>

          <button
            onClick={() => loadHealthData(selectedDistrict, selectedState)}
            disabled={loading}
            className="flex items-center space-x-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-evaluate Risks</span>
          </button>
        </div>

        {/* Dual Hierarchy State & District Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800/80">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>State / Union Territory</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
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
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              <span>City / District</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
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
          <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">
            Computing clinical demographic risk pathways for {selectedDistrict}, {selectedState}...
          </span>
        </div>
      ) : data ? (
        <>
          {/* Main Health Gauges and SHAP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthRiskGauge
              score={data.health_prediction.health_impact_score}
              riskClass={data.health_prediction.risk_class}
              riskLabel={data.health_prediction.risk_label}
              riskDesc={data.health_prediction.risk_description}
            />

            <SHAPBarChart
              title={`Clinical Risk Attribution Factors (${data.location?.city}, ${data.location?.state})`}
              factors={data.health_prediction?.top_health_factors}
            />
          </div>

          {/* Demographic & Clinical Vulnerability Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Targeted Demographic & Clinical Vulnerability Matrix ({data.location?.city})</span>
              </h2>
              <span className="text-xs text-slate-400">
                Live Status: <strong className="text-slate-200">{data.health_prediction?.risk_label}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {demographicImpacts.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-rose-400" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-100">{card.title}</h3>
                            <span className="text-[10px] text-slate-400 block">{card.physiology}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs pt-1">
                        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            Physiological Impact
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{card.impact}</p>
                        </div>

                        <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                            Medical Action / Advisory
                          </span>
                          <p className="text-emerald-200 text-[11px] leading-relaxed">{card.advisory}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
