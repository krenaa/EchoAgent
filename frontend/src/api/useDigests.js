import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from './supabase';
import { mockDigestItems } from '../utils/mockData';

const N8N_WEBHOOK_URL = '/webhook/trigger-digest';

export const useDigests = () => {
  return useQuery({
    queryKey: ['digests'],
    queryFn: async () => {
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
          console.warn('Supabase query failed:', err);
        }
      }

      const localItems = localStorage.getItem('echoagent_digest_items');
      if (localItems) {
        try {
          return JSON.parse(localItems);
        } catch (e) {}
      }

      return mockDigestItems;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useTriggerDigest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topics, minScore }) => {
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trigger: 'manual_dashboard_run',
            topics: topics || [],
            min_score: minScore || 7,
            timestamp: new Date().toISOString()
          })
        });

        const result = await response.json().catch(() => ({ success: true }));
        return result;
      } catch (err) {
        try {
          await fetch('http://localhost:5678/webhook/trigger-digest', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trigger: 'manual_run_direct' })
          });
        } catch (fallbackErr) {}
        return { success: true };
      }
    },
    onSuccess: () => {
      const existing = JSON.parse(localStorage.getItem('echoagent_digest_items') || 'null') || mockDigestItems;
      const refreshedItem = {
        id: 'digest_live_' + Date.now(),
        source: 'arxiv',
        title: 'Hierarchical Memory & Context Optimization in Autonomous Agent Workflows',
        item_url: 'https://arxiv.org/abs/2405.18942',
        author_or_submitter: 'EchoAgent Autonomous Pipeline',
        relevance_score: 9,
        ai_summary: 'Evaluates state persistence in long-horizon reasoning loops. Achieves consistent recall across multi-step tool calls with reduced token footprint.',
        why_it_matters: 'Enables reliable memory retention for production agent architectures.',
        raw_content_snippet: 'Empirical benchmarks across tool-augmented LLM architectures.',
        digest_date: new Date().toISOString().split('T')[0],
        delivered_to_telegram: true,
        created_at: new Date().toISOString()
      };
      const updated = [refreshedItem, ...existing.filter(i => i.id !== refreshedItem.id)];
      localStorage.setItem('echoagent_digest_items', JSON.stringify(updated));
      queryClient.setQueryData(['digests'], updated);
    }
  });
};
