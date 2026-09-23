import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Plus, 
  Sliders, 
  CheckCircle, 
  Sparkles,
  Database,
  Rss,
  BookOpen,
  Trash2,
  ExternalLink,
  Layers
} from 'lucide-react';

export const PreferencesModal = ({ isOpen, onClose }) => {
  const { user, preferences, updatePreferences } = useAuth();

  const [activeTab, setActiveTab] = useState('topics');
  const [topics, setTopics] = useState([]);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [minScore, setMinScore] = useState(7);
  const [arxivCategories, setArxivCategories] = useState(['cs.AI', 'cs.CL', 'cs.LG']);
  const [rssFeeds, setRssFeeds] = useState([]);
  const [newRssInput, setNewRssInput] = useState('');
  const [rssError, setRssError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && preferences) {
      setTopics(preferences.topics || []);
      setMinScore(preferences.min_score || 7);
      setNewTopicInput('');
      setNewRssInput('');
      setRssError('');
      setSavedSuccess(false);

      if (preferences.custom_sources) {
        setArxivCategories(preferences.custom_sources.arxiv_categories || ['cs.AI', 'cs.CL', 'cs.LG']);
        setRssFeeds(preferences.custom_sources.rss_feeds || [
          'https://blog.langchain.dev/rss/',
          'https://huggingface.co/blog/feed.xml'
        ]);
      } else {
        setArxivCategories(['cs.AI', 'cs.CL', 'cs.LG']);
        setRssFeeds([
          'https://blog.langchain.dev/rss/',
          'https://huggingface.co/blog/feed.xml'
        ]);
      }
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  const handleAddTopic = () => {
    const trimmed = newTopicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
      setNewTopicInput('');
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setTopics(topics.filter(t => t !== topicToRemove));
  };

  const handleQuickAdd = (suggested) => {
    if (!topics.includes(suggested)) {
      setTopics([...topics, suggested]);
    }
  };

  const toggleArxivCategory = (catId) => {
    if (arxivCategories.includes(catId)) {
      if (arxivCategories.length > 1) {
        setArxivCategories(arxivCategories.filter(c => c !== catId));
      }
    } else {
      setArxivCategories([...arxivCategories, catId]);
    }
  };

  const handleAddRss = () => {
    const trimmed = newRssInput.trim();
    setRssError('');
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setRssError('Please enter a valid HTTP/HTTPS URL');
      return;
    }
    if (rssFeeds.includes(trimmed)) {
      setRssError('This RSS feed is already added');
      return;
    }
    setRssFeeds([...rssFeeds, trimmed]);
    setNewRssInput('');
  };

  const handleRemoveRss = (feedToRemove) => {
    setRssFeeds(rssFeeds.filter(f => f !== feedToRemove));
  };

  const handleQuickAddRss = (url) => {
    if (!rssFeeds.includes(url)) {
      setRssFeeds([...rssFeeds, url]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences({
      topics,
      min_score: parseInt(minScore, 10),
      custom_sources: {
        arxiv_categories: arxivCategories,
        rss_feeds: rssFeeds
      }
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const suggestedTopics = ['Local LLMs', 'Fine-Tuning', 'Multi-Agent', 'Vision AI', 'Prompt Engineering', 'LangChain'];

  const availableArxiv = [
    { id: 'cs.AI', label: 'cs.AI', desc: 'Artificial Intelligence' },
    { id: 'cs.CL', label: 'cs.CL', desc: 'Computation & Language (NLP)' },
    { id: 'cs.LG', label: 'cs.LG', desc: 'Machine Learning' },
    { id: 'cs.CV', label: 'cs.CV', desc: 'Computer Vision' },
    { id: 'cs.NE', label: 'cs.NE', desc: 'Neural & Evolutionary' },
    { id: 'stat.ML', label: 'stat.ML', desc: 'Statistical ML' }
  ];

  const suggestedFeeds = [
    { name: 'OpenAI News', url: 'https://openai.com/news/rss.xml' },
    { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' },
    { name: 'LangChain Blog', url: 'https://blog.langchain.dev/rss/' },
    { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-[#e8e8e3] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 flex-shrink-0">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight font-display">Research Criteria & Sources</h2>
              <p className="text-[11px] sm:text-xs text-neutral-500">Configure research topics, quality cutoff, and custom feeds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-2.5 bg-neutral-100/60 border-b border-neutral-200/60 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Focus Topics & Score</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200/80'
            }`}
          >
            <Rss className="w-3.5 h-3.5" />
            <span>Custom Sources & Feeds</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {rssFeeds.length}
            </span>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {activeTab === 'topics' ? (
            <>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-xs text-xs sm:text-sm font-mono flex-shrink-0">
                    {(user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{user?.email || 'Curator Researcher'}</h3>
                      <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5 truncate">
                      <Database className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                      Target: <span className="text-neutral-800 font-medium">Supabase Cloud + React Feed</span>
                    </p>
                  </div>
                </div>
                <div className="text-xs text-indigo-800 bg-indigo-50/60 px-3 py-1 rounded-full border border-indigo-200/70 shadow-2xs font-mono text-[11px] self-start sm:self-auto">
                  <span>Tracking: <strong className="text-indigo-950 font-bold">{topics.length} topics</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-800 uppercase tracking-wider mb-1.5 font-mono">
                  Active Topic Filters
                </label>
                <p className="text-[11px] sm:text-xs text-neutral-500 mb-3">
                  Autonomous AI agent matches arXiv submissions, Hacker News stories, and AI blogs against these topics.
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {topics.map((topic) => (
                    <span 
                      key={topic} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50/80 text-indigo-800 border border-indigo-200/80 shadow-2xs"
                    >
                      {topic}
                      <button 
                        onClick={() => handleRemoveTopic(topic)}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {topics.length === 0 && (
                    <span className="text-xs text-amber-600 italic">No topics added. Add at least one topic.</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newTopicInput}
                    onChange={(e) => setNewTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                    placeholder="Type custom topic (e.g. RAG, Vision-Language Models)"
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Suggestions:
                  </span>
                  {suggestedTopics.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleQuickAdd(s)}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-white hover:bg-indigo-50 text-neutral-600 hover:text-indigo-700 border border-neutral-200/80 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs"
                    >
                      +{s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider font-mono">
                    Minimum Quality Score Cutoff
                  </label>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono shadow-2xs">
                    {minScore} / 10
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-500 mb-3">
                  Incoming articles evaluated below this score by Groq will be filtered out automatically.
                </p>
                <input
                  type="range"
                  min="5"
                  max="9"
                  step="1"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] text-neutral-500 mt-1.5 font-mono">
                  <span>5 (Broad Discovery)</span>
                  <span className="text-indigo-600 font-bold">7 (Recommended Balance)</span>
                  <span>9 (Elite Nominees Only)</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-800 uppercase tracking-wider mb-1.5 font-mono">
                  arXiv Research Categories
                </label>
                <p className="text-[11px] sm:text-xs text-neutral-500 mb-3">
                  Select which arXiv sub-disciplines the autonomous agent monitors during the daily crawl.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {availableArxiv.map((cat) => {
                    const isChecked = arxivCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleArxivCategory(cat.id)}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs'
                            : 'bg-neutral-50/60 border-neutral-200 hover:bg-neutral-100/60'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center border ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-neutral-300 bg-white'
                        }`}>
                          {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-mono font-bold text-neutral-900">{cat.label}</span>
                          <p className="text-[11px] text-neutral-500 truncate">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-800 uppercase tracking-wider mb-1.5 font-mono">
                  Custom RSS Feeds & Publication Blogs
                </label>
                <p className="text-[11px] sm:text-xs text-neutral-500 mb-3">
                  Add custom RSS or Atom feed URLs to scan enterprise engineering blogs and AI labs.
                </p>

                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {rssFeeds.map((feed) => (
                    <div
                      key={feed}
                      className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span className="font-mono text-[11px] text-neutral-700 truncate">{feed}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRss(feed)}
                        className="p-1 rounded-md text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove feed"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {rssFeeds.length === 0 && (
                    <p className="text-xs text-amber-600 italic">No custom RSS feeds configured.</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={newRssInput}
                    onChange={(e) => setNewRssInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRss())}
                    placeholder="https://example.com/blog/rss.xml"
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddRss}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feed</span>
                  </button>
                </div>
                {rssError && <p className="text-xs text-red-600 mt-1 font-mono">{rssError}</p>}

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Labs:
                  </span>
                  {suggestedFeeds.map((sf) => (
                    <button
                      key={sf.name}
                      type="button"
                      onClick={() => handleQuickAddRss(sf.url)}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-white hover:bg-indigo-50 text-neutral-600 hover:text-indigo-700 border border-neutral-200/80 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs font-medium"
                    >
                      +{sf.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Preferences updated!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 sm:px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
