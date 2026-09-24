import React from 'react';
import { Search, X } from 'lucide-react';

export const FilterBar = ({
  sourceFilter = 'all',
  setSourceFilter,
  onSourceFilterChange,
  scoreFilter = 0,
  setScoreFilter,
  onScoreFilterChange,
  searchQuery = '',
  setSearchQuery,
  onSearchChange,
  counts = {},
  topics = [],
  selectedTopic = 'All',
  onSelectTopic,
  setSelectedTopic
}) => {
  const updateSource = onSourceFilterChange || setSourceFilter || (() => {});
  const updateScore = onScoreFilterChange || setScoreFilter || (() => {});
  const updateSearch = onSearchChange || setSearchQuery || (() => {});
  const updateTopic = onSelectTopic || setSelectedTopic || (() => {});

  const sources = [
    { id: 'all', label: 'All Intelligence', count: counts?.all ?? 0 },
    { id: 'arxiv', label: 'arXiv Papers', count: counts?.arxiv ?? 0 },
    { id: 'hackernews', label: 'Hacker News', count: counts?.hackernews ?? 0 },
    { id: 'rss', label: 'AI Blogs & RSS', count: counts?.rss ?? 0 }
  ];

  const scoreOptions = [
    { value: 0, label: 'All Scores' },
    { value: 7, label: '7+ Score' },
    { value: 8, label: '8+ High' },
    { value: 9, label: '9+ Elite' }
  ];

  return (
    <div className="flex flex-col gap-3 mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-200/50 border border-neutral-300/80 rounded-full overflow-x-auto scrollbar-none max-w-full">
          {sources.map((source) => {
            const isActive = sourceFilter === source.id;
            return (
              <button
                key={source.id}
                onClick={() => updateSource(source.id)}
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
                onClick={() => updateScore(opt.value)}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer text-center ${
                  Number(scoreFilter) === opt.value
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
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search papers & articles..."
              className="w-full bg-white border border-neutral-300 rounded-full pl-9 pr-8 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => updateSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {topics && topics.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5 pb-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex-shrink-0 mr-1">
            Topics:
          </span>
          {topics.map((topic) => {
            const isTopicActive = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => updateTopic(topic)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  isTopicActive
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 shadow-2xs'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
