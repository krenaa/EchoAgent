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

  // Sync preferences to localStorage
  useEffect(() => {
    if (preferences) {
      localStorage.setItem('echoagent_user_preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Check initial session & Supabase listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Auto-load demo user if no Supabase credentials configured
      const savedUser = localStorage.getItem('echoagent_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const demoUser = { id: 'demo-user-123', email: 'researcher@echoagent.ai', is_demo: true };
        setUser(demoUser);
        localStorage.setItem('echoagent_user', JSON.stringify(demoUser));
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
      const demoUser = { id: 'demo-' + Date.now(), email, is_demo: true };
      setUser(demoUser);
      localStorage.setItem('echoagent_user', JSON.stringify(demoUser));
      return { user: demoUser };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, telegramChatId = '') => {
    if (!isSupabaseConfigured || !supabase) {
      const demoUser = { id: 'demo-' + Date.now(), email, is_demo: true };
      setUser(demoUser);
      localStorage.setItem('echoagent_user', JSON.stringify(demoUser));
      const updated = {
        ...preferences,
        email,
        telegram_chat_id: telegramChatId
      };
      setPreferences(updated);
      localStorage.setItem('echoagent_user_preferences', JSON.stringify(updated));
      return { user: demoUser };
    }
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          telegram_chat_id: telegramChatId
        }
      }
    });
    if (error) throw error;
    if (data?.user) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: data.user.id,
            email,
            telegram_chat_id: telegramChatId,
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
    localStorage.removeItem('echoagent_user');
  };

  const updatePreferences = async (updatedFields) => {
    const newPrefs = { ...preferences, ...updatedFields, updated_at: new Date().toISOString() };
    setPreferences(newPrefs);

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
