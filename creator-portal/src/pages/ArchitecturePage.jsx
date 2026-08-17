import React from 'react';
import { Network, Server, Cpu, Database, ArrowRight } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Network className="w-5 h-5 text-indigo-400" />
          <span>System Architecture & Pipeline Engineering</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete production architecture from Live/Manual inputs through XGBoost, 28-feature transformation, SHAP XAI, MongoDB persistence, and MLOps monitoring
        </p>
      </div>

      {/* Interactive System Flow Diagram */}
      <div className="glass-card p-6 rounded-2xl overflow-x-auto">
        <h3 className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-6">
          End-to-End Prediction & Decision Pipeline Diagram
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[700px] text-xs">
          {/* Entry points */}
          <div className="space-y-2 w-44">
            <div className="bg-slate-900 border border-teal-500/40 p-3 rounded-xl text-center">
              <span className="font-bold text-teal-400 block">1. Live Data API</span>
              <span className="text-[10px] text-slate-400">Geocoding & OpenWeather</span>
            </div>
            <div className="bg-slate-900 border border-purple-500/40 p-3 rounded-xl text-center">
              <span className="font-bold text-purple-400 block">2. Manual Inputs</span>
              <span className="text-[10px] text-slate-400">User Form Parameters</span>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500 hidden md:block" />

          {/* AQI XGBoost */}
          <div className="bg-slate-900 border border-emerald-500/40 p-3 rounded-xl text-center w-44">
            <span className="font-bold text-emerald-400 block">AQI XGBoost</span>
            <span className="text-[10px] text-slate-400">22 Features Engine</span>
            <span className="block mt-1 text-[11px] font-mono text-emerald-300">Predicted AQI</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500 hidden md:block" />

          {/* 28 Health Features Generator */}
          <div className="bg-slate-900 border border-indigo-500/40 p-3 rounded-xl text-center w-48">
            <span className="font-bold text-indigo-400 block">Health Feature Vector</span>
            <span className="text-[10px] text-slate-400">28 Exact Features Transformation</span>
            <span className="block mt-1 text-[10px] font-mono text-indigo-300">encoders & imputation</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500 hidden md:block" />

          {/* Health XGBRegressor */}
          <div className="bg-slate-900 border border-rose-500/40 p-3 rounded-xl text-center w-48">
            <span className="font-bold text-rose-400 block">Health XGBRegressor</span>
            <span className="text-[10px] text-slate-400">Health Impact Score (1-10)</span>
            <span className="block mt-1 text-[10px] font-mono text-amber-300">Thresholds: 3.8955 / 5.0735</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500 hidden md:block" />

          {/* SHAP & Output */}
          <div className="space-y-2 w-44">
            <div className="bg-slate-900 border border-sky-500/40 p-3 rounded-xl text-center">
              <span className="font-bold text-sky-400 block">SHAP Explainability</span>
              <span className="text-[10px] text-slate-400">Feature Attribution</span>
            </div>
            <div className="bg-slate-900 border border-emerald-500/40 p-3 rounded-xl text-center">
              <span className="font-bold text-emerald-400 block">MongoDB & MLOps</span>
              <span className="text-[10px] text-slate-400">History & Drift Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Server className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">FastAPI Backend</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Python 3.12 + FastAPI async server</li>
            <li>Singleton model loading on startup</li>
            <li>Pydantic v2 data validation schemas</li>
            <li>Geocoding & OpenWeather APIs fallback</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-purple-400">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">XGBoost & SHAP ML</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>AQI continuous XGBRegressor model</li>
            <li>28-Feature Health Impact XGBRegressor</li>
            <li>SHAP TreeExplainer attribution</li>
            <li>Saved threshold risk mapping (3 classes)</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-sky-400">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">MongoDB & MLOps</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>MongoDB database `ecoguard_ai`</li>
            <li>Collections: `prediction_history`, etc.</li>
            <li>Kolmogorov-Smirnov & PSI drift detection</li>
            <li>Temporal retraining loop & MLflow tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
