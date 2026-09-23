import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Lightbulb, 
  ArrowUpRight, 
  Bookmark,
  Share2,
  Bot,
  FileText
} from 'lucide-react';

export const DigestCard = ({ item, onAskAgent, onExport }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${item.title}\n\nSummary:\n${item.ai_summary}\n\nWhy it matters:\n${item.why_it_matters}\n\nSource: ${item.item_url}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sources = {
    arxiv: {
      label: 'arXiv Paper',
      dot: 'bg-blue-600',
      badge: 'text-blue-700 bg-blue-50/80 border-blue-200'
    },
    hackernews: {
      label: 'Hacker News',
      dot: 'bg-amber-500',
      badge: 'text-amber-800 bg-amber-50/80 border-amber-200'
    },
    rss: {
      label: 'AI Blog',
      dot: 'bg-emerald-600',
      badge: 'text-emerald-800 bg-emerald-50/80 border-emerald-200'
    }
  };

  const currentSource = sources[item.source] || {
    label: item.source || 'Curated',
    dot: 'bg-indigo-600',
    badge: 'text-indigo-700 bg-indigo-50/80 border-indigo-200'
  };

  const score = item.relevance_score || 7;
  const isTopTier = score >= 9;

  return (
    <article className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e8e3] hover:border-indigo-300/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentSource.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentSource.dot}`} />
              {currentSource.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isTopTier ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
                {score}/10 Elite
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                {score}/10 Relevance
              </span>
            )}

            <button
              onClick={() => setSaved(!saved)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer border ${
                saved 
                  ? 'bg-amber-500 text-white border-amber-500 shadow-2xs' 
                  : 'bg-white hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 border-neutral-200'
              }`}
              title="Bookmark paper"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors leading-snug mb-3 font-display">
          <a 
            href={item.item_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline flex items-start justify-between gap-2"
            title="Click to open and read original publication"
          >
            <span>{item.title}</span>
            <ArrowUpRight className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-1" />
          </a>
        </h3>

        <p className="text-sm text-neutral-600 leading-relaxed mb-4">
          {item.ai_summary || item.raw_content_snippet}
        </p>

        {item.why_it_matters && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/40 border border-amber-200/70 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-950 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Curator's Note:</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed italic">
              "{item.why_it_matters}"
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-neutral-100 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0 max-w-[260px] truncate">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
              {(item.author_or_submitter?.[0] || 'C').toUpperCase()}
            </div>
            <span className="truncate text-xs font-medium text-neutral-800" title={item.author_or_submitter}>
              {item.author_or_submitter || 'Curated Feed'}
            </span>
          </div>

          <a
            href={item.item_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer group/link flex-shrink-0"
            title="Open original news article / paper in a new tab"
          >
            <span>Read Article</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-50 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onAskAgent && onAskAgent(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/80 shadow-2xs transition-all cursor-pointer"
              title="Ask AI questions about this paper"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ask Agent</span>
            </button>

            <button
              onClick={() => onExport && onExport(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200 shadow-2xs transition-all cursor-pointer"
              title="Export to Obsidian, Notion, or Social Post"
            >
              <Share2 className="w-3 h-3 text-neutral-500" />
              <span>Export</span>
            </button>

            <Link 
              to={`/digest/${item.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-indigo-600 text-xs font-medium border border-neutral-200 shadow-2xs transition-all"
              title="View full deep dive page"
            >
              <FileText className="w-3 h-3 text-neutral-400" />
              <span>Deep Dive</span>
            </Link>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 text-xs font-medium border border-neutral-200 shadow-2xs transition-all cursor-pointer"
            title="Copy summary and link to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
