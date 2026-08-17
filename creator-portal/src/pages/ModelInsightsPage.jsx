import React, { useState, useEffect } from 'react';
import { fetchModelInfo, fetchDriftReport, fetchMLOpsStatus, triggerRetraining } from '../api/client';
import { Cpu, ShieldCheck, Layers, RefreshCw, Play, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

export default function ModelInsightsPage() {
  const [info, setInfo] = useState(null);
  const [driftReport, setDriftReport] = useState(null);
  const [mlopsStatus, setMlopsStatus] = useState(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);
  const [loadingDrift, setLoadingDrift] = useState(false);

  const loadData = () => {
    fetchModelInfo().then(setInfo).catch(console.error);
    fetchMLOpsStatus().then(setMlopsStatus).catch(console.error);
    loadDrift();
  };

  const loadDrift = () => {
    setLoadingDrift(true);
    fetchDriftReport()
      .then(setDriftReport)
      .catch(console.error)
      .finally(() => setLoadingDrift(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainResult(null);
    try {
      const res = await triggerRetraining();
      setRetrainResult(res);
      loadData();
    } catch (e) {
      setRetrainResult({ retraining_success: false, message: e.message });
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>Machine Learning Models & MLOps Drift Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Kolmogorov-Smirnov & PSI drift detection, baseline validation metrics, and automated retraining loop
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/20"
        >
          {retraining ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Training XGBRegressor on 2021–2024 & Testing 2025...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Trigger Retraining Pipeline</span>
            </>
          )}
        </button>
      </div>

      {retrainResult && (
        <div className={`p-4 rounded-xl border text-xs flex items-center space-x-3 ${
          retrainResult.retraining_success
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong className="block">{retrainResult.message}</strong>
            <span className="text-[11px] text-slate-400 font-mono">
              Baseline criteria: MAE ≤ 0.9790, RMSE ≤ 1.3196, R² ≥ 0.5411
            </span>
          </div>
        </div>
      )}

      {/* Models Specifications Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AQI Model */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>AQI Regression Model</span>
            </h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-semibold border border-emerald-500/30">
              XGBRegressor
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Features Count:</span>
              <span className="font-mono text-slate-100">22 features</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Encoders File:</span>
              <span className="font-mono text-slate-100">models/label_encoders.pkl</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Variable:</span>
              <span className="font-mono text-emerald-400">AQI (Continuous)</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Input Feature Vector</span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {info?.aqi_model.features.map(f => (
                <span key={f} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Health Model */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Health Impact Regression Model</span>
            </h3>
            <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full font-mono font-semibold border border-purple-500/30">
              XGBRegressor (28-Features)
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Features Count:</span>
              <span className="font-mono text-slate-100">EXACTLY 28 features</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Variable:</span>
              <span className="font-mono text-purple-400">HealthImpactScore (Continuous)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Training Period:</span>
              <span className="font-mono text-slate-100">2021–2024 (Test 2025)</span>
            </div>
          </div>

          {/* Baseline Validation Metrics */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 font-mono text-xs">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-sans">Baseline Validation Metrics</span>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">MAE</span>
                <span className="font-bold text-emerald-400">0.9790</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">RMSE</span>
                <span className="font-bold text-sky-400">1.3196</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">R² Score</span>
                <span className="font-bold text-purple-400">0.5411</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">28 Input Features (Order Preserved)</span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {info?.health_model.features.map(f => (
                <span key={f} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Data Drift Monitoring Report */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Statistical Data Drift Monitoring (Kolmogorov-Smirnov & PSI)</span>
          </h3>
          <button
            onClick={loadDrift}
            disabled={loadingDrift}
            className="flex items-center space-x-1 text-xs text-purple-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDrift ? 'animate-spin' : ''}`} />
            <span>Refresh Drift</span>
          </button>
        </div>

        {driftReport?.features_analyzed ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(driftReport.features_analyzed).map(([feat, stats]) => (
              <div key={feat} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-200 block">{feat}</span>
                <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                  <div>KS Stat: <strong className="text-slate-200">{stats.ks_stat}</strong></div>
                  <div>p-value: <strong className="text-slate-200">{stats.p_value}</strong></div>
                  <div>PSI: <strong className="text-slate-200">{stats.psi}</strong></div>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                  stats.status === 'No Drift'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {stats.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 p-4 text-center">Calculating statistical drift across features...</div>
        )}
      </div>
    </div>
  );
}
