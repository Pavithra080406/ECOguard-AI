import React from 'react';
import { Thermometer, Droplets, Wind, Gauge, Cloud, CloudRain } from 'lucide-react';

export default function WeatherCards({ weather }) {
  if (!weather) return null;

  const cards = [
    { title: 'Temperature', value: `${weather.temperature?.toFixed(1)} °C`, icon: Thermometer, color: 'text-amber-400' },
    { title: 'Humidity', value: `${weather.humidity?.toFixed(0)} %`, icon: Droplets, color: 'text-sky-400' },
    { title: 'Wind Speed', value: `${weather.wind_speed?.toFixed(1)} km/h`, icon: Wind, color: 'text-teal-400' },
    { title: 'Pressure', value: `${weather.pressure?.toFixed(0)} hPa`, icon: Gauge, color: 'text-purple-400' },
    { title: 'Cloud Cover', value: `${weather.cloud_cover?.toFixed(0)} %`, icon: Cloud, color: 'text-indigo-400' },
    { title: 'Rainfall', value: `${weather.rainfall?.toFixed(1)} mm`, icon: CloudRain, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="glass-card glass-card-hover p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{c.title}</span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div className="text-xl font-bold text-slate-100 font-mono tracking-tight">{c.value}</div>
          </div>
        );
      })}
    </div>
  );
}
