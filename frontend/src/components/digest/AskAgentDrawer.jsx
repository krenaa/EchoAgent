import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  RotateCcw,
  ExternalLink,
  Code,
  Layers,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { askPaperAgent } from '../../api/groqClient';

export const AskAgentDrawer = ({ isOpen, onClose, paper }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickPrompts = [
    { label: 'Core Architecture', icon: Layers, query: 'Explain the core architecture and methodology in simple, direct terms.' },
    { label: 'Comparison', icon: HelpCircle, query: 'How does this compare to existing solutions like LangGraph, standard RAG, or AutoGen?' },
    { label: 'Python Code', icon: Code, query: 'Provide clean Python pseudocode implementing this paper’s core concept.' },
    { label: 'Limitations', icon: ShieldAlert, query: 'What are the main limitations, failure modes, and compute tradeoffs?' }
  ];

  useEffect(() => {
    if (isOpen && paper) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I have analyzed **"${paper.title}"** from **${paper.source.toUpperCase()}**.\n\nAsk me anything about its architecture, implementation details, benchmarks, or how to integrate it into your AI stack.`
        }
      ]);
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, paper]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen || !paper) return null;

  const handleSend = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const newMessages = [...messages, { role: 'user', content: queryText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askPaperAgent({
        paper,
        messages: newMessages
      });
      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: `Unable to query agent: ${err.message}. Please verify your Groq API key or try again.` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. What would you like to explore regarding **"${paper.title}"**?`
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-[#e8e8e3] animate-in slide-in-from-right duration-300">
        
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  {paper.source}
                </span>
                <span className="text-xs font-bold text-neutral-900 font-display">
                  Ask Research Agent
                </span>
              </div>
              <h3 className="text-xs text-neutral-600 truncate mt-0.5 max-w-[280px] sm:max-w-[340px]" title={paper.title}>
                {paper.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Reset conversation"
              className="p-2 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 py-2 bg-indigo-50/40 border-b border-indigo-100/60 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Grounded in: <strong>Score {paper.relevance_score || 8}/10</strong>
          </span>
          <a
            href={paper.item_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>Original Paper</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {quickPrompts.map((qp) => {
              const Icon = qp.icon;
              return (
                <button
                  key={qp.label}
                  disabled={loading}
                  onClick={() => handleSend(qp.query)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white hover:bg-indigo-50 text-neutral-700 hover:text-indigo-700 border border-neutral-200 hover:border-indigo-300 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-indigo-600" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>

          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xs'
                      : 'bg-neutral-50 border border-neutral-200/80 text-neutral-800'
                  }`}
                >
                  <div className="prose prose-xs max-w-none whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs font-mono text-[10px]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-neutral-500">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Agent analyzing paper with Groq...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 sm:p-4 border-t border-neutral-100 bg-neutral-50/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a technical question about this paper..."
              className="flex-1 bg-white border border-neutral-300 rounded-full px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-2xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white flex items-center justify-center shadow-sm shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-40 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
