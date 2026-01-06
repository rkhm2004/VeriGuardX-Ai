# Integration Guide: Frontend, Backend, n8n, and Ollama

This guide explains how to wire the components together locally.

1) Backend

- Create a Python 3.11 virtual environment (recommended). On Windows:

```powershell
py -3.11 -m venv .venv311
.\.venv311\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

- If `psycopg2-binary` fails to build and you don't use Postgres locally, remove it from `backend/requirements.txt` before installing.

- Initialize DB (SQLite default):

```powershell
cd backend
python -m app.tools.db init_db
# or
python app/database/seed_data.py
```

- Start the server:

```powershell
python -m uvicorn app.main:app --reload
```

2) Frontend

- Ensure `frontend/.env.local` contains:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- Install and run:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

3) n8n (optional orchestration)

- Import `n8n_workflows/scan_forward_workflow.json` into your n8n instance.
- Configure a Webhook node with path `scan-webhook` and an HTTP Request node that POSTs to `http://localhost:8000/api/scan`.

4) Ollama (local LLM)

- Run Ollama locally and set `OLLAMA_BASE_URL` in backend `.env` if not default.
- The backend `app/tools/vision.py` contains `OllamaVision` with `analyze_image`, `compare_visual_description`, and `synthesize_verdict` functions. The backend will call `http://localhost:11434/api/generate` by default.

5) Testing flow

- Start backend and frontend.
- Open the frontend UI and perform a scan; the frontend will call the backend `/api/scan` endpoint which runs agents and returns a verdict.

Troubleshooting

- If the backend fails importing `sqlalchemy` with Python 3.13, create a venv with Python 3.11.
- If `pg_config` is missing for `psycopg2-binary`, either install PostgreSQL dev tools or remove `psycopg2-binary` from `requirements.txt` and use SQLite.

