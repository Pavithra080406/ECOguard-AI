import React from 'react';

export default function AQIGauge({ aqi, category, colorCode, meaning }) {
  const maxAqi = 350;
  const percentage = Math.min(100, Math.max(0, (aqi / maxAqi) * 100));

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Air Quality Index (Predicted)
      </div>
      
      {/* Circle / Value Display */}
      <div className="relative w-40 h-40 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke={colorCode || '#10B981'}
            strokeWidth="8"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * percentage) / 100}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight" style={{ color: colorCode }}>
            {aqi}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">AQI</span>
        </div>
      </div>

      {/* Category Badge */}
      <div
        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 my-2 shadow-lg"
        style={{ backgroundColor: colorCode || '#10B981' }}
      >
        {category}
      </div>

      <p className="text-xs text-slate-400 text-center mt-2 max-w-xs leading-relaxed">
        {meaning}
      </p>
    </div>
  );
}
