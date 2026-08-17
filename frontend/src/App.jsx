import React, { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import LivePredictionPage from './pages/LivePredictionPage';
import ManualPredictionPage from './pages/ManualPredictionPage';
import HealthAssessmentPage from './pages/HealthAssessmentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import {
  LayoutDashboard, Wind, Sliders, HeartPulse, BarChart3, Leaf
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Air Quality & Weather', icon: Wind },
    { id: 'health', label: 'Health & Demographics Risk', icon: HeartPulse },
    { id: 'analytics', label: 'National Trends & Analytics', icon: BarChart3 },
    { id: 'manual', label: 'Scenario Simulator', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center space-x-1">
                <span>ECOguard</span>
                <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold block uppercase">
                India Environmental & Health Intelligence Platform
              </span>
            </div>
          </div>

          {/* Clean Public Live Status Indicator */}
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Air Quality Monitoring: Active</span>
          </div>
        </div>

        {/* Public Tab Navigation Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto scrollbar-none py-1.5 border-t border-slate-900">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'live' && <LivePredictionPage />}
        {activeTab === 'health' && <HealthAssessmentPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'manual' && <ManualPredictionPage />}
      </main>

      {/* Public Production-Ready Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        ECOguard AI • National Environmental Intelligence & Health Risk Assessment Platform • Serving All Indian States & Union Territories
      </footer>
    </div>
  );
}
