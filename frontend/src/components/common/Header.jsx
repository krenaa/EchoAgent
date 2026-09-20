import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Play, 
  Sliders, 
  LogOut, 
  Calendar, 
  Radio, 
  PauseCircle,
  Sparkles
} from 'lucide-react';

export const Header = ({ onOpenPreferences, onTriggerRunNow, running }) => {
  const { user, preferences, logout } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const isActive = preferences?.is_active ?? true;

  return (
    <header className="border-b border-white/10 bg-[#090a0f]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight font-outfit">EchoAgent</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                v1.0 AI Engine
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              {isActive ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Daily at 07:00 AM
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <PauseCircle className="w-3 h-3" />
                  Paused
                </span>
              )}
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3" />
                {today}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPreferences}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-all cursor-pointer hover:border-purple-500/30"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Preferences</span>
          </button>

          <button
            onClick={onTriggerRunNow}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{running ? 'Running Pipeline...' : 'Run Now'}</span>
          </button>

          <button
            onClick={logout}
            title={`Signed in as ${user?.email || 'Demo'}`}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
