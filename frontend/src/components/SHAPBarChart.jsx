import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SHAPBarChart({ title, factors }) {
  if (!factors || factors.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl text-center text-slate-400 text-sm">
        No environmental attribution factors available.
      </div>
    );
  }

  const maxImpact = Math.max(...factors.map(f => f.impact), 0.1);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          {title || 'Key Environmental Contributing Factors'}
        </h3>
      </div>

      <div className="space-y-3">
        {factors.map((item, idx) => {
          const widthPct = Math.min(100, (item.impact / maxImpact) * 100);
          const isIncreasing = item.direction.includes('increase');

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-semibold">{item.feature}</span>
                <span className="text-slate-400 font-mono">
                  Recorded: <strong className="text-slate-200">{item.value}</strong> | Impact: <strong className={isIncreasing ? 'text-rose-400' : 'text-emerald-400'}>{item.impact}</strong>
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isIncreasing ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${widthPct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
          <span>Increases Risk / Pollution</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Improves Quality / Cleans Air</span>
        </div>
      </div>
    </div>
  );
}
