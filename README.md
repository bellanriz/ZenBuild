Syncra — AI-Powered Ecosystem Linkage Platform
Automating startup ecosystem relationships as reusable, programmable entities.

Build With AI 2026 KL — MyHack | 16–17 May 2026

Gemini FastAPI React TypeScript

Problem Statement
Regional innovation ecosystems still rely on manual coordination to create and manage relationships between companies, mentors, partners, service providers, and programme administrators. Critical linkages — mentor-to-company, company-to-programme, partner-to-initiative — are handled as one-off assignments rather than structured, reusable system entities.

Syncra solves this by treating ecosystem relationships as first-class, programmable entities that can be created, managed, reused, and improved automatically across programmes, countries, and ecosystem actors.

Solution Overview
Syncra is an AI-enabled platform that automates ecosystem linkage coordination through:

Feature	Description
AI Cohort Assembly	Gemini generates optimized cohort proposals by matching mentors, companies, partners, and service providers based on expertise alignment, capacity, and compliance readiness
Intelligent Assistant	Role-aware AI chat (Admin vs Founder) grounded in real ecosystem context for mentor recommendations, compliance guidance, and linkage strategy
Programmable Linkages	Relationships modeled as typed, scored, trackable entities (MENTORSHIP, TECHNICAL_ADVISOR, INFRASTRUCTURE_CREDITS, LEGAL_COMPLIANCE)
Governance Dashboard	Real-time compliance monitoring (SSM, BNM, LHDN), audit generation, and ecosystem health metrics
Dual-Role Interface	Programme Administrators manage governance; Founders access support — each with tailored AI responses
Architecture & Scalability
Current Prototype Architecture
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                    │
│         Vite + TypeScript + Tailwind CSS v4              │
│              Express Proxy (server.ts)                    │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────┐
│                  Backend (FastAPI)                        │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │ Chat Service │  │ Cohort Service│  │ Ecosystem API│ │
│  │  (Gemini AI) │  │  (Gemini AI)  │  │  (Data Layer)│ │
│  └──────┬───────┘  └───────┬───────┘  └──────────────┘ │
│         │                   │                            │
│         ▼                   ▼                            │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Google Gemini 2.5 Flash API             │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
Production Deployment Strategy (Google Cloud)
Syncra is designed for deployment on Google Cloud Platform, leveraging managed services for scalability, cost efficiency, and operational simplicity:

Layer	Service	Rationale
Compute	Google Cloud Run	Auto-scales from zero to thousands of concurrent requests. Pay-per-use pricing eliminates idle costs for early-stage platforms. Containerized deployment ensures environment consistency.
Database	Cloud Firestore	Document-based NoSQL fits the flexible, nested structure of ecosystem entities and linkages. Real-time listeners enable live dashboard updates. Scales automatically with no capacity planning.
AI/ML	Vertex AI (Gemini API)	Enterprise-grade access to Gemini models with SLA guarantees, VPC-SC support, and usage-based billing. Enables future fine-tuning on ecosystem-specific data.
Authentication	Firebase Authentication	Multi-provider auth (Google, email, SSO) with role-based access control for Admins, Founders, Mentors, and Service Providers.
File Storage	Cloud Storage	Stores compliance documents, audit reports, and programme artifacts with lifecycle policies for cost management.
API Gateway	Cloud Endpoints	Rate limiting, API key management, and usage analytics for partner integrations.
Monitoring	Cloud Operations Suite	Centralized logging, tracing, and alerting across all services.
Scalability Considerations
Multi-Tenancy & Cross-Programme Support:

Each ecosystem programme operates as an isolated tenant within Firestore (collection-per-programme pattern)
Linkage entities are scoped to programmes but can be queried cross-programme for reuse insights
Admin roles are scoped per-programme with super-admin access for cross-programme governance
Geographic Expansion:

Cloud Run supports multi-region deployment with global load balancing
Firestore multi-region configurations ensure low-latency access across ASEAN, EU, and other target regions
Linkage templates and cohort patterns learned in one region can be replicated to new programmes
Cost Efficiency at Scale:

Cloud Run scales to zero during off-peak hours — critical for ecosystem platforms with bursty usage patterns
Firestore's pay-per-operation model means costs grow linearly with actual usage, not provisioned capacity
Gemini API calls are batched and cached where appropriate to minimize token costs
Data Growth Strategy:

Linkage history is archived to Cloud Storage (cold tier) after programme completion
Active linkages remain in Firestore for real-time querying
BigQuery integration planned for cross-programme analytics and AI model improvement
Responsible AI & Ethics
Syncra integrates AI as a core decision-support layer for ecosystem coordination. We implement the following safeguards to ensure responsible, transparent, and fair AI usage:

Hallucination Mitigation
Technique	Implementation
Context Grounding	Every AI response is grounded in real ecosystem data — the full entity graph (mentors, companies, partners, linkages) is injected into each prompt as structured context
ID Validation	AI-generated cohort proposals are post-processed to validate all entity IDs against the actual ecosystem database. Invalid references are stripped before reaching the user
Low Temperature	Generation temperature is set to 0.25–0.35 to minimize creative hallucination while maintaining natural language quality
Structured Output Enforcement	Cohort generation requires strict JSON schema compliance. Malformed outputs trigger graceful fallback to pre-validated proposals
Fallback Responses	When AI confidence is low or the service is unavailable, deterministic rule-based responses ensure the platform never surfaces unreliable information
Bias Awareness & Fairness
Scoring Transparency: Ecosystem entity scores are derived from verifiable signals (compliance status, engagement history, capacity metrics) — not opaque AI judgments
Human-in-the-Loop Governance: AI-generated cohort proposals require explicit admin approval before activation. The AI recommends; humans decide
Balanced Matching: Mentor-company matching considers capacity load (currentLoad/maxLoad) to prevent over-allocation and ensure equitable distribution of mentorship resources
No Demographic Profiling: Matching is based solely on expertise alignment, capacity, and programme needs — never on demographic attributes
Privacy & Data Protection
Minimal Data Exposure: AI prompts contain only the minimum ecosystem context needed for the specific query — no raw personal data or credentials are sent to the model
No Training Data Leakage: Syncra uses the Gemini API in inference-only mode. Ecosystem data is never used to train or fine-tune Google's models
Role-Based Information Scoping: Founders see only their own venture context; Admins see governance-level data. The AI respects these boundaries in its responses
Transparency
Source Attribution: Every AI response is tagged with its generation source (gemini or fallback) so users and admins know whether they're seeing AI-generated or rule-based content
Explainable Recommendations: Cohort proposals include a logic field explaining the AI's reasoning in plain language
Intent Classification: The system classifies user intent before routing to AI, ensuring appropriate response modes and reducing irrelevant or off-topic outputs
Tech Stack
Component	Technology	Purpose
Frontend	React 19, TypeScript, Tailwind CSS v4, Framer Motion	Responsive, animated UI with role-based views
Backend	FastAPI, Python 3.10+	High-performance async REST API
AI Engine	Google Gemini 2.5 Flash	Context-aware chat, cohort generation, intent classification
Proxy	Express.js	Frontend-to-backend routing in development and production
Styling	shadcn/ui components	Consistent, accessible design system
Quick Start
Prerequisites
Python 3.10+
Node.js 18+
Google Gemini API key
Backend
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # Add your GEMINI_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
The app will be available at http://localhost:3000.

API Endpoints
Method	Endpoint	Description
GET	/api/ecosystem	Full ecosystem entity graph
GET	/api/mentors	Mentor directory
GET	/api/resources	Ecosystem resources
POST	/api/ai/chat	AI assistant (role-aware)
POST	/api/ai/generate-cohort	AI cohort proposal generation
GET	/health	Service health check
Team
Murtabak - Build With AI 2026 KL
