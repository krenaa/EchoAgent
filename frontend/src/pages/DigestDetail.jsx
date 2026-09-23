import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDigests } from '../api/useDigests';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Lightbulb, 
  Calendar, 
  User, 
  FileText,
  Share2,
  Bot
} from 'lucide-react';
import { AskAgentDrawer } from '../components/digest/AskAgentDrawer';
import { ExportModal } from '../components/digest/ExportModal';

export const DigestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: items = [] } = useDigests();
  const [copied, setCopied] = useState(false);
  const [isAskAgentOpen, setIsAskAgentOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const item = items.find(i => String(i.id) === String(id)) || items[0];

  if (!item) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex flex-col items-center justify-center text-neutral-500 p-4">
        <p className="text-base mb-4">Research item not found.</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm flex items-center gap-1.5 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Intelligence Feed
        </Link>
      </div>
    );
  }

  const handleCopy = () => {
    const textToCopy = `${item.title}\n\nSummary:\n${item.ai_summary}\n\nWhy it matters:\n${item.why_it_matters}\n\nLink: ${item.item_url}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const score = item.relevance_score || 8;

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-800 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300/80 hover:bg-neutral-100 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Feed</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAskAgentOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 shadow-2xs transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ask Agent</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium border border-neutral-300 shadow-2xs transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-neutral-600" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e3] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                {item.source}
              </span>
              <span className="text-xs text-neutral-500 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {item.digest_date || new Date().toISOString().split('T')[0]}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>{score}/10 Relevance Rating</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-all cursor-pointer"
                title="Copy Paper Takeaways"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-600" />}
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 leading-tight font-display mb-4">
            {item.title}
          </h1>

          {item.author_or_submitter && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 sm:mb-8 font-mono">
              <User className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              <span className="truncate">Authors / Source: <strong className="text-neutral-900 font-sans">{item.author_or_submitter}</strong></span>
            </div>
          )}

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Executive Synthesis</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed bg-neutral-50/80 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
              {item.ai_summary}
            </p>
          </div>

          {item.why_it_matters && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Strategic Impact for Your AI Stack</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium italic">
                "{item.why_it_matters}"
              </p>
            </div>
          )}

          {item.raw_content_snippet && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>Abstract / Raw Content Excerpt</span>
              </h2>
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {item.raw_content_snippet}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-400 font-mono text-center sm:text-left">
              Curated by EchoAgent Autonomous Pipeline
            </span>

            <a
              href={item.item_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <span>Visit Original Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <AskAgentDrawer
        isOpen={isAskAgentOpen}
        onClose={() => setIsAskAgentOpen(false)}
        paper={item}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        paper={item}
      />
    </div>
  );
};
