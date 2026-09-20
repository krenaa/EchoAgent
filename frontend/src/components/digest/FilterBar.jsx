import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

export const FilterBar = ({
  sourceFilter,
  setSourceFilter,
  scoreFilter,
  setScoreFilter,
  searchQuery,
  setSearchQuery,
  counts
}) => {
  const sources = [
    { id: 'all', label: 'All Sources', count: counts.all },
    { id: 'arxiv', label: 'arXiv Papers', count: counts.arxiv },
    { id: 'hackernews', label: 'Hacker News', count: counts.hackernews },
    { id: 'rss', label: 'AI Blogs & RSS', count: counts.rss }
  ];

  const scoreOptions = [
    { value: 0, label: 'All Scores' },
    { value: 7, label: '7+ Score' },
    { value: 8, label: '8+ High' },
    { value: 9, label: '9+ Elite' }
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
      {/* Source Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/10 rounded-2xl overflow-x-auto">
        {sources.map((source) => {
          const isActive = sourceFilter === source.id;
          return (
            <button
              key={source.id}
              onClick={() => setSourceFilter(source.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{source.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
              }`}>
                {source.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Score Filter Group */}
      <div className="flex items-center gap-3">
        {/* Score Threshold Filter */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl">
          {scoreOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setScoreFilter(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                scoreFilter === opt.value
                  ? 'bg-white/15 text-purple-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 md:flex-initial">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
