import React, { useState } from 'react';
import SystemOverviewPage from './pages/SystemOverviewPage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import HistoryPage from './pages/HistoryPage';
import ArchitecturePage from './pages/ArchitecturePage';
import {
  Activity, Cpu, History, Network, ShieldCheck, Terminal
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'System Operations & Health', icon: Activity },
    { id: 'models', label: 'ML Models & Drift Monitoring', icon: Cpu },
    { id: 'history', label: 'MongoDB Audit Log', icon: History },
    { id: 'architecture', label: 'System Architecture', icon: Network },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* Top Creator Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center space-x-1.5">
                <span>ECOguard AI</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  Creator Console
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold block uppercase">
                MLOps Engineering, Drift Monitoring & Audit Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FastAPI (8000) Active</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 overflow-x-auto scrollbar-none py-1.5 border-t border-slate-900">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <SystemOverviewPage />}
        {activeTab === 'models' && <ModelInsightsPage />}
        {activeTab === 'history' && <HistoryPage />}
        {activeTab === 'architecture' && <ArchitecturePage />}
      </main>

      {/* Creator Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        ECOguard AI • Creator & MLOps Engineering Portal • Running on localhost:3001
      </footer>
    </div>
  );
}
