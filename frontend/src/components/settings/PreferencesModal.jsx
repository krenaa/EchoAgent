import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  Power, 
  Send, 
  Sliders, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const PreferencesModal = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = useAuth();

  const [topics, setTopics] = useState([]);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:23');
  const [isActive, setIsActive] = useState(true);
  const [minScore, setMinScore] = useState(7);
  const [customInstructions, setCustomInstructions] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && preferences) {
      setTopics(preferences.topics || []);
      setScheduledTime(preferences.scheduled_time?.slice(0, 5) || '10:23');
      setIsActive(preferences.is_active ?? true);
      setMinScore(preferences.min_score || 7);
      setCustomInstructions(preferences.custom_instructions || '');
      setTelegramChatId(preferences.telegram_chat_id || '');
      setNewTopicInput('');
      setSavedSuccess(false);
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

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences({
      topics,
      scheduled_time: scheduledTime.length === 5 ? `${scheduledTime}:00` : scheduledTime,
      is_active: isActive,
      min_score: parseInt(minScore, 10),
      custom_instructions: customInstructions,
      telegram_chat_id: telegramChatId
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const suggestedTopics = ['Local LLMs', 'Fine-Tuning', 'Multi-Agent', 'Vision AI', 'Prompt Engineering', 'LangChain'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#111422] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Agent Preferences & Schedule</h2>
              <p className="text-xs text-slate-400">Configure topics, delivery time, and telegram destination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse' : 'bg-amber-500'}`} />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Daily Workflow Status: {isActive ? 'Active (Running Daily)' : 'Paused'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isActive 
                    ? 'EchoAgent will automatically scan and send your digest every day.' 
                    : 'Workflow is paused. No messages will be sent until resumed.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isActive ? 'Pause Digests' : 'Resume Digests'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Interested Research Topics
            </label>
            <p className="text-xs text-slate-400 mb-3">
              The AI scores incoming arXiv papers and posts strictly against these topics.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {topics.map((topic) => (
                <span 
                  key={topic} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-200 border border-purple-500/30"
                >
                  {topic}
                  <button 
                    onClick={() => handleRemoveTopic(topic)}
                    className="hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {topics.length === 0 && (
                <span className="text-xs text-amber-400 italic">No topics added. Add at least one topic.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTopicInput}
                onChange={(e) => setNewTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                placeholder="Type custom topic (e.g. RAG, Vision-Language Models)"
                className="flex-1 bg-[#161a2a] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> Suggestions:
              </span>
              {suggestedTopics.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleQuickAdd(s)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-purple-300 border border-white/5 transition-all cursor-pointer"
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Daily Delivery Time</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-[#161a2a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Workflow will run every day at this hour.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Minimum Relevance Score ({minScore}/10)
              </label>
              <input
                type="range"
                min="5"
                max="9"
                step="1"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-full accent-purple-500 mt-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>5 (Broad)</span>
                <span className="text-purple-400 font-semibold">{minScore} (Recommended: 7)</span>
                <span>9 (Elite Only)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-purple-400" />
                <span>Telegram Delivery Chat ID</span>
              </label>
              {telegramChatId && telegramChatId.trim() ? (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Connected
                </span>
              ) : (
                <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Not Linked
                </span>
              )}
            </div>
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="e.g. 5479104426"
              className="w-full bg-[#161a2a] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <div className="mt-2 text-[11px] text-slate-400 space-y-1">
              <p>• Find your Chat ID by messaging <b>@userinfobot</b> on Telegram.</p>
              <p>• Make sure you have messaged your bot so it has permission to send you digests.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Custom AI Persona & Filtering Prompt
            </label>
            <textarea
              rows="2"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Focus on production architectures, low-latency evaluation, and real-world benchmarks."
              className="w-full bg-[#161a2a] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Preferences saved!
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
