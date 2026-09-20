import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from './supabase';
import { mockDigestItems } from '../utils/mockData';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/trigger-digest';

export const useDigests = () => {
  return useQuery({
    queryKey: ['digests'],
    queryFn: async () => {
      // If Supabase is connected, query the live table
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('digest_items')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            return data;
          }
        } catch (err) {
          console.warn('Supabase query failed, falling back to cached/seed items:', err);
        }
      }

      // Check local storage for any recently delivered items
      const localItems = localStorage.getItem('echoagent_digest_items');
      if (localItems) {
        try {
          return JSON.parse(localItems);
        } catch (e) {
          // ignore parsing error
        }
      }

      // Default to curated sample intelligence items
      return mockDigestItems;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useTriggerDigest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topics, minScore }) => {
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trigger: 'manual_dashboard_run',
            topics: topics || [],
            min_score: minScore || 7,
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error(`Webhook responded with status: ${response.status}`);
        }

        return await response.json().catch(() => ({ success: true }));
      } catch (err) {
        console.warn('Live webhook ping could not connect, simulating execution:', err.message);
        // Return simulated success for seamless demo/testing experience
        return { success: true, simulated: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digests'] });
    }
  });
};
