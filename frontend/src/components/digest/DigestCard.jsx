import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  Lightbulb, 
  ArrowUpRight,
  Bookmark
} from 'lucide-react';

export const DigestCard = ({ item }) => {
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
    <article className="bg-white rounded-2xl p-6 border border-[#e8e8e3] hover:border-indigo-300/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
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
              title="Bookmark"
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
          >
            <span>{item.title}</span>
            <ArrowUpRight className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-1" />
          </a>
        </h3>

        <p className="text-sm text-neutral-600 leading-relaxed mb-4">
          {item.ai_summary || item.raw_content_snippet}
        </p>

        {item.why_it_matters && (
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/70 mb-4">
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

      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-2 max-w-[200px] truncate">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
            {(item.author_or_submitter?.[0] || 'C').toUpperCase()}
          </div>
          <span className="truncate text-xs font-medium text-neutral-800">
            {item.author_or_submitter || 'Curated Feed'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to={`/digest/${item.id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline text-xs"
          >
            Deep dive
          </Link>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer border border-neutral-200"
            title="Copy summary and link to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <a
            href={item.item_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer border border-neutral-200"
            title="Open original paper / article"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
