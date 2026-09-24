import React, { useState } from 'react';
import { X, Mail, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export const GoogleAccountModal = ({ isOpen, onClose, onSelectAccount }) => {
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const accountsRaw = localStorage.getItem('echoagent_registered_accounts');
  const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
  const registeredGmailList = Object.keys(accounts).filter(
    (e) => e.endsWith('@gmail.com') || e === 'researcher@echoagent.ai'
  );

  const handleSelect = (email) => {
    onSelectAccount(email);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setError('');
    const trimmed = customEmail.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(trimmed)) {
      setError('Please enter a valid Google account ending with @gmail.com');
      return;
    }
    onSelectAccount(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-11 h-11 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-2.5 shadow-2xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">Choose a Google Account</h2>
          <p className="text-xs text-neutral-500 mt-0.5">to continue to <span className="font-semibold text-neutral-700">EchoAgent</span></p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            {error}
          </div>
        )}

        <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
          {registeredGmailList.map((accountEmail) => (
            <button
              key={accountEmail}
              onClick={() => handleSelect(accountEmail)}
              className="w-full p-3 rounded-2xl border border-neutral-200 hover:border-indigo-500 hover:bg-indigo-50/20 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-bold text-xs flex items-center justify-center uppercase shrink-0">
                  {accountEmail[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-800 truncate">{accountEmail}</div>
                  <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    Verified Google Account
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>

        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Use another Google account</span>
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-2.5 pt-1">
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                autoFocus
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-indigo-600 font-mono"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="w-1/3 py-2 text-xs text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/25"
              >
                <span>Continue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-neutral-100 text-center">
          <p className="text-[10px] text-neutral-400 font-mono">
            To continue, Google will share your name and email address with EchoAgent.
          </p>
        </div>
      </div>
    </div>
  );
};
