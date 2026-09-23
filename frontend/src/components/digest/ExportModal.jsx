import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  FileText, 
  Briefcase
} from 'lucide-react';

export const ExportModal = ({ isOpen, onClose, paper }) => {
  const [activeTab, setActiveTab] = useState('obsidian');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !paper) return null;

  const getObsidianMarkdown = () => {
    const tags = ['ai-research', paper.source, 'breakthrough'];
    return `---
title: "${paper.title.replace(/"/g, '\\"')}"
date: ${paper.digest_date || new Date().toISOString().split('T')[0]}
source: ${paper.source}
relevance_score: ${paper.relevance_score || 8}
url: ${paper.item_url}
tags: [${tags.join(', ')}]
---

# ${paper.title}

> **Source**: [${paper.source.toUpperCase()}](${paper.item_url}) | **Curated Rating**: ${paper.relevance_score || 8}/10
> **Authors / Submitters**: ${paper.author_or_submitter || 'Community Curated'}

## Executive Summary
${paper.ai_summary || ''}

## Strategic Impact (Why It Matters)
${paper.why_it_matters || ''}

${paper.raw_content_snippet ? `## Abstract / Technical Notes\n${paper.raw_content_snippet}\n` : ''}
---
*Exported from EchoAgent Autonomous Research Intelligence*
`;
  };

  const getSocialPost = () => {
    return `🚨 AI Breakthrough Alert: ${paper.title}

Key takeaways you need to know:
🔹 The Innovation: ${paper.ai_summary}
🔹 Why It Matters: ${paper.why_it_matters}
🔹 Relevance Rating: ${paper.relevance_score || 8}/10

Read the full publication here: ${paper.item_url}

#AI #MachineLearning #LLMs #ArtificialIntelligence #TechInnovation #EchoAgent`;
  };

  const getExecutiveBrief = () => {
    return `EXECUTIVE RESEARCH BRIEF: ${paper.title.toUpperCase()}
--------------------------------------------------
• Date: ${paper.digest_date || new Date().toISOString().split('T')[0]}
• Source: ${paper.source.toUpperCase()} (${paper.item_url})
• Evaluation Score: ${paper.relevance_score || 8}/10
• Executive Summary: ${paper.ai_summary}
• Strategic Implications: ${paper.why_it_matters}
• Recommended Action: Review for immediate architecture integration.
`;
  };

  const getActiveContent = () => {
    if (activeTab === 'obsidian') return getObsidianMarkdown();
    if (activeTab === 'social') return getSocialPost();
    if (activeTab === 'executive') return getExecutiveBrief();
    return getObsidianMarkdown();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const content = getActiveContent();
    const sanitizedTitle = paper.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    const filename = `${sanitizedTitle}-${activeTab}.md`;
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'obsidian', label: 'Obsidian / Notion', icon: FileText },
    { id: 'social', label: 'LinkedIn & X Post', icon: Share2 },
    { id: 'executive', label: 'Executive Brief', icon: Briefcase }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-[#e8e8e3] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 flex-shrink-0">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">Export Research Breakthrough</h2>
              <p className="text-[11px] sm:text-xs text-neutral-500 truncate max-w-[280px] sm:max-w-[360px]" title={paper.title}>
                {paper.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 sm:p-4 bg-neutral-100/60 border-b border-neutral-200/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="relative">
            <textarea
              readOnly
              value={getActiveContent()}
              rows={12}
              className="w-full font-mono text-xs text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/70">
          <span className="text-[11px] text-neutral-400 font-mono">
            Format: <strong className="text-neutral-700 uppercase">{activeTab}</strong>
          </span>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full border border-neutral-300 shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span>Download .md</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
