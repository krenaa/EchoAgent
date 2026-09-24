import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { GoogleButton } from '../components/auth/GoogleButton';
import { GoogleAccountModal } from '../components/auth/GoogleAccountModal';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loginWithGoogle, completeGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (trimmedEmail !== 'researcher@echoagent.ai' && !gmailRegex.test(trimmedEmail)) {
      setError('Please use a valid Gmail address (@gmail.com). Only Gmail accounts are supported.');
      return;
    }

    setLoading(true);
    try {
      await login(trimmedEmail, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res?.isLocal) {
        setGoogleModalOpen(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate Google sign in.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleAccountSelected = async (selectedGmail) => {
    setLoading(true);
    try {
      await completeGoogleLogin(selectedGmail);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in with chosen Google account.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('researcher@echoagent.ai', 'demopassword123');
      navigate('/');
    } catch (err) {
      setError('Failed to enter demo mode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative z-10 border border-[#e8e8e3] shadow-lg">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-neutral-200/90 shadow-md mb-3 bg-white p-1 flex items-center justify-center">
            <img src="/logo.png" alt="EchoAgent Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight font-display">Welcome to EchoAgent</h1>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 font-mono">
            Autonomous AI Research Intelligence
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-5">
          <GoogleButton
            onClick={handleGoogleClick}
            disabled={loading}
            loading={googleLoading}
            text="Continue with Google"
          />
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-white px-3 text-neutral-400 font-medium">Or sign in with password</span>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-mono font-medium text-neutral-700 uppercase tracking-wider">
                Gmail Address
              </label>
              <span className="text-[10px] text-indigo-700 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                @gmail.com
              </span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-medium text-neutral-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full font-semibold text-sm transition-all shadow-sm shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with Password'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-white px-3 text-neutral-400 font-medium">Or instant access</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-full font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Continue with 1-Click Demo</span>
        </button>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
            Register your Gmail
          </Link>
        </p>
      </div>

      <GoogleAccountModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelected}
      />
    </div>
  );
};
