import { useEffect, useRef } from 'react';

const getHeartbeatUrl = () => {
  const customUrl = import.meta.env.VITE_RENDER_BACKEND_URL;
  if (customUrl) {
    return customUrl.endsWith('/healthz') ? customUrl : `${customUrl.replace(/\/+$/, '')}/healthz`;
  }

  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const parsed = new URL(webhookUrl);
      return `${parsed.origin}/healthz`;
    } catch (e) {
      return null;
    }
  }

  return '/healthz';
};

export const useBackendHeartbeat = () => {
  const lastPingRef = useRef(Date.now());

  useEffect(() => {
    const targetUrl = getHeartbeatUrl();
    if (!targetUrl) return;

    const sendHeartbeat = () => {
      lastPingRef.current = Date.now();
      fetch(targetUrl, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store'
      }).catch(() => {});
    };

    sendHeartbeat();

    const intervalId = setInterval(sendHeartbeat, 10 * 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastPingRef.current;
        if (elapsed > 9 * 60 * 1000) {
          sendHeartbeat();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
