import React, { useState, useEffect } from 'react';
import { fetchAnalyticsOverview } from '../api/client';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, MapPin, Sun, Wind, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCityLine, setSelectedCityLine] = useState('All');

  useEffect(() => {
    fetchAnalyticsOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center text-slate-400">
        Loading national air quality trends and analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span>National Air Quality Trends & State Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical daily trends, 24-hour diurnal pollutant variations, state-wise rankings, and seasonal atmospheric patterns across India
        </p>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">National Average AQI</span>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{data?.national_avg_aqi || 76.8}</div>
          <span className="text-[11px] text-slate-400">Moderate AQI range across monitored regions</span>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Health Risk Score</span>
          <div className="text-2xl font-bold text-teal-400 mt-1 font-mono">{data?.national_avg_health_score || 4.08} / 10</div>
          <span className="text-[11px] text-slate-400">Moderate vulnerability index</span>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Cleanest Monitored Region</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Kochi / Kerala</div>
          <span className="text-[11px] text-slate-400">Avg AQI: 28.6 (Good)</span>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Peak Inversion Hotspot</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">Delhi NCT</div>
          <span className="text-[11px] text-slate-400">Avg AQI: 172.5 (Unhealthy)</span>
        </div>
      </div>

      {/* 7-Day Historical AQI Trends across Major Indian Metros */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              7-Day Historical AQI Trend across Indian Metros
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Monitored over past week</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.historical_7_days || []}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend formatter={(val) => <span className="text-xs text-slate-300 mr-2">{val}</span>} />
              <Line type="monotone" dataKey="Delhi" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Lucknow" stroke="#F97316" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Kolkata" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Mumbai" stroke="#38BDF8" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Chennai" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Bengaluru" stroke="#34D399" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 24-Hour Diurnal Pollutant Curve & State-wise AQI Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 24-Hour Diurnal Hourly Curve */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              24-Hour Diurnal Pollutant Variation Cycle
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Hourly progression showing morning & evening traffic spikes vs afternoon solar Ozone peaks
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.diurnal_24h || []}>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} />
                <Area type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                <Area type="monotone" dataKey="no2" name="NO2 (µg/m³)" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.15} />
                <Area type="monotone" dataKey="o3" name="O3 (µg/m³)" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State-Wise Ranking Bar Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              State-Wise Air Quality Index Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Average recorded ambient AQI across key Indian states & union territories
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.state_wise_ranking || []} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="state" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="avg_aqi" name="Average AQI" fill="#10B981" radius={[0, 4, 4, 0]}>
                  {data?.state_wise_ranking?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.avg_aqi > 120 ? '#EF4444' : entry.avg_aqi > 70 ? '#F59E0B' : '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seasonal Air Quality Patterns across India */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Seasonal Atmospheric & Air Quality Patterns in India
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.seasonal_patterns?.map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-xs text-slate-100 block">{item.season}</span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-xl font-bold font-mono ${
                  item.avg_aqi > 120 ? 'text-rose-400' : item.avg_aqi > 70 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {item.avg_aqi}
                </span>
                <span className="text-[11px] text-slate-400">Avg AQI</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
