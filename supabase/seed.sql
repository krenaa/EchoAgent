-- ==============================================================================
-- EchoAgent: Seed Data for Testing & Verification
-- Inserts realistic AI/ML research items into digest_items
-- ==============================================================================

INSERT INTO public.digest_items (
    source,
    title,
    item_url,
    author_or_submitter,
    relevance_score,
    ai_summary,
    why_it_matters,
    raw_content_snippet,
    digest_date,
    delivered_to_telegram
) VALUES 
(
    'arxiv',
    'Agent Workflow Memory: Hierarchical State Tracking in Multi-Agent Reasoning Loops',
    'https://arxiv.org/abs/2405.18942',
    'Y. Zhang, D. Chen, L. Wang et al.',
    9,
    'Proposes a dual-tier episodic memory architecture for LLM agents that reduces token overhead by 48% while maintaining context coherence across 100+ execution steps. Evaluated on complex tool-use benchmarks.',
    'Directly solves memory bloating and degradation in long-running autonomous workflows like n8n and LangGraph agents.',
    'We demonstrate that standard sliding-window context fails when agents invoke iterative subagents. By separating plan state from execution trace, our hierarchical approach scales linearly.',
    CURRENT_DATE,
    true
),
(
    'hackernews',
    'Show HN: Low-Latency Structured Output Generation for Local LLMs',
    'https://news.ycombinator.com/item?id=40521890',
    'alex_dev',
    8,
    'A lightweight C++/Rust library enforcing strict JSON schema and grammar constraints at the token sampler level with zero regex parsing overhead.',
    'Enables deterministic JSON responses from local models at maximum generation throughput, essential for automated data pipelines.',
    'Existing solutions like instructor or guidance add latency or rely on heavy Python wrappers. This runs directly in the sampler loop with under 0.2ms overhead per token.',
    CURRENT_DATE,
    true
),
(
    'rss',
    'Architecting Reliable Multi-Agent Systems in Production',
    'https://blog.langchain.dev/architecting-reliable-multi-agent-systems/',
    'Harrison Chase',
    9,
    'Comprehensive post-mortem analysis of production agent failures across 50+ enterprise deployments, identifying cyclic loop traps and lack of checkpointing as the primary root causes.',
    'Validates our serverless orchestration strategy using deterministic graph nodes and isolated execution boundaries.',
    'The biggest shift in 2024 is moving away from black-box autonomous agents toward controlled state machines with explicit human-in-the-loop and observability gates.',
    CURRENT_DATE,
    true
),
(
    'arxiv',
    'Self-Correcting RAG: Automated Query Expansion and Grounding Verification',
    'https://arxiv.org/abs/2405.09112',
    'M. Gupta, S. Miller',
    7,
    'Introduces an active retrieval agent that scores retrieved chunk sufficiency before synthesis and triggers targeted secondary vector searches upon hallucination risk.',
    'Crucial technique for improving response accuracy in dense retrieval pipelines without increasing vector database size.',
    'We find that static top-k retrieval yields poor synthesis when documents are disjointed. Our iterative probe guarantees factual grounding across heterogeneous corpora.',
    CURRENT_DATE,
    true
),
(
    'hackernews',
    'Lessons from Running 1,000 n8n Workflows in Enterprise Infrastructure',
    'https://news.ycombinator.com/item?id=40518201',
    'cloud_architect',
    8,
    'Deep architectural guide detailing container pooling, SQLite-to-Postgres scaling limits, webhook security, and error-handling loops in high-load n8n environments.',
    'Provides direct operational blueprints for scaling EchoAgent from free-tier Render to production clusters.',
    'Key takeaway: webhook payload sanitization and asynchronous queue workers are vital once your daily schedule exceeds 500 parallel triggers.',
    CURRENT_DATE,
    true
)
ON CONFLICT (item_url) DO NOTHING;
