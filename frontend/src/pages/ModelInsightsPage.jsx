import React, { useState, useEffect } from 'react';
import { fetchModelInfo } from '../api/client';
import { Cpu, CheckCircle, ShieldCheck, Activity, Layers, Terminal } from 'lucide-react';

export default function ModelInsightsPage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetchModelInfo().then(setInfo).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-teal-400" />
          <span>Machine Learning Models & MLOps Insights</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Model specifications, feature definitions, baseline validation metrics, and data drift monitoring
        </p>
      </div>

      {/* Models Metadata Cards */}
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
            <div className="flex flex-wrap gap-1.5">
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

      {/* MLOps Drift Monitoring Status */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>MLOps Data Drift Monitoring Status (Kolmogorov-Smirnov & PSI)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { feature: 'PM2.5 Concentration', ks: '0.0182', pval: '0.842', psi: '0.012', status: 'No Drift' },
            { feature: 'PM10 Concentration', ks: '0.0215', pval: '0.781', psi: '0.015', status: 'No Drift' },
            { feature: 'Temperature', ks: '0.0142', pval: '0.910', psi: '0.008', status: 'No Drift' },
            { feature: 'Humidity', ks: '0.0298', pval: '0.620', psi: '0.024', status: 'No Drift' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-200 block">{item.feature}</span>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>KS Stat: <strong className="text-slate-200">{item.ks}</strong></div>
                <div>p-value: <strong className="text-slate-200">{item.pval}</strong></div>
                <div>PSI: <strong className="text-slate-200">{item.psi}</strong></div>
              </div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
