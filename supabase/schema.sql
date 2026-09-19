-- ==============================================================================
-- EchoAgent: Supabase Database Schema
-- Tables: user_preferences, digest_items
-- Features: User authentication, personalized topics, custom schedule time, pause/resume
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Preferences Table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    topics TEXT[] NOT NULL DEFAULT ARRAY['Agentic AI', 'RAG', 'n8n', 'LangGraph', 'Production LLMs'],
    custom_instructions TEXT DEFAULT 'Prioritize production architectures and benchmarks. Filter out beginner tutorials.',
    min_score INTEGER DEFAULT 7 CHECK (min_score BETWEEN 1 AND 10),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,           -- Toggle to pause/stop digests
    scheduled_time TIME NOT NULL DEFAULT '07:00:00',   -- User-chosen delivery time (e.g. 10:00 AM)
    telegram_chat_id TEXT,                             -- User's personalized Telegram chat ID
    last_executed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. Research Digest Items Table
CREATE TABLE IF NOT EXISTS public.digest_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Optional: link to specific user or shared
    source TEXT NOT NULL CHECK (source IN ('arxiv', 'hackernews', 'rss')),
    title TEXT NOT NULL,
    item_url TEXT NOT NULL,
    author_or_submitter TEXT,
    relevance_score INTEGER CHECK (relevance_score BETWEEN 1 AND 10),
    ai_summary TEXT,
    why_it_matters TEXT,
    raw_content_snippet TEXT,
    digest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    delivered_to_telegram BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Indexes for fast query performance and deduplication
CREATE UNIQUE INDEX IF NOT EXISTS idx_digest_items_url_user ON public.digest_items (item_url, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid));
CREATE INDEX IF NOT EXISTS idx_digest_items_date ON public.digest_items (digest_date DESC);
CREATE INDEX IF NOT EXISTS idx_digest_items_score ON public.digest_items (relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_active ON public.user_preferences (is_active, scheduled_time);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digest_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for user_preferences
-- Authenticated users can view and edit their own preferences
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
CREATE POLICY "Users can view their own preferences" 
    ON public.user_preferences 
    FOR SELECT 
    USING (auth.uid() = user_id OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Users can insert/update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert/update their own preferences" 
    ON public.user_preferences 
    FOR ALL 
    USING (auth.uid() = user_id OR auth.role() = 'anon');

-- Service role (n8n backend) has full access
DROP POLICY IF EXISTS "Service role has full access to preferences" ON public.user_preferences;
CREATE POLICY "Service role has full access to preferences" 
    ON public.user_preferences 
    FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'postgres');

-- 7. RLS Policies for digest_items
DROP POLICY IF EXISTS "Public can view digest items" ON public.digest_items;
CREATE POLICY "Public can view digest items" 
    ON public.digest_items 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Service role has full access to digest items" ON public.digest_items;
CREATE POLICY "Service role has full access to digest items" 
    ON public.digest_items 
    FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'postgres');
