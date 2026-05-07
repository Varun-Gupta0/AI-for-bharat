import sys
import os

# Ensure backend can import models and services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.ai_service import extract_case_data
from services.risk_service import process_case_analysis
from models.schema import CaseAnalysis
import json

sample_judgment = """
The court has reviewed the petition regarding the delayed issuance of building permits. 
The respondent, the Municipal Corporation, is directed to review the petitioner's application 
and issue the required building permit within 5 days. 
Failure to comply may lead to contempt proceedings.
"""

# Step 3: AI Extraction
raw_data = extract_case_data(sample_judgment)

# Step 4: Risk Engine Processing
analysis_obj = CaseAnalysis(**raw_data)
final_analysis = process_case_analysis(analysis_obj)

print(final_analysis.model_dump_json(indent=2))
