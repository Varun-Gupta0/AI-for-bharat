"""
Cases Route – GET /api/v1/cases

Returns all VERIFIED cases and their actions.
Raw AI output that hasn't been verified is NOT returned here.
"""

from fastapi import APIRouter
from typing import List

from models.schema import CaseResponse
from database.db import get_verified_cases, get_raw_case

router = APIRouter()

@router.get(
    "/cases",
    response_model=List[CaseResponse],
    summary="Get all verified cases",
    description="Returns only the human-verified actions grouped by their file_id.",
)
def get_all_cases():
    verified_data = get_verified_cases()
    response = []

    for file_id, actions in verified_data.items():
        # Get summary from the raw case if it exists
        raw_case = get_raw_case(file_id)
        summary = raw_case.case_summary if raw_case else "Summary not available"

        response.append(
            CaseResponse(
                file_id=file_id,
                summary=summary,
                verified_actions=actions
            )
        )

    return response
