# Pragati — Government Innovation Procurement Platform

> **SIH 2026 Prototype** | Identify → Pilot → Procure → Scale

A full-stack connective layer between government departments and startups, covering the complete innovation lifecycle. Does NOT replace GeM/CPPP/Startup India — it bridges the gaps between them.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- A Supabase project (free tier works)
- Gemini API key

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migrations in order:
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_rls_policies.sql
   supabase/migrations/003_triggers.sql
   supabase/seed.sql   ← Run this for the demo dataset
   ```
3. Copy your **Project URL** and **anon key** from Project Settings → API

### 2. Backend Setup

```bash
cd backend

# Copy and fill in env vars
copy .env.example .env
# Edit .env: set SUPABASE_URL and SUPABASE_SERVICE_KEY from your project

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
# Backend runs on http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

### 3. Frontend Setup

```bash
cd frontend

# Copy and fill in env vars
copy .env.example .env
# Edit .env: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Install dependencies (already done if you ran npm install)
npm install

# Start dev server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (from Project Settings → API) |
| `GEMINI_API_KEY` | Gemini API key |
| `RESEND_API_KEY` | Resend email API key |

### Frontend (`frontend/.env`)
| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_API_URL` | Backend URL (default: `http://localhost:8000`) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS + Framer Motion |
| Backend | FastAPI + Python |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| AI | Gemini API (5 focused features) |
| Charts | Recharts |
| Deployment | Vercel (frontend) + Render/Railway (backend) |

---

## Demo Story (Golden Path)

Use the seeded data to walk through the complete demo:

1. Login as **Government Officer** (rajesh.kumar@waterresources.gov.in)
2. View existing problem: "AI-Based Water Leakage Detection"
3. Go to AI Matching → see AquaSense AI at 94% match with explainability
4. Navigate to PILOT-001 Workspace → 82% progress, ₹7.4L/₹10L utilized
5. View field inspection reports and KPI tracking
6. See Pilot Outcome: 91/100 — SUCCESSFUL
7. Check Procurement Readiness: HIGH
8. Navigate to Validated Solutions — AquaSense AI is listed
9. Login as a different department → Search "Water Leakage" → Request Adoption

---

## Architecture

```
Government → Post Problem → AI Structures It
          → AI Finds Startups (Explainable Matching)
          → Select Startup → Create Pilot
          → Monitor: KPIs + Field Inspection + Budget
          → Pilot Outcome Score
          → Procurement Readiness (AI Assessed)
          → Proceed to GeM/CPPP (simulated)
          → Validated Solution Repository
          → Other Departments: Discover & Adopt
```

---

## User Roles

| Role | Portal | Key Capabilities |
|---|---|---|
| Government Officer | `/government` | Post problems, AI match, manage pilots, field verify, procurement |
| Startup | `/startup` | Discover problems, apply, update KPIs, upload evidence |
| Admin | `/admin` | Platform management, analytics, verification |

---

## AI Features (Gemini API)

| # | Feature | Trigger |
|---|---|---|
| 1 | Problem Structuring | Officer writes vague description → AI structures it |
| 2 | Startup Matching | "Find Suitable Startups" → ranked list with explainability |
| 3 | Pilot Analysis | "Analyze Pilot" → executive summary + risks + recommendations |
| 4 | Procurement Readiness | Auto-assessed from pilot checklist |
| 5 | Similar Solution Discovery | Search in Validated Repository → AI-ranked results |

---

## Legal Boundary (Important for Demo)

The platform **flags, records, and recommends** — it does NOT:
- Blacklist startups (only records authorized department decisions)
- Freeze or recover funds (routes to authorized department)
- Make final enforcement decisions

All suspension/blacklisting status displays include: *"per [Department] decision, ref #XXX"*

---

## Simulated (Not Real) Integrations

- GeM procurement handoff → success modal with mocked reference number
- GST/DPIIT API verification → simulated badge
- Government email domain verification → simulated delay
- Financial recovery → not implemented (platform records case only)
