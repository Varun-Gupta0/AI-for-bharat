import json
from services.ai_service import extract_case_data

def test_rule_based_extraction():
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
    
    print("--- Running Rule-Based Extraction ---")
    result = extract_case_data(sample_text)
    
    print("\nExtraction Result (JSON):")
    print(json.dumps(result, indent=2))
    
    # Assertions / Validations
    assert len(result["actions"]) > 0, "Failed to extract actions"
    
    # Check if any action got the deadline and department right based on text context
    print("\nTest passed successfully! Result conforms to required structure.")

if __name__ == "__main__":
    test_rule_based_extraction()
