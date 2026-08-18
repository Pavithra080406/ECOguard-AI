import React, { useState, useEffect } from 'react';
import HealthRiskGauge from '../components/HealthRiskGauge';
import SHAPBarChart from '../components/SHAPBarChart';
import { fetchLivePrediction, ALL_INDIA_STATES } from '../api/client';
import {
  HeartPulse, Baby, User, Users, Activity, ShieldAlert,
  AlertCircle, RefreshCw, CheckCircle2, Stethoscope, MapPin, Sparkles, Shield, AlertTriangle
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

  // Extract Key Trigger Factors from Environmental Model
  const topFactors = data?.health_prediction?.top_health_factors || [];
  const primaryFactor = topFactors[0] || { feature: 'PM2.5', importance: 0.48, value: 42.5 };
  const secondaryFactor = topFactors[1] || { feature: 'PM10', importance: 0.28, value: 78.4 };

  const primName = primaryFactor.feature || 'PM2.5';
  const secName = secondaryFactor.feature || 'PM10';

  // Dynamic clinical and demographic assessments
  const demographicCards = [
    {
      id: 'children',
      title: 'Infants & School Children (0–14 yrs)',
      icon: Baby,
      subtext: 'Higher respiratory frequency & developing lung capacity',
      primaryDriver: `Leading Concern: ${primName}`,
      mechanism: `Due to developing airway geometry and higher intake of air per kilogram of body weight, ${primName} particles penetrate deep into alveolar spaces, causing acute airway irritation, coughing, and breathing difficulty during active outdoor play.`,
      advisory: `Avoid strenuous outdoor sports during peak traffic and high ${primName} intervals. Ensure classroom and playroom air is kept clean.`,
      biomarker: 'Airway resistance & pediatric peak flow'
    },
    {
      id: 'commuters',
      title: 'Adult Commuters & Daily Workers',
      icon: User,
      subtext: 'High physical exposure during street-level transit',
      primaryDriver: `Leading Concern: ${primName}`,
      mechanism: `Direct exposure to ambient ${primName} and ${secName} along busy roadways causes eye stinging, throat dryness, accelerated fatigue, and temporary reduction in lung capacity during daily transit.`,
      advisory: `Wear high-filtration protective masks while commuting on roads or two-wheelers. Schedule outdoor fitness workouts for cleaner hours.`,
      biomarker: 'Exertion stamina & respiratory comfort'
    },
    {
      id: 'seniors',
      title: 'Older Adults & Senior Citizens (60+ yrs)',
      icon: Users,
      subtext: 'Reduced lung elasticity & existing cardiovascular sensitivity',
      primaryDriver: `Leading Concern: ${primName}`,
      mechanism: `Elevated levels of ${primName} can exacerbate shortness of breath, elevate resting blood pressure, and increase susceptibility to seasonal chest infections in older adults.`,
      advisory: `Reschedule early morning outdoor walks to warmer, sunlit hours when ground-level pollutants disperse. Continue regular prescribed blood pressure medications.`,
      biomarker: 'Blood pressure & resting heart rate stability'
    },
    {
      id: 'asthma',
      title: 'Patients with Asthma & Respiratory Illness',
      icon: Stethoscope,
      subtext: 'Airway hyper-sensitivity & chronic inflammation',
      primaryDriver: `Leading Trigger: ${primName}`,
      mechanism: `Inhaling ${primName} and ${secName} irritates sensitive bronchial tissues, triggering rapid airway constriction, coughing spells, chest tightness, and increased reliance on inhalers.`,
      advisory: `Keep fast-acting rescue inhalers readily accessible at all times. Use home air purifiers with HEPA filtration to maintain a clean breathing environment.`,
      biomarker: 'Daily peak expiratory flow & inhaler usage'
    },
    {
      id: 'cardiac',
      title: 'Cardiovascular & Hypertension Patients',
      icon: Activity,
      subtext: 'Vascular sensitivity & heart workload',
      primaryDriver: `Leading Trigger: ${primName}`,
      mechanism: `Fine airborne particulates trigger mild blood vessel constriction, placing extra strain on the heart muscle and causing blood pressure fluctuations under current outdoor conditions.`,
      advisory: `Avoid sudden heavy physical exertion outdoors in high-traffic zones. Monitor resting pulse and blood pressure regularly.`,
      biomarker: 'Cardiovascular workload & resting pulse'
    },
    {
      id: 'pregnancy',
      title: 'Expectant Mothers & Maternal Health',
      icon: HeartPulse,
      subtext: 'Prenatal wellness & oxygen delivery considerations',
      primaryDriver: `Leading Concern: ${primName}`,
      mechanism: `Exposure to elevated ${primName} increases maternal fatigue, nasal congestion, and mild respiratory discomfort during routine daily activities.`,
      advisory: `Spend more time in clean, well-ventilated indoor spaces. Practice gentle prenatal exercises indoors and stay well-hydrated.`,
      biomarker: 'Maternal respiratory comfort & resting wellness'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & State/District Selector */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Environmental Health Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
              <span>Demographic & Clinical Health Risk Assessment</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Personalized health guidance and physiological risk profiles for different age groups and clinical conditions across all Indian states & UTs
            </p>
          </div>

          <button
            onClick={() => loadHealthData(selectedDistrict, selectedState)}
            disabled={loading}
            className="flex items-center space-x-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Update Health Assessment</span>
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
            Analyzing environmental health risks for {selectedDistrict}, {selectedState}...
          </span>
        </div>
      ) : data ? (
        <>
          {/* Main Health Gauges & Pollutant Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthRiskGauge
              score={data.health_prediction.health_impact_score}
              riskClass={data.health_prediction.risk_class}
              riskLabel={data.health_prediction.risk_label}
              riskDesc={data.health_prediction.risk_description}
            />

            <SHAPBarChart
              title={`Environmental Pollution Impact Breakdown (${data.location?.city})`}
              factors={data.health_prediction?.top_health_factors}
            />
          </div>

          {/* Environmental Health Summary Banner */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-950/70 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Environmental Health Analysis • {data.location?.city}, {data.location?.state}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              In <strong>{data.location?.city}</strong>, current atmospheric measurements show that <strong className="text-emerald-400">{primName}</strong> is the primary pollutant influencing air quality, followed by <strong className="text-sky-400">{secName}</strong>. Sensitive individuals, young children, and older citizens are advised to observe the personalized guidelines below.
            </p>
          </div>

          {/* Demographic & Clinical Vulnerability Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Demographic & Clinical Health Guidance ({data.location?.city})</span>
              </h2>
              <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">
                Overall Risk Category: <strong className="text-emerald-400">{data.health_prediction?.risk_label}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {demographicCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-800 hover:border-slate-700 transition shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-100">{card.title}</h3>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{card.subtext}</span>
                        </div>
                      </div>

                      {/* Primary Trigger Badge */}
                      <div className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 font-semibold flex items-center space-x-1">
                          <span>Focus Pollutant:</span>
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">{card.primaryDriver}</span>
                      </div>

                      {/* Physiological Pathway */}
                      <div className="space-y-2 text-xs pt-1">
                        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            Physiological Health Effect
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{card.mechanism}</p>
                        </div>

                        {/* Targeted Medical Advisory */}
                        <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                            Recommended Health Action
                          </span>
                          <p className="text-emerald-200 text-[11px] leading-relaxed">{card.advisory}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Health Focus:</span>
                      <span className="font-medium text-slate-300">{card.biomarker}</span>
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
