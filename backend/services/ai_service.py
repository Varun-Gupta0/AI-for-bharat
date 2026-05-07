"""
AI Service – Step 3 (Rule-Based Replacement)

Rule-based extraction engine that converts legal text into structured data WITHOUT using AI.
"""

import re
from dotenv import load_dotenv
import os
import logging
import requests
from datetime import datetime, timedelta

load_dotenv(override=True)
logger = logging.getLogger(__name__)

# -------------------------
# DEADLINE EXTRACTION
# -------------------------

def extract_deadline(text):
    text = text.lower()

    # within X days/weeks/months
    match = re.search(r'within (\d+) (day|days|week|weeks|month|months)', text)
    if match:
        value = int(match.group(1))
        unit = match.group(2)

        if "week" in unit:
            value *= 7
        elif "month" in unit:
            value *= 30

        return (datetime.now() + timedelta(days=value)).strftime("%Y-%m-%d")

    # specific date (e.g., 15 June 2023)
    match = re.search(r'(\d{1,2}\s+[a-zA-Z]+\s+\d{4})', text)
    if match:
        return match.group(1)
        
    # on or before DATE
    match = re.search(r'on or before\s+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})', text)
    if match:
        return match.group(1)
        
    # by DATE
    match = re.search(r'by\s+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})', text)
    if match:
        return match.group(1)

    return None


# -------------------------
# ACTION EXTRACTION
# -------------------------

def extract_actions(text):
    sentences = re.split(r'[.\n]', text)

    keywords = ["directed", "ordered", "shall", "must"]

    actions = []

    for sentence in sentences:
        for k in keywords:
            if k in sentence.lower():
                # Clean up sentence
                cleaned = sentence.strip()
                if cleaned and len(cleaned) > 10:
                    actions.append(cleaned)
                break

    return actions if actions else ["Review case and take necessary action"]


# -------------------------
# DEPARTMENT DETECTION
# -------------------------

def extract_department(text):
    mapping = {
        "revenue": "Revenue Department",
        "municipal": "Municipal Corporation",
        "health": "Health Department",
        "police": "Police Department",
        "education": "Education Department"
    }

    text = text.lower()

    for key in mapping:
        if key in text:
            return mapping[key]

    return "Concerned Authority"


# -------------------------
# CONSEQUENCE DETECTION
# -------------------------

def extract_consequence(text):
    text = text.lower()

    if "contempt" in text:
        return "Failure may lead to contempt of court proceedings"
    if "penalty" in text:
        return "Failure may result in penalty"
    if "adverse" in text:
        return "Adverse action may be taken"
    if "cost" in text or "costs" in text:
        return "Failure may result in costs being imposed"

    return "Non-compliance may result in legal consequences"


# -------------------------
# SUMMARY
# -------------------------

def generate_summary(text):
    # Filter out empty sentences before taking the first 3
    sentences = [s.strip() for s in re.split(r'[.\n]', text) if len(s.strip()) > 10]
    if not sentences:
        return "No clear summary could be generated."
    return ". ".join(sentences[:3]).strip() + "."


# -------------------------
# OLLAMA ENHANCEMENT
# -------------------------

def build_ollama_prompt(text: str) -> str:
    return f"""
You are a senior legal decision support assistant.

Analyze this court judgment and extract human-friendly, decision-ready insights suitable for official government use.

Format your response exactly like this:
SUMMARY: [2-3 lines, clear, professional, no legal jargon]
DECISION_SUMMARY: [1 line, authoritative and clear summary of the core decision]
CITIZEN_EXPLANATION: [Start with "In simple terms...", then explain what the court is ordering the government to do so anyone can understand]
RECOMMENDED_ACTION: [Single clear directive using "must", e.g., "The Revenue Department must verify records and submit the report immediately."]
ACTION: [Rewrite the main required action in active voice, with clear subject, verb, and timeline. E.g., "The Revenue Department must submit a compliance report within 7 days."]

TEXT:
{text[:1500]}

Keep it simple, precise, and human-readable. Do not use robotic or AI-like phrasing.
"""

def call_ollama(prompt: str):
    try:
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        model = os.getenv("OLLAMA_MODEL", "qwen2.5")
        
        response = requests.post(
            f"{base_url}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            timeout=5
        )
        return response.json().get("response", None)
    except Exception as e:
        logger.warning(f"Ollama enhancement failed: {e}")
        return None

def call_openrouter(prompt: str):
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            logger.warning("OPENROUTER_API_KEY not found in env.")
            return None
            
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": os.getenv("OPENROUTER_MODEL", "google/gemma-3-4b-it"),
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            },
            timeout=5
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.warning(f"OpenRouter enhancement failed: {e}")
        return None

# -------------------------
# MAIN FUNCTION
# -------------------------

def extract_case_data(text: str) -> dict:
    if not text or len(text.strip()) < 50:
        logger.warning("Text is too short to analyze, but continuing with rule-based extraction.")

    # 1. Rule-Based Extraction
    actions_text = extract_actions(text)
    department = extract_department(text)
    deadline = extract_deadline(text)
    consequence = extract_consequence(text)

    actions = []
    for act in actions_text:
        actions.append({
            "action": act,
            "department": department,
            "deadline": deadline,
            "action_type": "compliance",
            "consequence": consequence,
            "confidence": 0.7
        })

    rule_summary = generate_summary(text)

    # 2. AI Enhancements (Layer 2 & Layer 3)
    final_summary = rule_summary
    decision_summary = None
    citizen_explanation = "In simple terms, the court has issued directives requiring official government action. Please review the detailed actions below."
    recommended_action = "The concerned department must review the case and take necessary compliance actions immediately."

    prompt = build_ollama_prompt(text)
    ai_resp = call_ollama(prompt)
    
    if not ai_resp:
        logger.info("Ollama failed or unavailable, falling back to OpenRouter...")
        ai_resp = call_openrouter(prompt)

    if ai_resp:
        summary_match = re.search(r'SUMMARY:\s*(.*?)(?:\nDECISION_SUMMARY:|\nCITIZEN_EXPLANATION:|\nRECOMMENDED_ACTION:|\nACTION:|$)', ai_resp, re.DOTALL | re.IGNORECASE)
        dec_match = re.search(r'DECISION_SUMMARY:\s*(.*?)(?:\nCITIZEN_EXPLANATION:|\nRECOMMENDED_ACTION:|\nACTION:|$)', ai_resp, re.DOTALL | re.IGNORECASE)
        cit_match = re.search(r'CITIZEN_EXPLANATION:\s*(.*?)(?:\nRECOMMENDED_ACTION:|\nACTION:|$)', ai_resp, re.DOTALL | re.IGNORECASE)
        rec_match = re.search(r'RECOMMENDED_ACTION:\s*(.*?)(?:\nACTION:|$)', ai_resp, re.DOTALL | re.IGNORECASE)
        action_match = re.search(r'ACTION:\s*(.*)', ai_resp, re.DOTALL | re.IGNORECASE)

        if summary_match and summary_match.group(1).strip():
            final_summary = summary_match.group(1).strip()
        if dec_match and dec_match.group(1).strip():
            decision_summary = dec_match.group(1).strip()
        if cit_match and cit_match.group(1).strip():
            citizen_explanation = cit_match.group(1).strip()
        if rec_match and rec_match.group(1).strip():
            recommended_action = rec_match.group(1).strip()

        if action_match and action_match.group(1).strip() and actions:
            # Improve the first action text and boost confidence slightly
            actions[0]["action"] = action_match.group(1).strip()
            actions[0]["confidence"] = 0.90

    return {
        "case_summary": final_summary,
        "decision_summary": decision_summary,
        "citizen_explanation": citizen_explanation,
        "recommended_action": recommended_action,
        "urgency_message": None,  # Will be populated by risk engine
        "case_type": "legal",
        "parties": [],
        "court": "Unknown Court",
        "order_date": datetime.now().strftime("%Y-%m-%d"),
        "actions": actions
    }
