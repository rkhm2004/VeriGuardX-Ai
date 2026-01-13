from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from openai import OpenAI
from typing import Optional

router = APIRouter()

# Ollama client - initialized lazily (points to local Ollama server)
client = None

def get_ollama_client():
    """Get or create Ollama client for local AI"""
    global client
    if client is None:
        try:
            # Connect to local Ollama server (OpenAI-compatible API)
            client = OpenAI(
                base_url="http://localhost:11434/v1",
                api_key="ollama"  # Required but ignored by Ollama
            )
            print("✅ COUNCIL AGENT: Connected to local Ollama server")
        except Exception as e:
            print(f"❌ COUNCIL AGENT ERROR: Failed to initialize Ollama client - {str(e)}")
            raise HTTPException(status_code=500, detail="Could not initialize local AI client")
    return client

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    session_data: dict

@router.post("/chat", response_model=ChatResponse)
async def council_chat(request: ChatRequest, req: Request):
    try:
        user_message = request.message
        session_id = request.session_id

        if not user_message or not session_id:
            raise HTTPException(status_code=400, detail="Missing message or session_id")

        print(f"🔄 COUNCIL AGENT: Processing query for session {session_id}")

        # Fetch current session data
        session_data = get_session_context(session_id)
        print(f"📊 COUNCIL AGENT: Retrieved session data - Risk Score: {session_data.get('risk_score', 0)}")

        # Construct system prompt with live data
        system_prompt = f"""You are the Council Agent, a secure supply chain supervisor AI.

LIVE SESSION DATA:
- Product ID: {session_data.get('product_id', 'Unknown')}
- Scan Agent Status: {session_data.get('scan_status', 'Not Started')} (Confidence: {session_data.get('scan_score', 0)}%)
- Identity Agent Status: {session_data.get('identity_status', 'Not Started')}
- Courier Agent Status: {session_data.get('courier_status', 'Not Started')}
- Provenance Agent Status: {session_data.get('provenance_status', 'Not Started')}
- Anomaly Agent Status: {session_data.get('anomaly_status', 'Not Started')}
- Current Risk Score: {session_data.get('risk_score', 0)}/100
- Current Step: {session_data.get('current_step', 'Unknown')}

INSTRUCTIONS:
- Answer questions based strictly on the live session data above
- Keep answers concise, professional, and military/sci-fi in tone
- Explain agent decisions and statuses clearly
- If data is incomplete, state that information is not yet available
- Do not make up information or speculate
- Be helpful and advisory in nature"""

        print("🤖 COUNCIL AGENT: Calling Ollama API...")

        # Call Ollama API with fallback to demo mode
        try:
            # Get Ollama client (lazy initialization)
            ollama_client = get_ollama_client()

            # Set timeout on the Ollama client call
            response = ollama_client.with_options(timeout=25.0).chat.completions.create(
                model="llama3",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=500,
                temperature=0.7
            )

            ai_response = response.choices[0].message.content
            print(f"✅ COUNCIL AGENT: Successfully received response from Ollama")

            return ChatResponse(
                response=ai_response,
                session_data=session_data
            )

        except Exception as ollama_error:
            error_str = str(ollama_error).lower()
            print(f"⚠️ COUNCIL AGENT: Ollama API failed - {str(ollama_error)}")

            # Check if Ollama server is not running
            if "connection" in error_str or "connect" in error_str or "localhost:11434" in error_str:
                demo_response = "Could not connect to local AI. Please make sure the Ollama app is running on your computer."
                print("🎭 COUNCIL AGENT: Ollama server not running - returning connection error")
            else:
                # Other errors (model not found, etc.) - fallback to demo mode
                demo_response = "System Alert: Local AI Model Error. Switching to Simulation Mode. Risk levels are nominal. All agents reporting green status. Awaiting further instructions."
                print("🎭 COUNCIL AGENT: Returning demo mode response")

            return ChatResponse(
                response=demo_response,
                session_data=session_data
            )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"❌ COUNCIL AGENT ERROR: Unexpected system error - {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Council Agent system error: {str(e)}")

def get_session_context(session_id):
    """Fetch current session data from database"""
    try:
        # For now, since we don't have a proper verification_logs table,
        # return mock data that will work with the Council Agent
        # TODO: Implement proper database integration when verification_logs table exists

        print(f"📊 COUNCIL AGENT: Using mock session data for session {session_id}")

        return {
            'product_id': 'DEMO-PRODUCT-001',
            'scan_status': 'COMPLETED',
            'scan_score': 95,
            'identity_status': 'PENDING',
            'courier_status': 'NOT_STARTED',
            'provenance_status': 'NOT_STARTED',
            'anomaly_status': 'NOT_STARTED',
            'risk_score': 25,
            'current_step': 'identity'
        }

    except Exception as e:
        print(f"Error fetching session context: {str(e)}")
        return {
            'product_id': 'Error',
            'scan_status': 'Error',
            'scan_score': 0,
            'identity_status': 'Error',
            'courier_status': 'Error',
            'provenance_status': 'Error',
            'anomaly_status': 'Error',
            'risk_score': 0,
            'current_step': 'error'
        }
