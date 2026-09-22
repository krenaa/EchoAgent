import React from 'react';
import { Search } from 'lucide-react';

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
    { id: 'all', label: 'All Intelligence', count: counts.all },
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
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-1.5 p-1 bg-neutral-200/50 border border-neutral-300/80 rounded-full overflow-x-auto scrollbar-none max-w-full">
        {sources.map((source) => {
          const isActive = sourceFilter === source.id;
          return (
            <button
              key={source.id}
              onClick={() => setSourceFilter(source.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
              }`}
            >
              <span>{source.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-indigo-700 text-white' : 'bg-neutral-300/70 text-neutral-600'
              }`}>
                {source.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-1 p-1 bg-neutral-200/50 border border-neutral-300/80 rounded-full overflow-x-auto scrollbar-none">
          {scoreOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setScoreFilter(opt.value)}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer text-center ${
                scoreFilter === opt.value
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs border border-indigo-200'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-full sm:min-w-[210px] flex-1">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers & articles..."
            className="w-full bg-white border border-neutral-300 rounded-full pl-9 pr-4 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
