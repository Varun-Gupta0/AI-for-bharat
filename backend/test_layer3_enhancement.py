import json
import os
from dotenv import load_dotenv

# Load env before importing services
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from services.ai_service import extract_case_data

def test_layer3_enhancement():
    sample_text = """
    IN THE HIGH COURT OF JUDICATURE AT BOMBAY
    ORDINARY ORIGINAL CIVIL JURISDICTION
    WRIT PETITION NO. 1234 OF 2023
    
    Order Date: 12-05-2023
    
    1. The Revenue Department is directed to review the tax assessments of the petitioner.
    2. The concerned authorities shall submit the revised report within 2 weeks from today.
    3. The municipal authorities must clear the pending dues by 15 June 2024.
    4. If the orders are not followed, adverse action may be taken including penalty.
    """
    
    print("--- Running Layer 1 -> Layer 2 -> Layer 3 Extraction ---")
    print(f"Using OPENROUTER_MODEL: {os.getenv('OPENROUTER_MODEL', 'google/gemma-3-4b-it')}")
    
    result = extract_case_data(sample_text)
    
    print("\nExtraction Result (JSON):")
    print(json.dumps(result, indent=2))
    
    assert len(result["actions"]) > 0, "Failed to extract actions"
    
    print("\nTest passed successfully! Result conforms to required structure.")

if __name__ == "__main__":
    test_layer3_enhancement()
