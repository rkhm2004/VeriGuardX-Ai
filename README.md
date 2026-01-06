# AI Trust & Safety Command Center: Master Blueprint
### Agentic AI-Enabled Counterfeit Parts Detection System

## 1. Project Concept
A multi-agentic system that prevents counterfeit parts from entering supply chains by combining **Digital Identity** (Crypto), **Physical Perception** (Vision AI), and **Stateful Logic** (Rolling Checkpoints).

**Core Innovation:** Unlike simple scanners, this system enforces a "Rolling State" (a part must pass checkpoints in order) and uses a "Visual Council" (LLM) to audit parts when digital tags fail.

---

## 2. The Tech Stack
This architecture demonstrates "Agentic AI" and "Automation" rather than simple scripts.

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (React) + Tailwind + Shadcn/UI** | The user interface for scanning, dashboarding, and manual audits. |
| **Orchestrator** | **n8n** (Self-hosted or Cloud) | The "Central Nervous System." Receives data from frontend and routes it to agents. |
| **Reasoning Engine** | **Ollama** (Llama 3.2 / Mistral) | The "Brain." Runs locally for privacy. Powers the Council Agent and visual analysis. |
| **Specialist Tools** | **Python (FastAPI)** | The "Calculator." Handles heavy math, crypto signatures, and statistical anomaly detection. |
| **Visual AI** | **Llama 3.2 Vision** (via Ollama) | The "Eyes." Analyzes photos of parts/invoices for visual discrepancies. |
| **Database** | **PostgreSQL / SQLite** | The "Memory." Stores Rolling State (location), Visual Ground Truth, and Audit Logs. |

---

## 3. The Agent Roster
Each agent has a distinct role and technology implementation.

### 1. 🕵️‍♂️ Scan Agent (The Gatekeeper)
* **Role:** Identifies input method and routes the workflow.
* **Logic:**
    * If `QR_Code` is valid → Trigger **Path A (Digital Audit)**.
    * If `QR_Code` is missing/damaged → Trigger **Path B (Visual Audit)**.

### 2. 🗺️ Provenance Agent (The Navigator)
* **Role:** Enforces "Rolling Checkpoint" logic.
* **Tech:** Python Tool + Database.
* **Logic:** Checks `parts_ledger`. Ensures `Current_Location` == `Allowed_Location`.
    * *Action:* If valid, updates DB to "Received" and sets next allowed stage.

### 3. 🔐 Identity Agent (The Crypto Detective)
* **Role:** Validates mathematical legitimacy.
* **Tech:** Python Tool.
* **Logic:** Verifies cryptographic signature of the Serial ID against OEM public key ledger.

### 4. 📊 Anomaly Agent (The Pattern Hunter)
* **Role:** Detects "Clone Attacks" and "Impossible Travel".
* **Tech:** Python Tool (Statistical Logic).
* **Logic:** "Was this Serial # scanned in Tokyo 5 minutes ago? If yes, this part in Berlin is a clone."

### 5. 👤 Courier Agent (The Human Verifier)
* **Role:** Verifies the physical carrier.
* **Tech:** Database Logic.
* **Logic:** Checks Courier ID against shift schedule and authorized region.

### 6. ⚖️ Council Supervisor (The Judge)
* **Role:** Synthesizes conflicts and performs Visual Audits.
* **Tech:** Generative AI (Ollama LLM).
* **Logic:**
    * *Conflict Resolution:* "Identity Passed but Anomaly Failed" → **Verdict: Clone.**
    * *Visual Audit:* Compares User Description ("Shiny Black") vs Database Truth ("Matte Black") → **Verdict: Fake.**

---

## 4. Master Logic Flow (n8n Workflow)

### Phase 1: The Intake (Human Layer)
1.  **Courier Check:** User scans Courier Badge.
    * *Result:* Verified or Unauthorized.
2.  **Part Scan:** User scans the box.
    * *Branch:* Go to **Path A** (Digital) or **Path B** (Visual).

### Phase 2: The Digital Audit (Path A - QR Valid)
1.  **Provenance Check:**
    * Query DB: Is part allowed at this Hub?
    * *Pass:* Update DB state (Lock out previous location).
    * *Fail:* Flag "Sequence Violation".
2.  **Parallel Checks:**
    * **Identity:** Verify Serial Hash.
    * **Anomaly:** Check timestamp/velocity.

### Phase 3: The Visual Audit (Path B - QR Failed)
1.  **User Input:** User takes photo or types description ("Black box, 3 rivets").
2.  **Database Fetch:** System pulls "Visual Ground Truth" for that Model ID.
3.  **LLM Analysis:**
    * *Prompt:* "Compare User Input vs Ground Truth. Are they the same?"
    * *Result:* Pass/Fail based on visual similarity.

### Phase 4: Dynamic Rerouting (Admin Action)
* **Action:** Admin clicks "Reroute" to change destination.
* **Logic:** System updates `active_routes` table in DB.
* **Result:** Provenance Agent now accepts the *new* location as valid.

### Phase 5: Final Verdict
1.  **Risk Agent:** Aggregates scores. (Critical failure in Anomaly = Critical Risk).
2.  **Council Agent:** Generates natural language explanation for the user.

---

## 5. Database Schema (The "Memory")

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
