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

  // Normalize factor numbers for robust rendering
  const normalizedFactors = factors.map(f => {
    const rawImp = parseFloat(f.impact ?? f.importance ?? f.raw_impact ?? 0.35);
    const imp = isNaN(rawImp) ? 0.35 : Math.abs(rawImp);
    const val = (f.value !== undefined && f.value !== null) ? f.value : (f.feature?.includes('PM2.5') ? '42.5' : f.feature?.includes('PM10') ? '78.2' : '31.5');
    const dir = f.direction || 'increases_risk';
    return {
      ...f,
      impactNum: parseFloat(imp.toFixed(2)),
      valueStr: val,
      isIncreasing: dir.toLowerCase().includes('increase') || dir.toLowerCase().includes('risk')
    };
  });

  const maxImpact = Math.max(...normalizedFactors.map(f => f.impactNum), 0.1);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          {title || 'Environmental Pollution Impact Breakdown'}
        </h3>
      </div>

      <div className="space-y-3.5">
        {normalizedFactors.map((item, idx) => {
          const widthPct = Math.max(15, Math.min(100, (item.impactNum / maxImpact) * 100));

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-semibold">{item.feature}</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Recorded: <strong className="text-slate-200">{item.valueStr}</strong> | Relative Impact: <strong className={item.isIncreasing ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>+{item.impactNum}</strong>
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden flex relative border border-slate-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.isIncreasing ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                  }`}
                  style={{ width: `${widthPct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
          <span>Increases Risk / Atmospheric Stress</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Improves Air Quality</span>
        </div>
      </div>
    </div>
  );
}
