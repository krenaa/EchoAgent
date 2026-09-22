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
          await fetchUserPreferences(session.user.id);
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
        await fetchUserPreferences(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserPreferences = async (userId) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setPreferences(data);
      }
    } catch (err) {
      console.error('Failed to load user preferences from Supabase:', err);
    }
  };

  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      const normalizedEmail = email.toLowerCase().trim();
      const accountsRaw = localStorage.getItem('echoagent_registered_accounts');
      const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};

      if (!accounts['researcher@echoagent.ai']) {
        accounts['researcher@echoagent.ai'] = {
          id: 'demo-user-123',
          email: 'researcher@echoagent.ai',
          password: 'demopassword123'
        };
        localStorage.setItem('echoagent_registered_accounts', JSON.stringify(accounts));
      }

      const account = accounts[normalizedEmail];
      if (!account) {
        throw new Error('No account found with this email. Please create an account first.');
      }

      if (account.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }

      const activeUser = { id: account.id, email: normalizedEmail };
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

  return (
    <AuthContext.Provider value={{
      user,
      preferences,
      loading,
      login,
      register,
      logout,
      updatePreferences,
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
