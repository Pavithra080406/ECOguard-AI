import React, { useState, useEffect } from 'react';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import { fetchLivePrediction } from '../api/client';
import { HeartPulse, Users, ShieldAlert, CheckCircle2, Info, Baby, Activity, UserCheck, Stethoscope, AlertTriangle } from 'lucide-react';

export default function HealthAssessmentPage() {
  const [city, setCity] = useState('Chennai');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLivePrediction(city)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city]);

  const indianCities = [
    'Chennai', 'Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad',
    'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Patna', 'Bhopal'
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <span>Health Risk & Clinical Vulnerability Assessment</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Demographic impact analysis, age-specific risks, and guidance for respiratory and cardiovascular conditions
          </p>
        </div>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-slate-100 focus:outline-none focus:border-rose-500 w-full md:w-56"
        >
          {indianCities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthRiskGauge
              score={data.health_prediction.health_impact_score}
              riskClass={data.health_prediction.risk_class}
              riskLabel={data.health_prediction.risk_label}
              riskDesc={data.health_prediction.risk_description}
            />

            {/* Health Risk Level Scale */}
            <div className="glass-card p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-slate-300">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Health Risk Level Thresholds</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className={`p-3 rounded-xl border flex justify-between items-center ${
                  data.health_prediction.risk_class === 0 ? 'bg-emerald-500/20 border-emerald-500' : 'bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  <div>
                    <span className="font-bold text-emerald-400">Low Risk (Score ≤ 3.9)</span>
                    <p className="text-[11px] text-slate-400">Normal healthy conditions. Minimal physiological strain on population.</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">Clean Air</span>
                </div>

                <div className={`p-3 rounded-xl border flex justify-between items-center ${
                  data.health_prediction.risk_class === 1 ? 'bg-amber-500/20 border-amber-500' : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  <div>
                    <span className="font-bold text-amber-400">Moderate Risk (Score 3.9 – 5.1)</span>
                    <p className="text-[11px] text-slate-400">Mild to moderate irritation for sensitive individuals; monitor symptoms.</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">Caution</span>
                </div>

                <div className={`p-3 rounded-xl border flex justify-between items-center ${
                  data.health_prediction.risk_class === 2 ? 'bg-rose-500/20 border-rose-500' : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  <div>
                    <span className="font-bold text-rose-400">High Risk (Score &gt; 5.1)</span>
                    <p className="text-[11px] text-slate-400">Acute risk of exacerbation for respiratory and cardiovascular sufferers.</p>
                  </div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono">High Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Demographic & Clinical Vulnerability Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Vulnerability Breakdown by Age Group & Medical Conditions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Children */}
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-sky-400 space-y-2">
                <div className="flex items-center space-x-2 text-sky-400">
                  <Baby className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-slate-100">Children & Infants (0–14 yrs)</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Children breathe faster per kg of body weight. Fine particulate matter penetrates deeper into developing bronchial tubes, increasing risks of coughing, wheezing, and childhood asthma flare-ups.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-sky-300">Action:</strong> Limit intense outdoor school sports during peak traffic hours.
                </div>
              </div>

              {/* Adults & Commuters */}
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-400 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <UserCheck className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-slate-100">Adults & Outdoor Workers</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Daily commuters and outdoor physical workers experience throat irritation, eye stinging, reduced endurance, and fatigue from elevated NO2 and particulate matter.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-emerald-300">Action:</strong> Wear N95 masks when commuting along major arterial roads.
                </div>
              </div>

              {/* Seniors */}
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-400 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Activity className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-slate-100">Senior Citizens (60+ yrs)</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reduced lung elasticity and underlying cardiovascular vulnerabilities increase susceptibility to respiratory fatigue, elevated blood pressure, and pneumonia.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-amber-300">Action:</strong> Reschedule early morning walks to well-ventilated indoor spaces or sunny afternoons.
                </div>
              </div>

              {/* Respiratory Patients */}
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-rose-400 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400">
                  <Stethoscope className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-slate-100">Asthma, COPD & Bronchitis</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ultrafine particulates and Ozone directly induce airway hyper-reactivity, bronchospasm, and mucous membrane inflammation, which can trigger sudden respiratory distress.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-rose-300">Action:</strong> Keep quick-relief bronchodilator inhalers accessible at all times.
                </div>
              </div>

              {/* Cardiovascular Patients */}
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-purple-400 space-y-2">
                <div className="flex items-center space-x-2 text-purple-400">
                  <HeartPulse className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-slate-100">Cardiovascular & Hypertension</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Inhaled PM2.5 crosses the lung-blood barrier into the circulation, accelerating arterial vasoconstriction, microvascular inflammation, and elevating heart rate and blood pressure.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-purple-300">Action:</strong> Avoid strenuous physical exertion outdoors during high pollution periods.
                </div>
              </div>

              {/* Pregnant Women */}
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-indigo-400 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-slate-100">Expectant Mothers</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Systemic inflammatory responses and Carbon Monoxide can impair placental oxygen transfer and fetal development.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-indigo-300">Action:</strong> Stay in clean indoor environments with HEPA air filtration.
                </div>
              </div>
            </div>
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
