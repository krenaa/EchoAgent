# EchoAgent — Autonomous AI Research Digest Agent

EchoAgent is an autonomous, agent-based research intelligence system with a serverless-first, dual-component architecture:
1. **n8n Orchestration Engine (`n8n/`)**: Autonomous backend agent scanning arXiv, Hacker News, and RSS feeds, scoring with Groq Llama-3, saving to Supabase, and delivering digests via Telegram.
2. **React Dashboard (`frontend/`)**: Modern Vite + Tailwind CSS dashboard displaying live research digests, analytics, and source filters directly from Supabase.

---

## Monorepo Layout

```
EchoAgent/
├── .env.example              # Template for root environment variables
├── .gitignore                # Git exclusions (env, local db, node_modules)
├── README.md                 # Project documentation and setup guide
├── supabase/
│   ├── schema.sql            # digest_items PostgreSQL table schema & RLS
│   └── seed.sql              # Initial mock/seed research entries
├── n8n/
│   ├── Dockerfile            # Render Docker deployment container
│   ├── .env.example          # Environment variables for n8n in production
│   ├── echoagent-workflow.json # Canonical 9-step research intelligence workflow
│   └── package.json          # Local n8n startup script
└── frontend/                 # React + Vite + Tailwind CSS dashboard
    ├── src/
    │   ├── api/              # Supabase client & React Query hooks
    │   ├── components/       # AnalyticsBar, FilterBar, DigestCard, etc.
    │   ├── pages/            # Dashboard & DigestDetail
    │   └── utils/            # Mock fallback & formatting helpers
    ├── package.json
    └── tailwind.config.js
```

---

## Dual-Environment Strategy

| Component | Local Development | Cloud Production (100% Free-Tier) |
|---|---|---|
| **Frontend** | Vite Dev Server (`localhost:5173`) | Vercel Hobby Tier |
| **Orchestration** | Self-hosted n8n via `npm start` (`localhost:5678`) | Render Web Service (Docker runtime) |
| **Database** | Local SQLite / JSON fallback or Supabase | Supabase (Managed PostgreSQL) |
| **LLM Inference** | Groq / Cohere API | Groq Cloud API (`llama-3.3-70b-versatile`) |
| **Delivery** | Telegram Bot API | Telegram Bot API |

---

## Quick Start (Local)

### 1. n8n Engine
```bash
cd n8n
npm install
npm start
```
Access the n8n UI at `http://localhost:5678`.

### 2. Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:5173`.
