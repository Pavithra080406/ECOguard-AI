import React, { useState, useEffect } from 'react';
import { fetchPredictionHistory } from '../api/client';
import { History, Search, Eye, X, Filter } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchPredictionHistory(30, cityFilter);
      setHistory(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [cityFilter]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>MongoDB Prediction History Audit Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persisted records stored in MongoDB collection `ecoguard_ai.prediction_history`
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by city..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Predicted AQI</th>
                <th className="p-4">AQI Category</th>
                <th className="p-4">Health Score</th>
                <th className="p-4">Risk Class</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">Loading prediction history from database...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">No predictions recorded yet. Run a live or manual prediction!</td>
                </tr>
              ) : (
                history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {new Date(row.prediction_time).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.prediction_type === 'LIVE' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      }`}>
                        {row.prediction_type}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-100">
                      {row.location?.city}, {row.location?.state}
                    </td>
                    <td className="p-4 font-bold font-mono text-emerald-400">
                      {row.aqi_prediction?.predicted_aqi}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${row.aqi_prediction?.color_code}20`, color: row.aqi_prediction?.color_code }}>
                        {row.aqi_prediction?.aqi_category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">
                      {row.health_prediction?.health_impact_score}
                    </td>
                    <td className="p-4 font-semibold">
                      {row.health_prediction?.risk_label}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(row)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="View Full JSON Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-700">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                MongoDB Document Record: {selectedRecord.prediction_id}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-mono text-xs text-emerald-300 bg-slate-950/80">
              <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
