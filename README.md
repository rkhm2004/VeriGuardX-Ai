<img width="2861" height="158" alt="image" src="https://github.com/user-attachments/assets/4d44dd75-107a-4591-90ba-ae210ee09a3a" /># VeriGuardX-AI

## Problem Statement

Counterfeit parts pose a significant threat to supply chains, leading to financial losses, safety risks, and compromised product integrity. Traditional detection methods rely on simple QR scans or basic checks, which can be easily bypassed. There is a need for a multi-layered, intelligent system that combines digital identity verification, physical perception through AI vision, and stateful logic to enforce sequential checkpoints and prevent counterfeiting at every stage of the supply chain.

## Solution Description

The AI Trust & Safety Command Center is a multi-agentic system designed to prevent counterfeit parts from entering supply chains. It integrates **Digital Identity** using cryptographic verification, **Physical Perception** via Vision AI for visual audits, and **Stateful Logic** through rolling checkpoints that enforce sequential progression. Unlike traditional scanners, this system uses a "Rolling State" where parts must pass checkpoints in order and employs a "Visual Council" (LLM) to audit parts when digital tags fail. The architecture demonstrates "Agentic AI" and "Automation" through specialized agents working in concert, orchestrated by n8n workflows.

## Agent Workflow

The system operates through a series of specialized agents, each handling distinct verification tasks:

### 1. Scan Agent (The Gatekeeper)
- Identifies input method and routes the workflow
- If QR_Code is valid → Trigger Digital Audit Path
- If QR_Code is missing/damaged → Trigger Visual Audit Path

### 2. Provenance Agent (The Navigator)
- Enforces "Rolling Checkpoint" logic
- Checks parts ledger to ensure Current_Location matches Allowed_Location
- Updates database state upon successful verification

### 3. Identity Agent (The Crypto Detective)
- Validates mathematical legitimacy through cryptographic signatures
- Verifies Serial ID against OEM public key ledger

### 4. Anomaly Agent (The Pattern Hunter)
- Detects "Clone Attacks" and "Impossible Travel" patterns
- Uses statistical logic to identify suspicious activities (e.g., same Serial # scanned in multiple locations simultaneously)

### 5. LogiGuard Agent (The Human Verifier)
- Verifies the physical carrier's authorization
- Checks Courier ID against shift schedules and authorized regions

### 6. Council Supervisor (The Judge)
- Synthesizes conflicts and performs Visual Audits
- Uses Generative AI to resolve discrepancies and analyze visual data

### Master Logic Flow
1. **Intake Phase**: Courier check and part scan
2. **Digital Audit (Path A)**: Provenance, Identity, and Anomaly parallel checks
3. **Visual Audit (Path B)**: User input, database fetch, and LLM analysis
4. **Dynamic Rerouting**: Admin ability to change destinations
5. **Final Verdict**: Risk aggregation and natural language explanation

## Tech Stack Used

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (React) + Tailwind + Shadcn/UI** | User interface for scanning, dashboarding, and manual audits |
| **Reasoning Engine** | **Ollama** (Llama 3.2 / Mistral) | Local AI brain for Council Agent and visual analysis |
| **Specialist Tools** | **Python (FastAPI)** | Heavy computation, crypto signatures, statistical detection |
| **Visual AI** | **Llama 3.2 Vision** (via Ollama) | Image analysis for visual discrepancies |
| **Database** | **PostgreSQL / SQLite** | Memory storage for Rolling State, Visual Ground Truth, and Audit Logs |

## Project Structure

```
VeriGuardX-AI/
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── counterfeit_detection.db
│   ├── database.db
│   ├── init_db.py
│   ├── requirements.txt
│   ├── test_fullstack.py
│   ├── test_grok.py
│   ├── test_integration.py
│   ├── test_pipeline.py
│   ├── test_resilience.py
│   └── app/
│       ├── council.py
│       ├── main.py
│       ├── models.py
│       ├── agents/
│       │   ├── anomaly_agent.py
│       │   ├── courier_agent.py
│       │   ├── identity_agent.py
│       │   ├── logic.py
│       │   ├── marketplace_agent.py
│       │   ├── provenance_agent.py
│       │   ├── risk_agent.py
│       │   ├── scan_agent.py
│       │   └── security.py
│       ├── data/
│       │   └── supply_chain.db
│       ├── database/
│       │   ├── schema.sql
│       │   └── seed_data.py
│       └── tools/
│           ├── db.py
│           ├── ledger.py
│           ├── security.py
│           └── vision.py
└── frontend/
    ├── components.json
    ├── next-env.d.ts
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.tsbuildinfo
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── agents/
    │   │   ├── anomaly/
    │   │   │   └── page.tsx
    │   │   ├── council/
    │   │   │   └── page.tsx
    │   │   ├── courier/
    │   │   │   └── page.tsx
    │   │   ├── identity/
    │   │   │   └── page.tsx
    │   │   ├── provenance/
    │   │   │   └── page.tsx
    │   │   ├── risk/
    │   │   │   └── page.tsx
    │   │   └── scan/
    │   │       └── page.tsx
    │   ├── anomaly/
    │   │   └── page.tsx
    │   ├── chat/
    │   │   └── page.tsx
    │   ├── council/
    │   │   └── page.tsx
    │   ├── courier/
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── home/
    │   │   └── page.tsx
    │   ├── identity/
    │   │   └── page.tsx
    │   ├── provenance/
    │   │   └── page.tsx
    │   ├── risk/
    │   │   └── page.tsx
    │   ├── scan/
    │   │   └── page.tsx
    │   └── visual/
    │       └── page.tsx
    ├── components/
    │   ├── agent-card.tsx
    │   ├── composite-security-badge.tsx
    │   ├── council-chat.tsx
    │   ├── courier-badge.tsx
    │   ├── map-visualizer.tsx
    │   ├── ProductIdentityCard.tsx
    │   ├── scan-input-card.tsx
    │   ├── verification-roadmap.tsx
    │   └── ui/
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── progress.tsx
    │       └── tabs.tsx
    └── lib/
        ├── api.ts
        ├── types.ts
        ├── utils.ts
        └── contexts/
            └── VerificationContext.tsx
```

## Setup and Execution Steps

### Prerequisites
- Python 3.8+
- Node.js 18+
- Ollama (for local AI models)
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables (copy and modify `.env.example` to `.env` if needed)
4. Run the backend server:
   ```
   python app/main.py or uvicorn app.main:app --reload
   ```
   The server will start on port 5000.

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install Node.js dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
   The frontend will be available on port 3001.

### Ollama Setup
1. Install Ollama from https://ollama.ai/
2. Pull required models:
   ```
   ollama pull llama3
   ollama pull moondream
   ```

### Running the Application
1. Ensure Ollama is running in the background
2. Start the backend server (port 5000)
3. Start the frontend server (port 3001)
4. Access the application at `http://localhost:3001`

### Database Initialization
- The application uses SQLite by default for simplicity
- Database files are created automatically on first run
- For production, configure PostgreSQL in the environment variables

## Prototype Link

[VeriGuardX-AI Repository](https://github.com/rkhm2004/VeriGuardX-Ai.git) || 
[Demo Video Link](https://drive.google.com/file/d/1bg8T9YsxWqq0hXoB5PJ3tfU-x15p1mxe/view?usp=sharing)

---

## Database Schema

### Table: `parts_ledger` (Live State)
Tracks where the item *is* and where it *should be*.
```sql
CREATE TABLE parts_ledger (
    part_id TEXT PRIMARY KEY,
    serial_hash TEXT,          -- For Identity Agent verification
    current_stage TEXT,        -- e.g., "HUB_A"
    next_allowed TEXT,         -- e.g., "HUB_B" (The Rolling Lock)
    route_plan JSON,           -- ["FACTORY", "HUB_A", "HUB_B", "STORE"]
    visual_model_id TEXT,      -- Foreign key to visual specs
    status TEXT                -- "ACTIVE", "FLAGGED", "STOLEN"
);
