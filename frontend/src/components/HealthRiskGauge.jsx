import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function HealthRiskGauge({ score, riskClass, riskLabel, riskDesc }) {
  const getBadgeStyle = (rc) => {
    if (rc === 0) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: ShieldCheck };
    if (rc === 1) return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle };
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: ShieldAlert };
  };

  const style = getBadgeStyle(riskClass);
  const Icon = style.icon;

  // Percentage position on range 0 to 8.0
  const markerPercentage = Math.min(100, Math.max(0, (score / 8.0) * 100));

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Health Impact Risk Score
          </div>
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.border} ${style.text}`}>
            <Icon className="w-4 h-4" />
            <span>{riskLabel}</span>
          </div>
        </div>

        <div className="flex items-baseline space-x-2 my-2">
          <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
          <span className="text-sm text-slate-400 font-medium">/ 10.0</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {riskDesc}
        </p>
      </div>

      {/* Threshold Meter */}
      <div className="mt-2">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
          <span>0.0 (Low Risk)</span>
          <span>3.9 (Moderate)</span>
          <span>5.1 (High Risk)</span>
          <span>8.0+</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full relative overflow-hidden flex">
          <div className="h-full bg-emerald-500/60" style={{ width: '48.7%' }} title="Low Risk Range (<= 3.8955)"></div>
          <div className="h-full bg-amber-500/60" style={{ width: '14.7%' }} title="Moderate Risk Range (3.8955 - 5.0735)"></div>
          <div className="h-full bg-rose-500/60" style={{ width: '36.6%' }} title="High Risk Range (> 5.0735)"></div>
          
          {/* Active Score Pointer */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg rounded-full transform -translate-x-1/2 transition-all duration-700"
            style={{ left: `${markerPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
