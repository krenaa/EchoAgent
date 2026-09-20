import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDigests, useTriggerDigest } from '../api/useDigests';
import { Header } from '../components/common/Header';
import { AnalyticsBar } from '../components/common/AnalyticsBar';
import { FilterBar } from '../components/digest/FilterBar';
import { DigestCard } from '../components/digest/DigestCard';
import { PreferencesModal } from '../components/settings/PreferencesModal';
import { RunNowModal } from '../components/common/RunNowModal';
import { Sparkles, Sliders, Inbox, Send } from 'lucide-react';

export const Dashboard = () => {
  const { preferences } = useAuth();
  const { data: items = [], isLoading } = useDigests();
  const triggerMutation = useTriggerDigest();

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isRunNowOpen, setIsRunNowOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTriggerRunNow = () => {
    setIsRunNowOpen(true);
    triggerMutation.mutate({
      topics: preferences?.topics || [],
      minScore: preferences?.min_score || 7
    });
  };

  const counts = useMemo(() => {
    return {
      all: items.length,
      arxiv: items.filter(i => i.source === 'arxiv').length,
      hackernews: items.filter(i => i.source === 'hackernews').length,
      rss: items.filter(i => i.source === 'rss').length
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (sourceFilter !== 'all' && item.source !== sourceFilter) {
        return false;
      }
      if (scoreFilter > 0 && (item.relevance_score || 0) < scoreFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const summaryMatch = item.ai_summary?.toLowerCase().includes(q);
        const whyMatch = item.why_it_matters?.toLowerCase().includes(q);
        const authorMatch = item.author_or_submitter?.toLowerCase().includes(q);
        if (!titleMatch && !summaryMatch && !whyMatch && !authorMatch) {
          return false;
        }
      }
      return true;
    });
  }, [items, sourceFilter, scoreFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col">
      <Header 
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onTriggerRunNow={handleTriggerRunNow}
        running={triggerMutation.isPending}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {(!preferences?.telegram_chat_id || preferences.telegram_chat_id.trim() === '') && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 flex-shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-200">Telegram Bot Delivery Not Linked</h4>
                <p className="text-xs text-amber-300/80">
                  Your daily schedule cannot dispatch digests to Telegram until your Chat ID is attached.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Connect Chat ID</span>
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-outfit">
              AI Intelligence Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Autonomous scanning across arXiv, Hacker News & AI blogs. Filtered by your active topic profile.
            </p>
          </div>

          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Topics & Schedule</span>
          </button>
        </div>

        <AnalyticsBar items={items} />

        <FilterBar 
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          scoreFilter={scoreFilter}
          setScoreFilter={setScoreFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          counts={counts}
        />

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-3" />
            <p className="text-sm">Loading research intelligence...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <DigestCard key={item.id || item.item_url} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center glass-card rounded-2xl p-8 border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No matching research items</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try relaxing your score filter or searching for a different keyword.
            </p>
            <button
              onClick={() => { setSourceFilter('all'); setScoreFilter(0); setSearchQuery(''); }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <PreferencesModal 
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      <RunNowModal 
        isOpen={isRunNowOpen}
        onClose={() => setIsRunNowOpen(false)}
      />
    </div>
  );
};
