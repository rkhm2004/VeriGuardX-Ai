#!/usr/bin/env python3
"""
Grok API Integration Test Script
Tests connectivity to xAI's Grok API for advanced reasoning
"""

import os
import sys
import httpx
from dotenv import load_dotenv

load_dotenv()

def test_grok_api():
    """Test Grok API connectivity and response"""
    print("🤖 Testing Grok API Integration...")

    # Get API key from environment
    api_key = os.getenv("XAI_API_KEY")
    if not api_key:
        print("❌ FAILURE: XAI_API_KEY not found in environment variables")
        print("   Please set XAI_API_KEY in your .env file")
        return False

    # Sample prompt for testing
    test_prompt = "Analyze risk for this supply chain transaction: A high-value electronic component (worth $1500) is being shipped from an unauthorized warehouse location to a new destination not in the approved route plan. What risk level would you assign and why?"

    # Grok API endpoint
    url = "https://api.x.ai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "grok-beta",  # Use the beta model or appropriate model name
        "messages": [
            {
                "role": "user",
                "content": test_prompt
            }
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }

    try:
        print("📡 Sending request to Grok API...")
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            data = response.json()

            # Check if we got a valid response
            if "choices" in data and len(data["choices"]) > 0:
                content = data["choices"][0]["message"]["content"]
                print("✅ SUCCESS: Grok API responded successfully!")
                print(f"   Response length: {len(content)} characters")
                print(f"   Sample response: {content[:200]}...")

                # Check if response contains risk analysis keywords
                risk_keywords = ["risk", "high", "medium", "low", "critical", "suspicious"]
                has_risk_analysis = any(keyword.lower() in content.lower() for keyword in risk_keywords)

                if has_risk_analysis:
                    print("✅ SUCCESS: Response contains risk analysis content")
                    return True
                else:
                    print("⚠️  WARNING: Response may not contain expected risk analysis")
                    return True  # Still consider it success since API worked
            else:
                print(f"❌ FAILURE: Unexpected response format: {data}")
                return False

        elif response.status_code == 401:
            print("❌ FAILURE: Invalid API key (401 Unauthorized)")
            return False

        elif response.status_code == 429:
            print("❌ FAILURE: Rate limit exceeded (429 Too Many Requests)")
            return False

        else:
            print(f"❌ FAILURE: HTTP {response.status_code} - {response.text}")
            return False

    except httpx.TimeoutException:
        print("❌ FAILURE: Request timed out")
        return False

    except Exception as e:
        print(f"❌ FAILURE: Exception during API call: {str(e)}")
        return False

def main():
    """Run Grok API test"""
    print("🚀 Testing xAI Grok API Integration\n")

    success = test_grok_api()

    print("\n📊 Test Result:")
    if success:
        print("✅ PASS: Grok API is reachable and responding")
        print("🎉 Ready to integrate Grok for advanced logic reasoning!")
        return 0
    else:
        print("❌ FAIL: Grok API test failed")
        print("💡 Check your XAI_API_KEY and network connectivity")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
