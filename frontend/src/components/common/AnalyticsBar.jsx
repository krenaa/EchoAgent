import React from 'react';
import { Layers, CheckCircle2, Award, Sparkles } from 'lucide-react';

export const AnalyticsBar = ({ items = [] }) => {
  const totalScanned = items.length;
  const qualifiedMatches = items.filter(i => (i.relevance_score || 0) >= 7).length;
  const topTier = items.filter(i => (i.relevance_score || 0) >= 9).length;

  const stats = [
    {
      label: 'Scanned Submissions',
      value: totalScanned,
      subtext: 'arXiv, Hacker News & RSS Radar',
      icon: Layers,
      color: 'text-neutral-900',
      bg: 'bg-neutral-100 border-neutral-200'
    },
    {
      label: 'Curated Matches',
      value: qualifiedMatches,
      subtext: 'Relevance rating ≥ 7/10',
      icon: CheckCircle2,
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200'
    },
    {
      label: 'Elite Breakthroughs',
      value: topTier,
      subtext: 'Top nominees score ≥ 9/10',
      icon: Award,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200'
    },
    {
      label: 'Autonomous Agent',
      value: 'Live',
      subtext: 'n8n + Groq + Supabase Pipeline',
      icon: Sparkles,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div 
            key={stat.label} 
            className="glass-card p-4 rounded-2xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">{stat.label}</span>
              <div className={`p-1.5 rounded-lg border ${stat.bg} ${stat.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900 font-display tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
