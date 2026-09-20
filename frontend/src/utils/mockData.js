// ==============================================================================
// EchoAgent: Fallback Mock Data for Instant Offline Demo & Development
// ==============================================================================

export const initialMockPreferences = {
  id: 'pref_demo_01',
  user_id: 'user_demo_01',
  email: 'researcher@echoagent.ai',
  topics: ['Agentic AI', 'RAG', 'n8n', 'LangGraph', 'Production LLMs', 'Local AI'],
  custom_instructions: 'Prioritize production architectures, low-latency evaluation, and real-world benchmarks. Filter out generic beginner tutorials.',
  min_score: 7,
  is_active: true,
  scheduled_time: '10:23:00',
  telegram_chat_id: '5479104426',
  last_executed_at: new Date().toISOString()
};

export const mockDigestItems = [
  {
    id: 'digest_item_01',
    source: 'arxiv',
    title: 'Agent Workflow Memory: Hierarchical State Tracking in Multi-Agent Reasoning Loops',
    item_url: 'https://arxiv.org/abs/2405.18942',
    author_or_submitter: 'Y. Zhang, D. Chen, L. Wang et al.',
    relevance_score: 9,
    ai_summary: 'Proposes a dual-tier episodic memory architecture for LLM agents that reduces token overhead by 48% while maintaining context coherence across 100+ execution steps. Evaluated across multi-tool benchmark environments.',
    why_it_matters: 'Directly solves context degradation and token cost spikes in long-running autonomous workflows like n8n, LangGraph, and AutoGen agents.',
    raw_content_snippet: 'We demonstrate that standard sliding-window context fails when agents invoke iterative subagents. By separating plan state from execution trace, our hierarchical approach scales linearly without loss of instruction recall.',
    digest_date: new Date().toISOString().split('T')[0],
    delivered_to_telegram: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'digest_item_02',
    source: 'hackernews',
    title: 'Show HN: Low-Latency Structured Output Generation for Local LLMs with Zero Regex Overhead',
    item_url: 'https://news.ycombinator.com/item?id=40521890',
    author_or_submitter: 'alex_dev',
    relevance_score: 8,
    ai_summary: 'A high-performance C++/Rust sampler that enforces strict JSON schema and grammar constraints at the token logit level without regex parsing latency.',
    why_it_matters: 'Enables deterministic JSON responses from local models at maximum generation throughput, essential for high-throughput pipeline agents.',
    raw_content_snippet: 'Existing solutions like instructor or guidance add latency or rely on heavy Python wrappers. This runs directly in the sampler loop with under 0.2ms overhead per token.',
    digest_date: new Date().toISOString().split('T')[0],
    delivered_to_telegram: true,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'digest_item_03',
    source: 'rss',
    title: 'Architecting Reliable Multi-Agent Systems in Production: 50 Enterprise Case Studies',
    item_url: 'https://blog.langchain.dev/architecting-reliable-multi-agent-systems/',
    author_or_submitter: 'Harrison Chase',
    relevance_score: 9,
    ai_summary: 'Comprehensive analysis of production agent failures across 50 enterprise deployments, pinpointing infinite loop traps and lack of checkpointing state machines as the top failure modes.',
    why_it_matters: 'Validates our orchestration strategy using deterministic graph nodes, isolated execution boundaries, and explicit human-in-the-loop gates.',
    raw_content_snippet: 'The biggest architectural shift in 2024 is moving away from black-box autonomous agents toward controlled state machines with explicit checkpointing and observability.',
    digest_date: new Date().toISOString().split('T')[0],
    delivered_to_telegram: true,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'digest_item_04',
    source: 'arxiv',
    title: 'Self-Correcting RAG: Automated Query Expansion and Grounding Verification',
    item_url: 'https://arxiv.org/abs/2405.09112',
    author_or_submitter: 'M. Gupta, S. Miller',
    relevance_score: 7,
    ai_summary: 'Introduces an active retrieval agent that scores chunk sufficiency prior to generation and triggers secondary targeted vector searches if hallucination probability exceeds a threshold.',
    why_it_matters: 'Key mechanism for boosting answer accuracy in dense retrieval pipelines without ballooning embedding index storage.',
    raw_content_snippet: 'We find that static top-k retrieval yields poor synthesis when documents are disjointed. Our iterative probe guarantees factual grounding across heterogeneous corpora.',
    digest_date: new Date().toISOString().split('T')[0],
    delivered_to_telegram: true,
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 'digest_item_05',
    source: 'hackernews',
    title: 'Lessons from Running 1,000 n8n Workflows in Enterprise Production Infrastructure',
    item_url: 'https://news.ycombinator.com/item?id=40518201',
    author_or_submitter: 'cloud_architect',
    relevance_score: 8,
    ai_summary: 'Detailed operational post detailing worker container pooling, PostgreSQL connection scaling limits, webhook security, and error-handling loops under high loads.',
    why_it_matters: 'Provides battle-tested operational guidelines for deploying self-hosted n8n orchestrations on Render and VPS clusters reliably.',
    raw_content_snippet: 'Key takeaway: webhook payload sanitization and asynchronous queue workers are vital once your daily schedule exceeds 500 parallel triggers.',
    digest_date: new Date().toISOString().split('T')[0],
    delivered_to_telegram: true,
    created_at: new Date(Date.now() - 14400000).toISOString()
  }
];
