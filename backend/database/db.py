"""
Database Setup – Step 5

For this prototype, we use a simple in-memory store.
In production, this would be SQLite or PostgreSQL.

We store:
1. The full AI analysis (grouped by file_id) so we can retrieve it during verification.
2. The verified cases (grouped by file_id) to serve the /cases endpoint.
"""

from typing import Dict
from models.schema import CaseAnalysis, ActionItem

# In-memory storage
# file_id -> CaseAnalysis (Raw AI + Processing Output)
raw_cases_store: Dict[str, CaseAnalysis] = {}

# file_id -> List[ActionItem] (Only the verified/approved/edited actions)
verified_cases_store: Dict[str, list[ActionItem]] = {}

def save_raw_case(file_id: str, case_data: CaseAnalysis):
    raw_cases_store[file_id] = case_data

def get_raw_case(file_id: str) -> CaseAnalysis | None:
    return raw_cases_store.get(file_id)

def save_verified_actions(file_id: str, actions: list[ActionItem]):
    verified_cases_store[file_id] = actions

def get_verified_cases() -> Dict[str, list[ActionItem]]:
    return verified_cases_store
