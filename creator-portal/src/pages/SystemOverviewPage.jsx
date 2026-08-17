import React, { useState, useEffect } from 'react';
import { fetchModelInfo, fetchAnalyticsOverview } from '../api/client';
import { Server, Cpu, Database, Activity, GitBranch, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function SystemOverviewPage() {
  const [modelInfo, setModelInfo] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchModelInfo().then(setModelInfo).catch(console.error);
    fetchAnalyticsOverview().then(setAnalytics).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <span>Creator & System Operations Overview</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Central monitoring dashboard for model registries, inference latency, MongoDB persistence, and pipeline health
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">FastAPI Backend</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-2 font-mono">HEALTHY (v1.0.0)</div>
          <span className="text-[11px] text-slate-400">Port 8000 • CORS Enabled</span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Engine</span>
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-sky-400 mt-2 font-mono">MongoDB Active</div>
          <span className="text-[11px] text-slate-400">DB: ecoguard_ai</span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AQI XGBoost Model</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 mt-2 font-mono">22 Features</div>
          <span className="text-[11px] text-slate-400">models/aqi_model.pkl</span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Model</span>
            <ShieldCheck className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 mt-2 font-mono">28 Features (R² 0.54)</div>
          <span className="text-[11px] text-slate-400">models/health_impact_3class_model.pkl</span>
        </div>
      </div>

      {/* Model Registry Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>AQI Prediction Engine (22 Features)</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Model Algorithm:</span>
              <span className="font-mono text-slate-100">XGBoost Regressor (Continuous AQI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Encoders Path:</span>
              <span className="font-mono text-slate-100">models/label_encoders.pkl</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SHAP Explainer:</span>
              <span className="font-mono text-emerald-400">shap.TreeExplainer Active</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Health Risk Model (28 Features)</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Model Algorithm:</span>
              <span className="font-mono text-slate-100">XGBoost Regressor (HealthImpactScore)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Saved Thresholds:</span>
              <span className="font-mono text-purple-300">Low ≤ 3.8955, High &gt; 5.0735</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Baseline Validation:</span>
              <span className="font-mono text-slate-100">MAE: 0.9790 | RMSE: 1.3196 | R²: 0.5411</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
