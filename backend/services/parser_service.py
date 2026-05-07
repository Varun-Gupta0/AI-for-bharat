"""
Parser Service – Step 3

Validates and normalizes raw AI JSON into a clean CaseExtraction model.
Acts as a safety layer between the raw LLM output and the API response.
"""

import logging
from typing import Optional
from models.schema import CaseAnalysis, ActionItem

logger = logging.getLogger(__name__)


def parse_extraction(raw: dict) -> CaseAnalysis:
    """
    Convert raw AI dict into a validated CaseAnalysis Pydantic model.

    Args:
        raw: The dict returned by ai_service.extract_case_data()

    Returns:
        CaseAnalysis model instance.
    """
    actions = []
    for a in raw.get("actions") or []:
        try:
            actions.append(ActionItem(
                action=a.get("action", ""),
                department=a.get("department", ""),
                deadline=a.get("deadline"),
                action_type=a.get("action_type", "compliance"),
                consequence=a.get("consequence"),
                confidence=float(a.get("confidence", 0.8)),
                # ── Evidence Linking fields ───────────────────────────────────
                source_text=a.get("source_text"),
                page=a.get("page"),
                source_context=a.get("source_context"),
                source_available=bool(a.get("source_available", False)),
            ))
        except Exception as e:
            logger.warning(f"Skipping malformed action item: {e} | data={a}")
            continue

    return CaseAnalysis(
        case_summary=raw.get("case_summary", ""),
        decision_summary=raw.get("decision_summary"),
        citizen_explanation=raw.get("citizen_explanation"),
        recommended_action=raw.get("recommended_action"),
        urgency_message=raw.get("urgency_message"),
        case_type=raw.get("case_type", "other"),
        parties=raw.get("parties") or [],
        court=raw.get("court"),
        order_date=raw.get("order_date"),
        actions=actions,
    )
