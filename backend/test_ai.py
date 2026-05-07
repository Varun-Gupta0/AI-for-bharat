import os
from dotenv import load_dotenv

# Load env before importing services
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from services.ai_service import extract_case_data

text = """
IN THE HIGH COURT OF JUDICATURE
AT BOMBAY
ORDINARY ORIGINAL CIVIL JURISDICTION
WRIT PETITION NO. 1234 OF 2023

Petitioner: John Doe
Respondent: State of Maharashtra

Order Date: 12-05-2023

ORDER
1. The petitioner has filed this writ petition challenging the order passed by the respondent.
2. The respondent is directed to file an affidavit in reply within 4 weeks from today.
3. Place the matter for hearing on 15-06-2023. If the affidavit is not filed, costs of Rs 5000 will be imposed.
"""

try:
    result = extract_case_data(text)
    print("SUCCESS:")
    print(result)
except Exception as e:
    print("FAILED:")
    print(e)
