import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../api/supabase';
import { initialMockPreferences } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('echoagent_user_preferences');
    return saved ? JSON.parse(saved) : initialMockPreferences;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (preferences) {
      localStorage.setItem('echoagent_user_preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const savedUser = localStorage.getItem('echoagent_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.email) {
          const userSpecific = localStorage.getItem('echoagent_user_prefs_' + parsedUser.email.toLowerCase().trim());
          if (userSpecific) {
            try {
              setPreferences(JSON.parse(userSpecific));
            } catch (e) {}
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchUserPreferences(session.user);
        }
      } catch (err) {
        console.error('Session error:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserPreferences(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserPreferences = async (userObj) => {
    if (!isSupabaseConfigured || !supabase || !userObj) return;
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userObj.id)
        .maybeSingle();

      if (data && !error) {
        setPreferences(data);
      } else {
        const defaultPrefs = {
          user_id: userObj.id,
          email: userObj.email,
          delivery_email: userObj.email,
          topics: ['Agentic AI', 'RAG', 'n8n', 'LangGraph', 'Production LLMs'],
          scheduled_time: '07:00:00',
          min_score: 7,
          is_active: true,
          email_briefing_enabled: true
        };
        const { data: newRow } = await supabase
          .from('user_preferences')
          .upsert(defaultPrefs)
          .select()
          .maybeSingle();

        setPreferences(newRow || defaultPrefs);
      }
    } catch (err) {
      console.error('Failed to load or provision user preferences:', err);
    }
  };

  const login = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === 'researcher@echoagent.ai') {
      const activeUser = {
        id: 'demo-user-123',
        email: 'researcher@echoagent.ai',
        is_demo: true,
        session_id: 'demo_' + Date.now()
      };
      setUser(activeUser);
      localStorage.setItem('echoagent_user', JSON.stringify(activeUser));
      localStorage.removeItem('echoagent_demo_scan_used');

      const defaultPrefs = {
        ...initialMockPreferences,
        email: 'researcher@echoagent.ai',
        is_demo: true
      };
      setPreferences(defaultPrefs);
      localStorage.setItem('echoagent_user_preferences', JSON.stringify(defaultPrefs));
      return { user: activeUser };
    }

    if (!isSupabaseConfigured || !supabase) {
      const accountsRaw = localStorage.getItem('echoagent_registered_accounts');
      const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};

      const account = accounts[normalizedEmail];
      if (!account) {
        throw new Error('No account found with this email. Please create an account first.');
      }

      if (account.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }

      const activeUser = { id: account.id, email: normalizedEmail, is_demo: false };
      setUser(activeUser);
      localStorage.setItem('echoagent_user', JSON.stringify(activeUser));

      const savedUserPrefs = localStorage.getItem('echoagent_user_prefs_' + normalizedEmail);
      if (savedUserPrefs) {
        try {
          const parsed = JSON.parse(savedUserPrefs);
          setPreferences(parsed);
          localStorage.setItem('echoagent_user_preferences', JSON.stringify(parsed));
        } catch (e) {}
      } else {
        const defaultPrefs = {
          ...initialMockPreferences,
          email: normalizedEmail
        };
        setPreferences(defaultPrefs);
        localStorage.setItem('echoagent_user_preferences', JSON.stringify(defaultPrefs));
      }
      return { user: activeUser };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();
    if (!isSupabaseConfigured || !supabase) {
      const accountsRaw = localStorage.getItem('echoagent_registered_accounts');
      const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};

      if (accounts[normalizedEmail]) {
        throw new Error('An account with this email already exists. Please sign in.');
      }

      const newAccount = {
        id: 'user_' + Date.now(),
        email: normalizedEmail,
        password: password,
        created_at: new Date().toISOString()
      };
      accounts[normalizedEmail] = newAccount;
      localStorage.setItem('echoagent_registered_accounts', JSON.stringify(accounts));

      const activeUser = { id: newAccount.id, email: normalizedEmail };
      setUser(activeUser);
      localStorage.setItem('echoagent_user', JSON.stringify(activeUser));

      const updated = {
        ...initialMockPreferences,
        email: normalizedEmail
      };
      setPreferences(updated);
      localStorage.setItem('echoagent_user_preferences', JSON.stringify(updated));
      localStorage.setItem('echoagent_user_prefs_' + normalizedEmail, JSON.stringify(updated));
      return { user: activeUser };
    }
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password
    });
    if (error) throw error;
    if (data?.user) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: data.user.id,
            email,
            topics: ['Agentic AI', 'RAG', 'n8n', 'LangGraph', 'Production LLMs'],
            scheduled_time: '07:00:00',
            is_active: true
          });
      } catch (err) {
        console.error(err);
      }
    }
    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setPreferences(initialMockPreferences);
    localStorage.removeItem('echoagent_user');
    localStorage.removeItem('echoagent_user_preferences');
    localStorage.removeItem('echoagent_demo_scan_used');
  };

  const updatePreferences = async (updatedFields) => {
    const newPrefs = { ...preferences, ...updatedFields, updated_at: new Date().toISOString() };
    setPreferences(newPrefs);
    localStorage.setItem('echoagent_user_preferences', JSON.stringify(newPrefs));
    if (user?.email) {
      const emailKey = user.email.toLowerCase().trim();
      localStorage.setItem('echoagent_user_prefs_' + emailKey, JSON.stringify(newPrefs));
    }

    if (isSupabaseConfigured && supabase && user && !user.is_demo) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({ ...newPrefs, user_id: user.id });
      } catch (err) {
        console.error('Error saving preferences to Supabase:', err);
      }
    }
    return newPrefs;
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    }
    return { isLocal: true };
  };

  const completeGoogleLogin = async (gmailAddress) => {
    const normalizedEmail = gmailAddress.toLowerCase().trim();
    const activeUser = {
      id: 'google_' + btoa(normalizedEmail).replace(/=/g, '').slice(0, 16),
      email: normalizedEmail,
      provider: 'google',
      session_id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      logged_in_at: new Date().toISOString()
    };

    setUser(activeUser);
    localStorage.setItem('echoagent_user', JSON.stringify(activeUser));

    const savedUserPrefs = localStorage.getItem('echoagent_user_prefs_' + normalizedEmail);
    if (savedUserPrefs) {
      try {
        const parsed = JSON.parse(savedUserPrefs);
        setPreferences(parsed);
        localStorage.setItem('echoagent_user_preferences', JSON.stringify(parsed));
      } catch (e) {}
    } else {
      const defaultPrefs = {
        ...initialMockPreferences,
        email: normalizedEmail
      };
      setPreferences(defaultPrefs);
      localStorage.setItem('echoagent_user_preferences', JSON.stringify(defaultPrefs));
      localStorage.setItem('echoagent_user_prefs_' + normalizedEmail, JSON.stringify(defaultPrefs));
    }

    return { user: activeUser };
  };

  const sendOtp = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (normalizedEmail !== 'researcher@echoagent.ai' && !gmailRegex.test(normalizedEmail)) {
      throw new Error('Please enter a valid Gmail address (@gmail.com).');
    }

    const otpsRaw = localStorage.getItem('echoagent_active_otps');
    const otps = otpsRaw ? JSON.parse(otpsRaw) : {};

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otps[normalizedEmail] = {
      code,
      expiresAt,
      used: false,
      issuedAt: Date.now()
    };
    localStorage.setItem('echoagent_active_otps', JSON.stringify(otps));

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        fetch(webhookUrl.replace('trigger-digest', 'send-otp'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, code, type: 'LOGIN_OTP' })
        }).catch(() => {});
      }
    } catch (e) {}

    return { success: true, email: normalizedEmail, expiresAt, code };
  };

  const verifyOtp = async (email, enteredCode) => {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanCode = enteredCode.toString().trim();

    const otpsRaw = localStorage.getItem('echoagent_active_otps');
    const otps = otpsRaw ? JSON.parse(otpsRaw) : {};
    const record = otps[normalizedEmail];

    if (!record) {
      throw new Error('No active OTP found. Please request a new verification code.');
    }

    if (record.used) {
      throw new Error('This verification code has already been used. Please request a new one.');
    }

    if (Date.now() > record.expiresAt) {
      delete otps[normalizedEmail];
      localStorage.setItem('echoagent_active_otps', JSON.stringify(otps));
      throw new Error('Verification code has expired. Please request a new code.');
    }

    if (record.code !== cleanCode) {
      throw new Error('Incorrect 6-digit code. Please check and try again.');
    }

    record.used = true;
    delete otps[normalizedEmail];
    localStorage.setItem('echoagent_active_otps', JSON.stringify(otps));

    const activeUser = {
      id: 'otp_user_' + btoa(normalizedEmail).replace(/=/g, '').slice(0, 16),
      email: normalizedEmail,
      session_id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      verified_via: 'otp',
      logged_in_at: new Date().toISOString()
    };

    setUser(activeUser);
    localStorage.setItem('echoagent_user', JSON.stringify(activeUser));

    const savedUserPrefs = localStorage.getItem('echoagent_user_prefs_' + normalizedEmail);
    if (savedUserPrefs) {
      try {
        const parsed = JSON.parse(savedUserPrefs);
        setPreferences(parsed);
        localStorage.setItem('echoagent_user_preferences', JSON.stringify(parsed));
      } catch (e) {}
    } else {
      const defaultPrefs = {
        ...initialMockPreferences,
        email: normalizedEmail
      };
      setPreferences(defaultPrefs);
      localStorage.setItem('echoagent_user_preferences', JSON.stringify(defaultPrefs));
      localStorage.setItem('echoagent_user_prefs_' + normalizedEmail, JSON.stringify(defaultPrefs));
    }

    return { user: activeUser };
  };

  return (
    <AuthContext.Provider value={{
      user,
      preferences,
      loading,
      login,
      register,
      logout,
      updatePreferences,
      loginWithGoogle,
      completeGoogleLogin,
      sendOtp,
      verifyOtp,
      isConfigured: isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
