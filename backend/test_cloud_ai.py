import os
import requests
from dotenv import load_dotenv

load_dotenv(override=True)

def test_openrouter():
    print("\n--- Testing OpenRouter (Cloud AI) ---")
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    model = os.getenv("OPENROUTER_MODEL", "google/gemma-3-4b-it")

    if not api_key:
        print("[FAIL] OpenRouter API key missing")
        return

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Say 'OpenRouter is working' in one sentence."}]
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            msg = response.json()["choices"][0]["message"]["content"]
            print(f"[OK] OpenRouter response: {msg.strip()}")
        else:
            print(f"[FAIL] OpenRouter failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[FAIL] OpenRouter Error: {str(e)}")

def test_openai():
    print("\n--- Testing OpenAI (Legacy Cloud AI) ---")
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    model = os.getenv("OPENAI_MODEL", "gpt-4o-min")

    if not api_key:
        print("[FAIL] OpenAI API key missing")
        return

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Say 'OpenAI is working' in one sentence."}]
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            msg = response.json()["choices"][0]["message"]["content"]
            print(f"[OK] OpenAI response: {msg.strip()}")
        else:
            print(f"[FAIL] OpenAI failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[FAIL] OpenAI Error: {str(e)}")

if __name__ == "__main__":
    test_openrouter()
    test_openai()
