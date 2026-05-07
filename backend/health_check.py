import requests
import os
import re
from datetime import datetime, timedelta

# Manually load variables from .env to ensure they are available
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

load_env()

def test_layer1_rule_based():
    print("\n--- Testing Layer 1: Rule-Based (Regex) ---")
    sample_text = "The respondent is directed to file an affidavit within 15 days. Failure may lead to contempt."
    
    # Mocking extraction logic from ai_service.py
    keywords = ["directed", "ordered", "shall", "must"]
    found_actions = [s.strip() for s in re.split(r'[.\n]', sample_text) if any(k in s.lower() for k in keywords)]
    
    match = re.search(r'within (\d+) (day|days)', sample_text.lower())
    deadline = None
    if match:
        value = int(match.group(1))
        deadline = (datetime.now() + timedelta(days=value)).strftime("%Y-%m-%d")

    consequence = "Failure may lead to contempt" if "contempt" in sample_text.lower() else None

    if found_actions and deadline and consequence:
        print(f"[OK] Layer 1 working")
        print(f"   Action extracted: '{found_actions[0]}'")
        print(f"   Deadline extracted: {deadline}")
        print(f"   Consequence detected: {consequence}")
    else:
        print("[FAIL] Layer 1 extraction failed to match patterns.")

def test_layer2_ollama():
    print("\n--- Testing Layer 2: Ollama (Local AI) ---")
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "qwen2.5")
    
    print(f"Targeting: {base_url} (Model: {model})")
    
    try:
        response = requests.post(
            f"{base_url}/api/generate",
            json={
                "model": model,
                "prompt": "Say hello in one sentence",
                "stream": False
            },
            timeout=5
        )
        if response.status_code == 200:
            resp_text = response.json().get("response", "")
            print(f"[OK] Layer 2 working: {resp_text}")
        else:
            print(f"[FAIL] Layer 2 (Ollama) returned status code: {response.status_code}")
    except Exception as e:
        print(f"[FAIL] Layer 2 (Ollama) connection failed: {str(e)}")
        print("   (Note: This requires Ollama to be running locally on your machine)")

def test_openrouter():
    print("\n--- Testing Layer 3: OpenRouter (Cloud AI) ---")
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        print("[FAIL] API key missing in .env")
        return

    url = "https://openrouter.ai/api/v1/chat/completions"

    payload = {
        "model": "google/gemma-3-4b-it",
        "messages": [
            {"role": "user", "content": "Say hello in one sentence"}
        ]
    }

    try:
        response = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=10
        )

        print("Status Code:", response.status_code)

        if response.status_code == 200:
            data = response.json()
            message = data["choices"][0]["message"]["content"]
            # Safely print for Windows terminal
            print("Extracted Text:", message.encode('ascii', 'replace').decode())
            print("[OK] Layer 3 (OpenRouter) working")
        else:
            print(f"[FAIL] Layer 3 (OpenRouter) failed with status {response.status_code}")
            print("Response:", response.text)

    except Exception as e:
        print("[FAIL] Layer 3 Error:", str(e))

if __name__ == "__main__":
    print("Starting 3-Layer Health Check for NyayaLens AI Service")
    test_layer1_rule_based()
    test_layer2_ollama()
    test_openrouter()
