"""
Verify Route – POST /api/v1/verify

Accepts a verification request from a human officer.
Updates the status of AI-extracted actions (approved, edited, rejected)
and saves the verified actions into the database.
"""

import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException

from models.schema import VerifyRequest, VerifyResponse, ActionItem
from database.db import get_raw_case, save_verified_actions

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post(
    "/verify",
    response_model=VerifyResponse,
    summary="Verify and approve AI extracted actions",
    description=(
        "Human-in-the-loop verification. Officers can approve, edit, or reject "
        "the actions extracted by the AI. Only verified actions are saved."
    ),
)
def verify_actions(body: VerifyRequest):
    """
    Step 5 logic:
    - Retrieve the original raw AI case using file_id.
    - Iterate through the verification payload.
    - Update the corresponding action's verification fields.
    - Save the approved/edited actions to the verified store.
    """
    raw_case = get_raw_case(body.file_id)
    if not raw_case:
        raise HTTPException(
            status_code=404,
            detail=f"No raw AI analysis found for file_id: {body.file_id}. Run /analyze first."
        )

    verified_actions_to_save = []
    rejected_count = 0

    # Ensure we don't go out of bounds
    max_index = len(raw_case.actions) - 1

    for verification in body.actions:
        idx = verification.index
        if idx < 0 or idx > max_index:
            logger.warning(f"Invalid action index {idx} for file_id {body.file_id}")
            continue

        original_action = raw_case.actions[idx]
        
        # Update verification metadata
        original_action.verification_status = verification.status
        original_action.verified_by = body.verified_by
        original_action.verified_at = datetime.now()

        if verification.status == "approved":
            # Keep original, mark as approved
            original_action.verified_action = original_action.action
            original_action.verified_deadline = original_action.deadline
            verified_actions_to_save.append(original_action)
            
        elif verification.status == "edited":
            # Update with new data if provided
            if verification.updated_data:
                if verification.updated_data.action:
                    original_action.verified_action = verification.updated_data.action
                if verification.updated_data.deadline:
                    original_action.verified_deadline = verification.updated_data.deadline
            else:
                # Fallback if edited but no data provided
                original_action.verified_action = original_action.action
                original_action.verified_deadline = original_action.deadline
                
            verified_actions_to_save.append(original_action)
            
        elif verification.status == "rejected":
            rejected_count += 1
            # We don't append rejected actions to the verified store

    # Save to verified store
    save_verified_actions(body.file_id, verified_actions_to_save)

    return VerifyResponse(
        file_id=body.file_id,
        message="Verification completed successfully.",
        verified_actions_count=len(verified_actions_to_save),
        rejected_actions_count=rejected_count
    )
