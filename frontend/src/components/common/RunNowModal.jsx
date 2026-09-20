import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Send, X, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RunNowModal = ({ isOpen, onClose, onComplete }) => {
  const { preferences } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const hasTelegram = Boolean(preferences?.telegram_chat_id && preferences.telegram_chat_id.trim());

  const steps = [
    { title: 'Connecting to Sources', desc: 'Fetching recent entries from arXiv, Hacker News & RSS' },
    { title: 'Deduplicating & Normalizing', desc: 'Filtering out previously scanned items' },
    { title: 'AI Relevance Scoring (Groq)', desc: 'Evaluating articles against your active topics' },
    { title: 'Synthesizing Executive Summaries', desc: 'Generating 2-sentence takeaways & Why It Matters' },
    hasTelegram 
      ? { title: 'Dispatching to Telegram', desc: `Delivering to Chat ID ${preferences.telegram_chat_id}` }
      : { title: 'Updating Research Intelligence', desc: 'Compiling findings directly to dashboard feed' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const timer1 = setTimeout(() => setCurrentStep(1), 1200);
    const timer2 = setTimeout(() => setCurrentStep(2), 2600);
    const timer3 = setTimeout(() => setCurrentStep(3), 4200);
    const timer4 = setTimeout(() => setCurrentStep(4), 5800);
    const timer5 = setTimeout(() => {
      setCurrentStep(5);
      if (onComplete) onComplete();
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111422] border border-purple-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Autonomous Agent In Motion</h3>
              <p className="text-xs text-slate-400">Executing EchoAgent intelligence pipeline</p>
            </div>
          </div>
          {currentStep >= 5 && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-4 my-2">
          {steps.map((step, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div key={step.title} className="flex items-start gap-3 relative">
                {idx < steps.length - 1 && (
                  <div className={`absolute left-3.5 top-8 w-0.5 h-6 -translate-x-1/2 transition-colors duration-500 ${
                    isDone ? 'bg-purple-500' : 'bg-white/10'
                  }`} />
                )}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  {isDone ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500 text-purple-400 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-slate-500 flex items-center justify-center text-xs font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className={`text-xs font-semibold ${
                    isCurrent ? 'text-purple-300' : isDone ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {currentStep >= 5 ? (
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              {hasTelegram ? (
                <>
                  <Send className="w-4 h-4" /> Delivered to Telegram!
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" /> Feed Intelligence Refreshed!
                </>
              )}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
            >
              View Feed
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center text-xs text-slate-400">
            <span>Processing live batch with Groq... Please wait</span>
          </div>
        )}
      </div>
    </div>
  );
};
