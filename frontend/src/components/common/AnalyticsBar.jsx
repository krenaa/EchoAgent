import React from 'react';
import { Layers, CheckCircle2, Award, Send, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AnalyticsBar = ({ items = [] }) => {
  const { preferences } = useAuth();
  const totalScanned = items.length;
  const qualifiedMatches = items.filter(i => (i.relevance_score || 0) >= 7).length;
  const topTier = items.filter(i => (i.relevance_score || 0) >= 9).length;
  const hasTelegram = Boolean(preferences?.telegram_chat_id && preferences.telegram_chat_id.trim());

  const stats = [
    {
      label: 'Total Items Scanned',
      value: totalScanned,
      subtext: 'Across arXiv, HN & RSS Feeds',
      icon: Layers,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'Qualified Matches',
      value: qualifiedMatches,
      subtext: 'Relevance score ≥ 7/10',
      icon: CheckCircle2,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Top-Tier Breakthroughs',
      value: topTier,
      subtext: 'Elite relevance ≥ 9/10',
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Telegram Delivery',
      value: hasTelegram ? 'Connected' : 'Not Linked',
      subtext: hasTelegram ? `Chat ID: ${preferences.telegram_chat_id}` : 'Action required for delivery',
      icon: hasTelegram ? Send : AlertTriangle,
      color: hasTelegram ? 'text-emerald-400' : 'text-amber-400',
      bg: hasTelegram ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div 
            key={stat.label} 
            className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-xl border ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-outfit tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
