# 1. PROJECT OVERVIEW

**NyayaLens – The Living Judicial Gazette**

- **What it is**: An AI‑powered judicial intelligence platform that ingests court judgment PDFs and turns them into structured, actionable, and human‑verifiable intelligence.
- **Who it’s for**: Government officers, regulators, legal departments, and everyday citizens who need clear, trackable outcomes from court rulings.
- **Problem it solves**: Eliminates manual PDF review, reduces misinterpretation, and provides a unified, auditable view of legal directives.
- **Why it matters**: Faster compliance, transparent governance, and empowered citizens.

---

# 2. CORE PROBLEM

- **Pain points for officers**: 
  - Hours spent manually scanning PDFs.
  - Missed deadlines and ambiguous directives.
  - No linkage between orders and source evidence.
- **Workflow inefficiencies**: 
  - Disconnected data silos (court system ↔ internal departments).
  - Manual copy‑pasting of key excerpts.
- **Citizen issues**: 
  - Legal language is opaque; people cannot understand how a judgment affects them.
- **Compliance risks**: 
  - Failure to act on court orders can lead to penalties.
- **Manual legal processing problems**: 
  - Human error, inconsistent formatting, lack of audit trails.

---

# 3. SOLUTION OVERVIEW

- **End‑to‑end workflow**: Upload → OCR → Multi‑layer AI extraction → Risk scoring → Human verification → Dashboard / Reports → Archived Gazette.
- **Key differentiators**:
  - *Hybrid AI*: rule‑based + local LLM (Ollama) + cloud LLM (OpenRouter) for accuracy and privacy.
  - *Evidence linking*: each extracted directive is anchored to its PDF location.
  - *Living Newspaper UI*: cinematic, 3‑D archival pages that feel like a legal newspaper.
  - *Role‑based portals*: officer command‑center vs citizen‑friendly view.

---

# 4. SYSTEM WORKFLOW

1. **PDF Upload** – User drags a judgment PDF into the portal; file stored in `uploads/`.
2. **OCR** – Tesseract (or built‑in PDF text extraction) extracts raw text.
3. **AI Extraction** – Three‑layer pipeline processes text:
   - Layer 1: Regex / rule‑engine extracts dates, departments, penalties.
   - Layer 2: Local LLM (qwen2.5‑3B via Ollama) adds contextual understanding.
   - Layer 3: Cloud LLM (Gemma‑3‑4B via OpenRouter) produces refined, high‑precision directives.
4. **Risk Processing** – A risk engine scores each directive (urgency, legal exposure).
5. **Human Verification** – Officers review AI output, add comments, approve or reject.
6. **Dashboard** – Approved items appear on the Command Center with status stamps, deadlines, and linked evidence thumbnails.
7. **Report Generation** – PDF/HTML reports auto‑generated and archived as part of the “Living Gazette”.

---

# 5. AI PIPELINE

- **Layer 1 – Rule Engine**: Fast regex patterns for dates, case numbers, statutory references.
- **Layer 2 – Local Model**: `qwen2.5:3b` hosted via Ollama; runs on‑premise for privacy‑critical data.
- **Layer 3 – Cloud Model**: OpenRouter `google/gemma‑3‑4b‑it`; provides high‑quality natural‑language reasoning.
- **Fallback Logic**: If the cloud model fails (quota, latency), the system automatically falls back to the local model.
- **Explainability**: Each extracted field includes source‑line metadata; UI shows a highlighted snippet in the PDF viewer.
- **Why hybrid matters**: Balances data sovereignty, cost, and accuracy – local model for bulk processing, cloud model for edge cases.

---

# 6. FEATURE BREAKDOWN

## Core Features
- **PDF Upload & Storage** – Secure file handling, automatic versioning.
- **OCR & Text Extraction** – Accurate conversion of scanned judgments.
- **Hybrid AI Extraction** – Structured directives with confidence scores.
- **Risk Scoring Engine** – Prioritizes actions based on legal exposure.
- **Human Verification UI** – Approve/reject, add notes, attach evidence.
- **Report Generator** – One‑click certified PDF reports.

## Officer Features
- **Command Center Dashboard** – Real‑time status stamps, deadline ticker, breaking‑proceedings banner.
- **Evidence Viewer** – Side‑by‑side PDF with highlighted AI predictions.
- **Audit Trail** – Full history of AI suggestions, human edits, and timestamps.

## Citizen Features
- **Citizen Portal** – Simplified language, voice‑over explanations.
- **Searchable Gazette** – Public archive of past judgments, filtered by department or date.
- **Notification System** – Email/SMS alerts for judgments that affect the user.

## AI Features
- **Three‑layer pipeline** (rule → local LLM → cloud LLM).
- **Explainability** – Source snippet tagging.
- **Fallback & Retry** – Automatic switch to local model on cloud failure.

## Verification Features
- **Human‑in‑the‑loop** – UI for officers to validate AI output before it reaches citizens.
- **Commenting & Tagging** – Add context, assign to internal teams.

## UI/UX Features
- **Newspaper‑style layout** – 3D page stack, paper‑grain textures, double‑bordered stamps.
- **Role‑based theming** – Dark, institutional theme for officers; light, accessible theme for citizens.
- **Micro‑animations** – Hover effects, page‑turn transitions.

## Government Features
- **Compliance Dashboard** – Track open directives, overdue items, and departmental KPIs.
- **Export API** – JSON endpoints for integration with existing ERP/HR systems.

---

# 7. USER EXPERIENCE DESIGN

- **Living Judicial Gazette Concept**: The UI mimics a physical newspaper, giving a sense of gravitas and archival continuity. Pages can be ‘flipped’ to view older judgments.
- **Role‑Based System**: Upon login, users are routed to either the Officer Command Center (rich controls, status stamps) or the Citizen Portal (simplified language, voice assistance).
- **Institutional Realism**: Dark, glass‑morphism cards, official‑looking stamps, and a breaking‑proceedings ticker convey government authority.
- **Citizen Accessibility**: Large readable typography (Inter), high‑contrast colors, voice‑over, and plain‑English summaries.

---

# 8. KEY INNOVATIONS

1. **Evidence Linking** – AI‑generated directives are directly linked to the exact PDF excerpt, providing legal traceability.
2. **Hybrid AI Architecture** – Combines rule‑based precision, on‑premise privacy, and cloud‑level reasoning.
3. **Living Newspaper UI** – A premium, cinematic presentation that turns static judgments into an engaging, archival newspaper.
4. **Human Verification Loop** – Guarantees legal correctness while keeping the workflow fast.
5. **Citizen Explanation Layer** – Automatic plain‑English & audio summaries democratize access to legal information.

---

# 9. TECH STACK

- **Frontend**: Next.js 16 (React), Tailwind‑free vanilla CSS, custom design tokens, PDF.js for document rendering, WebSockets for live status updates.
- **Backend**: FastAPI (Python 3.11), Uvicorn, SQLite (development) / PostgreSQL (production), Starlette middleware, CORS.
- **AI Stack**: 
  - Rule Engine (Python regex)
  - Local LLM – Ollama + `qwen2.5:3b`
  - Cloud LLM – OpenRouter (`google/gemma‑3‑4b‑it`)
- **OCR**: PyMuPDF / Tesseract (fallback).
- **Report Generation**: WeasyPrint (HTML → PDF) + custom templates.
- **Database**: SQLite (`database.db`) with `init_db` migration script.
- **Env Management**: python‑dotenv.
- **Logging**: Standard Python `logging` (INFO level).
- **Version Control**: Git + GitHub.
- **Deployment**: Backend on Render / Railway (Docker‑ready), Frontend on Vercel, optional ngrok for demo exposure.

---

# 10. GOVERNMENT IMPACT

- **Deployability**: Container‑ready, can be hosted on a sovereign cloud or on‑premise VM.
- **Scalability**: Stateless FastAPI services, horizontal scaling via Docker/Kubernetes.
- **Compliance**: Data never leaves the government network when using the local LLM; audit logs meet record‑keeping standards.
- **Workload Reduction**: Automates 70‑80 % of PDF review tasks, freeing legal staff for higher‑value work.
- **Accountability**: Every directive is time‑stamped, signed, and linked to source evidence.
- **Transparency**: Citizens can view the same verified Gazette, increasing public trust.

---

# 11. CITIZEN IMPACT

- **Legal Accessibility**: Plain‑English summaries turn legalese into everyday language.
- **Transparency**: Public archive of decisions; citizens can search by department, date, or keyword.
- **Reduced Confusion**: Voice‑over explanations and visual highlights pinpoint exactly what a judgment entails.
- **Empowerment**: People receive notifications when a judgment directly affects them (e.g., tax, land, licensing).

---

# 12. DEMO FLOW

1. **Login as Officer** – Show role‑based dashboard with status stamps.
2. **Upload a PDF** – Drag‑and‑drop a sample judgment.
3. **AI Extraction** – Show progress bar; after completion, display AI‑generated directives with highlighted PDF snippets.
4. **Risk Score** – Highlight urgent items in red.
5. **Human Verification** – Approve a directive, add a comment.
6. **Citizen View** – Switch role to Citizen; see the same judgment now rendered as a plain‑English article with voice‑over button.
7. **Report Generation** – Click “Export Report”; PDF download appears with official stamp.
8. **Archive Navigation** – Flip through previous pages of the Living Gazette.
9. **Notification Demo** – Show email/SMS preview for a citizen affected by the judgment.

---

# 13. STRONGEST SELLING POINTS

- **Technical**: Hybrid AI pipeline that respects data sovereignty while delivering top‑tier LLM reasoning.
- **Emotional**: Newspaper‑style UI gives a sense of gravitas and trustworthiness.
- **Real‑World**: Directly bridges the gap between courts and the people who must act on rulings, cutting compliance lag from weeks to minutes.
- **Scalable**: Cloud‑ready microservices, easy to spin up for any jurisdiction.

---

# 14. FUTURE SCOPE

- **Multilingual Support** – Add translation pipelines for regional languages.
- **eCourt Integration** – Direct ingest from court docket APIs.
- **Advanced Analytics** – Trend analysis on recurring directives, departmental performance dashboards.
- **Mobile App** – Push notifications & offline access for field officers.
- **Zero‑Trust Deployment** – Full on‑premise container bundle for highly regulated environments.
- **AI Model Updates** – Seamless switch to newer open‑source LLMs (e.g., Llama‑3) as they mature.

---

*Prepared for a hackathon pitch deck, this document can be split into slides, narration notes, and demo‑script bullet points.*
