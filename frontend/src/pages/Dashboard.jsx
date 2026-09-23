import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDigests, useTriggerDigest } from '../api/useDigests';
import { Header } from '../components/common/Header';
import { FilterBar } from '../components/digest/FilterBar';
import { DigestCard } from '../components/digest/DigestCard';
import { PreferencesModal } from '../components/settings/PreferencesModal';
import { RunNowModal } from '../components/common/RunNowModal';
import { AskAgentDrawer } from '../components/digest/AskAgentDrawer';
import { ExportModal } from '../components/digest/ExportModal';
import { Inbox, LayoutGrid, Rows } from 'lucide-react';

const normalizeSource = (src) => {
  if (!src) return '';
  const s = String(src).toLowerCase().trim();
  if (s.includes('arxiv')) return 'arxiv';
  if (s.includes('hacker') || s.includes('hn')) return 'hackernews';
  if (s.includes('rss') || s.includes('blog') || s.includes('hugging')) return 'rss';
  return s;
};

export const Dashboard = () => {
  const { preferences } = useAuth();
  const { data: items = [], isLoading } = useDigests(preferences?.topics || []);
  const triggerMutation = useTriggerDigest();

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isRunNowOpen, setIsRunNowOpen] = useState(false);
  const [activeAskPaper, setActiveAskPaper] = useState(null);
  const [isAskAgentOpen, setIsAskAgentOpen] = useState(false);
  const [activeExportPaper, setActiveExportPaper] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [sourceFilter, setSourceFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [gridColumns, setGridColumns] = useState('two');

  const displayTopics = useMemo(() => {
    const userTopics = preferences?.topics && Array.isArray(preferences.topics) && preferences.topics.length > 0
      ? preferences.topics
      : ['Local LLMs', 'Agentic AI', 'RAG', 'n8n', 'LangGraph', 'Production LLMs'];
    return ['All', ...userTopics];
  }, [preferences?.topics]);

  useEffect(() => {
    if (selectedTopic !== 'All' && !displayTopics.includes(selectedTopic)) {
      setSelectedTopic('All');
    }
  }, [displayTopics, selectedTopic]);

  const handleTriggerRunNow = () => {
    setIsRunNowOpen(true);
    triggerMutation.mutate({
      topics: preferences?.topics || [],
      minScore: preferences?.min_score || 7
    });
  };

  const handleOpenAskAgent = (paper) => {
    setActiveAskPaper(paper);
    setIsAskAgentOpen(true);
  };

  const handleOpenExport = (paper) => {
    setActiveExportPaper(paper);
    setIsExportOpen(true);
  };

  const counts = useMemo(() => {
    return {
      all: items.length,
      arxiv: items.filter(i => normalizeSource(i.source) === 'arxiv').length,
      hackernews: items.filter(i => normalizeSource(i.source) === 'hackernews').length,
      rss: items.filter(i => normalizeSource(i.source) === 'rss').length
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (sourceFilter !== 'all' && normalizeSource(item.source) !== sourceFilter) {
        return false;
      }
      if (scoreFilter > 0 && (item.relevance_score || 0) < scoreFilter) {
        return false;
      }
      if (selectedTopic !== 'All') {
        const fullContent = [
          item.title,
          item.ai_summary,
          item.why_it_matters,
          item.raw_content_snippet,
          item.source,
          item.author_or_submitter
        ].filter(Boolean).join(' ').toLowerCase();

        const cleanTopic = selectedTopic.toLowerCase().trim();
        let matches = fullContent.includes(cleanTopic);

        if (!matches) {
          const keywords = cleanTopic
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !['systems', 'models', 'engineering', 'pipeline', 'production'].includes(w));

          if (keywords.length > 0) {
            matches = keywords.some(kw => fullContent.includes(kw));
          }
        }

        if (!matches) return false;
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
  }, [items, sourceFilter, scoreFilter, searchQuery, selectedTopic]);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 flex flex-col">
      <Header 
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onTriggerRunNow={handleTriggerRunNow}
        running={triggerMutation.isPending}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e8e8e3]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
                CURATED RADAR
              </span>
              <span className="text-xs font-mono text-neutral-400">
                [{items.length} Nominees]
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
              Research Nominees & Breakthroughs
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-2xl">
              Autonomous AI engine scanning arXiv, Hacker News & engineering blogs. Filtered strictly against your active profile.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center p-1 bg-neutral-200/60 border border-neutral-300/80 rounded-full">
              <button
                onClick={() => setGridColumns('two')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  gridColumns === 'two' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridColumns('one')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  gridColumns === 'one' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
                title="Single Column View"
              >
                <Rows className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex-shrink-0 mr-1">
            Focus:
          </span>
          {displayTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                selectedTopic === topic
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                  : 'bg-white hover:bg-neutral-100 text-neutral-600 border-neutral-200 shadow-2xs'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

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
          <div className="py-24 flex flex-col items-center justify-center text-neutral-400">
            <div className="w-9 h-9 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Curating Live Radar...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className={gridColumns === 'two' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'max-w-3xl mx-auto space-y-6'}>
            {filteredItems.map((item) => (
              <DigestCard 
                key={item.id || item.item_url} 
                item={item} 
                onAskAgent={handleOpenAskAgent}
                onExport={handleOpenExport}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl p-8 border border-[#e8e8e3] shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1 font-display">No nominees match this filter</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              Try switching topics or resetting your score threshold to discover more papers.
            </p>
            <button
              onClick={() => { setSourceFilter('all'); setScoreFilter(0); setSearchQuery(''); setSelectedTopic('All'); }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-all cursor-pointer shadow-xs"
            >
              Reset All Filters
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

      <AskAgentDrawer
        isOpen={isAskAgentOpen}
        onClose={() => setIsAskAgentOpen(false)}
        paper={activeAskPaper}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        paper={activeExportPaper}
      />
    </div>
  );
};
