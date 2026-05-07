"""
Cases Route – Judicial Archive Access

Handles retrieval of verified proceedings, recent filings, and archive searches.
Provides the persistence bridge for the "Legal Newspaper" archive UI.
"""

from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional

from models.schema import CaseResponse
from database.db import (
    get_verified_cases, 
    get_recent_proceedings, 
    search_archive, 
    get_case_by_tracking_id
)

router = APIRouter()

@router.get(
    "/cases",
    response_model=List[CaseResponse],
    summary="Get all verified cases",
    description="Returns the full judicial archive of human-verified proceedings.",
)
def get_all_cases():
    verified_data = get_verified_cases()
    response = []

    for file_id, data in verified_data.items():
        response.append(
            CaseResponse(
                file_id=file_id,
                tracking_id=data.get("tracking_id"),
                summary=data.get("summary"),
                citizen_explanation=data.get("citizen_explanation"),
                verified_actions=data.get("verified_actions", []),
                status=data.get("status", "verified"),
                timestamp=data.get("timestamp")
            )
        )

    return response

@router.get(
    "/cases/recent",
    summary="Get recent proceedings",
    description="Returns the most recently analyzed or verified judicial records."
)
def get_recent(limit: int = 5):
    return get_recent_proceedings(limit)

@router.get(
    "/cases/search",
    summary="Search judicial archive",
    description="Keyword search across tracking IDs, summaries, and departments."
)
def search(q: str = Query(..., min_length=2)):
    return search_archive(q)

@router.get(
    "/cases/track/{tracking_id}",
    summary="Track specific proceeding",
    description="Retrieves a verified case by its public Tracking ID."
)
def track_case(tracking_id: str):
    case = get_case_by_tracking_id(tracking_id)
    if not case:
        raise HTTPException(status_code=404, detail="Tracking ID not found in judicial archive.")
    return case

@router.patch(
    "/cases/{file_id}/status",
    summary="Update proceeding status",
    description="Escalate or update the judicial status of a case."
)
def update_status(file_id: str, status: str):
    # This would call a db update function
    from database.db import get_db_connection
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE cases SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE file_id = ?', (status, file_id))
    conn.commit()
    conn.close()
    return {"message": f"Case status updated to {status}"}
