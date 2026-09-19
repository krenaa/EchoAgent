-- ==============================================================================
-- EchoAgent: Supabase Database Schema
-- Table: digest_items
-- Description: Stores discovered AI research items, relevance scores, and summaries.
-- ==============================================================================

-- 1. Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the digest_items table
CREATE TABLE IF NOT EXISTS public.digest_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL CHECK (source IN ('arxiv', 'hackernews', 'rss')),
    title TEXT NOT NULL,
    item_url TEXT UNIQUE NOT NULL,
    author_or_submitter TEXT,
    relevance_score INTEGER CHECK (relevance_score BETWEEN 1 AND 10),
    ai_summary TEXT,
    why_it_matters TEXT,
    raw_content_snippet TEXT,
    digest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    delivered_to_telegram BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes for fast deduplication and dashboard queries
CREATE UNIQUE INDEX IF NOT EXISTS idx_digest_items_url ON public.digest_items (item_url);
CREATE INDEX IF NOT EXISTS idx_digest_items_date ON public.digest_items (digest_date DESC);
CREATE INDEX IF NOT EXISTS idx_digest_items_score ON public.digest_items (relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_digest_items_source ON public.digest_items (source);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.digest_items ENABLE ROW LEVEL SECURITY;

-- 5. Policy: Allow read-only access to anyone (public / frontend dashboard)
DROP POLICY IF EXISTS "Public can view digest items" ON public.digest_items;
CREATE POLICY "Public can view digest items" 
    ON public.digest_items 
    FOR SELECT 
    USING (true);

-- 6. Policy: Allow insert/update/delete for service role (n8n backend pipeline)
DROP POLICY IF EXISTS "Service role has full access" ON public.digest_items;
CREATE POLICY "Service role has full access" 
    ON public.digest_items 
    FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'postgres');
