import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Lightbulb, 
  ArrowUpRight,
  User
} from 'lucide-react';

export const DigestCard = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${item.title}\n\nSummary:\n${item.ai_summary}\n\nWhy it matters:\n${item.why_it_matters}\n\nSource: ${item.item_url}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Source styling
  const sourceConfig = {
    arxiv: {
      label: 'arXiv Paper',
      color: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    },
    hackernews: {
      label: 'Hacker News',
      color: 'bg-orange-500/15 text-orange-300 border-orange-500/30'
    },
    rss: {
      label: 'AI Blog',
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    }
  };

  const currentSource = sourceConfig[item.source] || {
    label: item.source,
    color: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
  };

  // Score styling
  const score = item.relevance_score || 7;
  const isTopTier = score >= 9;

  return (
    <article className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between group">
      <div>
        {/* Card Header: Source & Relevance Score Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentSource.color}`}>
              {currentSource.label}
            </span>
            {item.author_or_submitter && (
              <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[180px]">
                <User className="w-3 h-3 text-slate-500" />
                {item.author_or_submitter}
              </span>
            )}
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isTopTier 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{score}/10 Relevance</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug mb-3">
          <a 
            href={item.item_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline flex items-start justify-between gap-2"
          >
            <span>{item.title}</span>
            <ArrowUpRight className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </h3>

        {/* AI Summary */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {item.ai_summary || item.raw_content_snippet}
        </p>

        {/* "Why It Matters" Callout Box */}
        {item.why_it_matters && (
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Why this matters for your stack:</span>
            </div>
            <p className="text-xs text-purple-200/90 leading-relaxed italic">
              "{item.why_it_matters}"
            </p>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <Link 
          to={`/digest/${item.id}`}
          className="text-purple-400 hover:text-purple-300 font-medium hover:underline flex items-center gap-1"
        >
          <span>Deep-dive view</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy summary and link to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <a
            href={item.item_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Open original paper / article"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
