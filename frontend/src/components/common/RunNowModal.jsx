import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, X, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RunNowModal = ({ isOpen, onClose, onComplete }) => {
  const { preferences } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Connecting to Sources', desc: 'Fetching recent entries from arXiv, Hacker News & RSS' },
    { title: 'Deduplicating & Normalizing', desc: 'Filtering out previously scanned items' },
    { title: 'AI Relevance Scoring (Groq)', desc: 'Evaluating articles against your active topics' },
    { title: 'Synthesizing Executive Summaries', desc: 'Generating 2-sentence takeaways & Why It Matters' },
    { title: 'Storing Intelligence & Updating Feed', desc: 'Compiling findings directly to dashboard feed & Supabase' }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-[#e8e8e3] rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-display">Autonomous Pipeline In Motion</h3>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-mono">Executing EchoAgent live curation loop</p>
            </div>
          </div>
          {currentStep >= 5 && (
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
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
                    isDone ? 'bg-indigo-600' : 'bg-neutral-200'
                  }`} />
                )}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  {isDone ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-300 text-indigo-700 flex items-center justify-center shadow-2xs">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center text-xs font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`text-xs font-semibold ${
                    isCurrent ? 'text-indigo-700 font-bold' : isDone ? 'text-neutral-900' : 'text-neutral-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {currentStep >= 5 ? (
          <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 font-mono">
              <Layers className="w-4 h-4 text-emerald-600" /> Feed Intelligence Refreshed!
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-full transition-all shadow-sm shadow-indigo-500/25 cursor-pointer"
            >
              View Feed
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center text-xs text-neutral-500 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              Evaluating submissions with Groq... Please wait
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
