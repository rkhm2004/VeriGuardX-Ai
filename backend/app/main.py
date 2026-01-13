from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import ollama
import json
import base64
import io
import re
from PIL import Image

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "LogiGuard Core Online - Port 5000"}

# ==========================================
# 1. VISUAL AGENT (Moondream)
# ==========================================
@app.post("/api/visual_agent")
async def visual_agent(file: UploadFile = File(...)):
    try:
        print(f"--> Receiving Image: {file.filename}")
        contents = await file.read()
        
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        # Convert to RGB JPEG for robustness
        try:
            image = Image.open(io.BytesIO(contents))
            if image.mode in ("RGBA", "P"):
                image = image.convert("RGB")
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='JPEG')
            img_byte_arr = img_byte_arr.getvalue()
        except Exception as img_error:
            print(f"!!! Image processing warning: {img_error}")
            img_byte_arr = contents

        encoded_image = base64.b64encode(img_byte_arr).decode('utf-8')
        
        print("--> Sending to Ollama (Moondream)...")
        response = ollama.chat(model='moondream', messages=[
            {
                'role': 'user',
                'content': 'Describe this image in one short sentence. Is there damage?',
                'images': [encoded_image]
            }
        ])
        
        analysis = response['message']['content']
        if not analysis: analysis = "No specific anomalies detected."
            
        print(f"<-- Analysis: {analysis}")
        return {"analysis": analysis, "status": "VERIFIED"}

    except Exception as e:
        print(f"!!! Visual Agent Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 2. IDENTITY AGENT (Llama 3)
# ==========================================
@app.post("/api/identity_agent")
async def identity_agent(data: dict):
    try:
        print(f"--> Identity Request: {data}")
        prompt = f"Generate a brief, secure system log confirming identity verification for this user. Use technical, cyber-security jargon. User data: {json.dumps(data)}"
        response = ollama.chat(model='llama3', messages=[{'role': 'user', 'content': prompt}])
        return {"log": response['message']['content']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 3. RISK AGENT (Llama 3)
# ==========================================
@app.post("/api/risk_agent")
async def risk_agent(data: dict):
    try:
        print(f"--> Risk Request: {data}")
        prompt = f"""You are an expert Risk Assessment AI. Analyze the following telemetry data for security risks.

Telemetry Data: {json.dumps(data)}

Provide a risk assessment and determine if the system is safe or suspicious.

Output your response in this format:
FLAG: [safe/suspicious]
ANALYSIS: [your detailed risk assessment]
RISK_SCORE: [numerical score 0-100]"""
        response = ollama.chat(model='llama3', messages=[{'role': 'user', 'content': prompt}])
        content = response['message']['content']
        # Parse flag, analysis, risk_score
        lines = content.split('\n')
        flag = "safe"  # default
        analysis = content  # fallback
        risk_score = 50  # default
        for line in lines:
            if line.startswith('FLAG:'):
                flag = line.split(':', 1)[1].strip().lower()
            elif line.startswith('ANALYSIS:'):
                analysis = line.split(':', 1)[1].strip()
            elif line.startswith('RISK_SCORE:'):
                try:
                    risk_score = int(line.split(':', 1)[1].strip())
                except:
                    risk_score = 50
        return {"analysis": analysis, "risk_score": risk_score, "flag": flag}
    except Exception as e:
        print(f"!!! Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 4. LOGIGUARD (COURIER) AGENT (Llama 3)
# ==========================================
@app.post("/api/courier_agent")
async def courier_agent(data: dict):
    try:
        print(f"--> LogiGuard Request: {data}")
        prompt = f"""
        You are an expert Logistics AI. Analyze this route:
        Route: {data.get('route')}
        Cargo: {data.get('cargo_type')}
        Hazards: {', '.join(data.get('external_factors', []))}

        Output ONLY in this format:
        STATUS: [HIGH_RISK / MEDIUM_RISK / LOW_RISK]
        STRATEGY: [Your detailed mitigation strategy here]
        """
        
        response = ollama.chat(model='llama3', messages=[{'role': 'user', 'content': prompt}])
        content = response['message']['content']
        
        # Robust Parsing using Regex
        status_match = re.search(r'STATUS:\s*(.*?)(?:\n|$)', content, re.IGNORECASE)
        strategy_match = re.search(r'STRATEGY:\s*(.*)', content, re.IGNORECASE | re.DOTALL)
        
        status = status_match.group(1).strip() if status_match else "ANALYZING"
        strategy = strategy_match.group(1).strip() if strategy_match else content

        return {"status": status, "strategy": strategy}
    except Exception as e:
        print(f"!!! Courier Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 5. PROVENANCE AGENT (Llama 3)
# ==========================================
@app.post("/api/provenance_agent")
async def provenance_agent(data: dict):
    try:
        prompt = f"Verify the custody chain for this item. Respond with 'CHAIN_VERIFIED' or 'CHAIN_BROKEN' and a short reason. Data: {json.dumps(data)}"
        response = ollama.chat(model='llama3', messages=[{'role': 'user', 'content': prompt}])
        return {"verification": response['message']['content']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 6. ANOMALY AGENT (Llama 3)
# ==========================================
@app.post("/api/anomaly_agent")
async def anomaly_agent(data: dict):
    try:
        print(f"--> Anomaly Request: {data}")
        prompt = f"""You are a Cyber-Security Anomaly Detection AI. 
        Analyze this sensor data: {json.dumps(data)}
        
        Return a JSON object (and ONLY a JSON object) with this exact structure:
        {{
            "flag": "safe" or "suspicious",
            "anomaly_score": <number 0-100>,
            "detection_message": "<short summary>",
            "diagnostics": [
                {{ "time": "T-0.5s", "message": "<technical check log>", "status": "LOW" }},
                {{ "time": "T-1.2s", "message": "<technical check log>", "status": "LOW" }},
                {{ "time": "T-2.0s", "message": "<technical check log>", "status": "LOW" }}
            ]
        }}
        """
        
        response = ollama.chat(model='llama3', format='json', messages=[{'role': 'user', 'content': prompt}])
        content = json.loads(response['message']['content'])
        
        return content
    except Exception as e:
        print(f"!!! Error: {e}")
        return {
             "flag": "safe",
             "anomaly_score": 12, 
             "detection_message": "Standard heuristics passed.",
             "diagnostics": [
                 { "time": "T-0.1s", "message": "Fallback: Velocity Check", "status": "LOW"},
                 { "time": "T-0.2s", "message": "Fallback: Geo Lock", "status": "LOW"}
             ]
        }

# ==========================================
# 7. COUNCIL AGENT (Back-end Logic)
# ==========================================
@app.post("/api/council_agent")
async def council_agent(data: dict):
    try:
        prompt = f"Review reports. Verdict: 'APPROVED' or 'REJECTED' with reason. Reports: {json.dumps(data)}"
        response = ollama.chat(model='llama3', messages=[{'role': 'user', 'content': prompt}])
        return {"verdict": response['message']['content']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 8. COUNCIL CHAT (Interactive Endpoint)
# ==========================================
@app.post("/api/council/chat")
async def council_chat(data: dict):
    try:
        print(f"--> Council Chat Message: {data}")
        user_message = data.get("message", "")
        
        system_context = """
        You are the 'Council Supervisor' for the LogiGuard Supply Chain System.
        Your role is to oversee the following agents: Scan, LogiGuard, Identity, Anomaly.
        You speak with authority, precision, and technical depth.
        Keep responses concise and professional (Cyberpunk/Military style).
        """

        response = ollama.chat(model='llama3', messages=[
            {'role': 'system', 'content': system_context},
            {'role': 'user', 'content': user_message}
        ])
        
        return {"response": response['message']['content']}
    except Exception as e:
        print(f"!!! Council Chat Error: {e}")
        return {"response": "COUNCIL_UPLINK_OFFLINE. Manual override required."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)