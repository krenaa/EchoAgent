import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Play, 
  Sliders, 
  LogOut, 
  Calendar,
  Lock
} from 'lucide-react';

export const Header = ({ onOpenPreferences, onTriggerRunNow, running, demoScanLimitReached = false }) => {
  const { user, logout } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <header className="border-b border-[#e8e8e3] bg-[#fbfbfa]/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-500/25 flex-shrink-0">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight font-display">EchoAgent</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                RADAR
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 text-[11px] sm:text-xs text-neutral-500">
              <span className="flex items-center gap-1.5 text-neutral-700 font-medium whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Radar
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                <Calendar className="w-3 h-3" />
                {today}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={onOpenPreferences}
            title="Configure Topics & Relevance"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-700 transition-all cursor-pointer shadow-2xs hover:border-indigo-300"
          >
            <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-[9px] font-mono flex-shrink-0">
              {(user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <span className="hidden md:inline max-w-[120px] truncate text-neutral-700">{user?.email || 'Preferences'}</span>
            <Sliders className="w-3 h-3 text-neutral-400" />
          </button>

          {demoScanLimitReached ? (
            <button
              onClick={onTriggerRunNow}
              title="1-Click Demo limit reached (1 scan allowed). Sign in with Google for unlimited live scans."
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-xs font-semibold text-neutral-600 shadow-2xs transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3 text-neutral-400" />
              <span className="hidden sm:inline">1 Scan Used (Demo)</span>
              <span className="sm:hidden">Limit</span>
            </button>
          ) : (
            <button
              onClick={onTriggerRunNow}
              disabled={running}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-xs font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-white" />
              <span className="hidden sm:inline">{running ? 'Scanning...' : 'Scan Now'}</span>
              <span className="sm:hidden">{running ? '...' : 'Scan'}</span>
            </button>
          )}

          <button
            onClick={logout}
            title={`Signed in as ${user?.email || 'Demo'}`}
            className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-red-50 border border-neutral-300 text-neutral-500 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
