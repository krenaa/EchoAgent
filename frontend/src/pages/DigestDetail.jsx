import React from 'react';
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
  Share2,
  FileText
} from 'lucide-react';

export const DigestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: items = [] } = useDigests();
  const [copied, setCopied] = React.useState(false);

  const item = items.find(i => String(i.id) === String(id)) || items[0];

  if (!item) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-slate-400">
        <p className="text-base mb-4">Research item not found.</p>
        <Link to="/" className="text-purple-400 hover:underline text-sm flex items-center gap-1.5">
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
    <div className="min-h-screen bg-[#090a0f] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        {/* Paper Container */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                {item.source}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {item.digest_date || new Date().toISOString().split('T')[0]}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{score}/10 Relevance</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Copy Paper Takeaways"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight font-outfit mb-4">
            {item.title}
          </h1>

          {/* Authors */}
          {item.author_or_submitter && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
              <User className="w-4 h-4 text-purple-400" />
              <span>Authors / Source: <strong className="text-slate-200">{item.author_or_submitter}</strong></span>
            </div>
          )}

          {/* AI Executive Summary Box */}
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Executive Synthesis</span>
            </h2>
            <p className="text-base text-slate-200 leading-relaxed bg-white/[0.02] p-5 rounded-2xl border border-white/5">
              {item.ai_summary}
            </p>
          </div>

          {/* Why It Matters Callout */}
          {item.why_it_matters && (
            <div className="p-5 rounded-2xl bg-purple-950/25 border border-purple-500/30 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Strategic Impact for Your AI Stack</span>
              </div>
              <p className="text-sm text-purple-100 leading-relaxed font-medium italic">
                "{item.why_it_matters}"
              </p>
            </div>
          )}

          {/* Raw Snippet / Abstract */}
          {item.raw_content_snippet && (
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Abstract / Raw Content Excerpt</span>
              </h2>
              <div className="p-5 rounded-2xl bg-[#0e1019] border border-white/5 text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
                {item.raw_content_snippet}
              </div>
            </div>
          )}

          {/* External Action Button */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Discovered and analyzed by EchoAgent Autonomous Pipeline
            </span>

            <a
              href={item.item_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
            >
              <span>Read Original Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
