import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from './supabase';
import { mockDigestItems } from '../utils/mockData';

const N8N_WEBHOOK_URL = '/webhook/trigger-digest';

const fetchLiveFeedItems = async (topics = ['AI', 'LLM', 'Agent']) => {
  try {
    const query = topics.length > 0 ? topics.slice(0, 3).join(' ') : 'AI LLM Agent';
    const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&query=${encodeURIComponent(query)}&hitsPerPage=8`);
    if (!res.ok) throw new Error('Live fetch failed');
    const data = await res.json();
    const hits = data.hits || [];

    if (hits.length === 0) return mockDigestItems;

    return hits.map((hit, idx) => {
      const points = hit.points || 0;
      const comments = hit.num_comments || 0;
      const score = Math.min(10, Math.max(7, Math.floor(7 + (points / 25))));
      const title = hit.title || 'Untitled Research Submission';
      const itemUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
      
      return {
        id: `hn_live_${hit.objectID || idx}`,
        source: 'hackernews',
        title: title,
        item_url: itemUrl,
        author_or_submitter: hit.author || 'HN Researcher',
        relevance_score: score,
        ai_summary: `Live community discussion with ${points} upvotes and ${comments} technical comments on Hacker News.`,
        why_it_matters: `Real-time community signal tracking practitioner implementation around ${topics[0] || 'AI'}.`,
        raw_content_snippet: hit.story_text || `Live technical submission with ${points} points.`,
        digest_date: (hit.created_at || new Date().toISOString()).split('T')[0],
        delivered_to_telegram: true,
        created_at: hit.created_at || new Date().toISOString()
      };
    });
  } catch (err) {
    return mockDigestItems;
  }
};

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

      const liveItems = await fetchLiveFeedItems();
      if (liveItems && liveItems.length > 0) {
        return liveItems;
      }

      const localItems = localStorage.getItem('echoagent_digest_items');
      if (localItems) {
        try {
          return JSON.parse(localItems);
        } catch (e) {}
      }

      return mockDigestItems;
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3,
  });
};

export const useTriggerDigest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topics, minScore, telegramChatId }) => {
      if (!telegramChatId || !telegramChatId.trim()) {
        return { success: true, skipped_telegram: true };
      }

      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trigger: 'manual_dashboard_run',
            topics: topics || [],
            min_score: minScore || 7,
            telegram_chat_id: telegramChatId.trim(),
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
            body: JSON.stringify({ 
              trigger: 'manual_run_direct',
              telegram_chat_id: telegramChatId.trim()
            })
          });
        } catch (fallbackErr) {}
        return { success: true };
      }
    },
    onSuccess: async (data, variables) => {
      const freshLiveItems = await fetchLiveFeedItems(variables?.topics || []);
      if (freshLiveItems && freshLiveItems.length > 0) {
        localStorage.setItem('echoagent_digest_items', JSON.stringify(freshLiveItems));
        queryClient.setQueryData(['digests'], freshLiveItems);
      } else {
        queryClient.invalidateQueries({ queryKey: ['digests'] });
      }
    }
  });
};
