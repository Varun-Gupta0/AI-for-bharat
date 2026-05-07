"""
Pydantic Models / Schemas for NyayaLens API

These define the request/response shapes for all endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── Upload – Step 1 ──────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    file_id: str
    file_name: Optional[str]
    file_path: str
    size_kb: float
    message: str


# ─── Extraction – Step 2 ──────────────────────────────────────────────────────

class ExtractionResponse(BaseModel):
    file_id: Optional[str] = None
    file_path: str
    text: str
    source: str
    page_count: int
    char_count: int
    message: str


# ─── AI Extraction & Processing – Step 3 & 4 & 5 ──────────────────────────────

class ActionItem(BaseModel):
    """A single required action extracted from the judgment."""
    # AI extracted base fields
    action: str
    department: str
    deadline: Optional[str] = None
    action_type: str = "compliance"
    consequence: Optional[str] = None
    confidence: float = 0.8

    # ── Evidence Linking metadata ─────────────────────────────────────────────
    # The exact sentence(s) from the PDF that produced this action
    source_text: Optional[str] = None
    # Page number (1-indexed) where the source text was found
    page: Optional[int] = None
    # One sentence before + after the source sentence for context
    source_context: Optional[str] = None
    # Whether source tracing succeeded for this action
    source_available: bool = False

    # Processed fields (Step 4)
    days_remaining: Optional[int] = None
    risk_level: str = "UNKNOWN"
    priority: str = "NORMAL"

    # Verification fields (Step 5)
    verification_status: str = "pending"  # pending | approved | edited | rejected
    verified_action: Optional[str] = None
    verified_deadline: Optional[str] = None
    verified_by: Optional[str] = None
    verified_at: Optional[datetime] = None


class CaseAnalysis(BaseModel):
    """Fully structured AI analysis of a court judgment."""
    case_summary: str
    decision_summary: Optional[str] = None
    citizen_explanation: Optional[str] = None
    recommended_action: Optional[str] = None
    urgency_message: Optional[str] = None
    case_type: str
    parties: List[str] = []
    court: Optional[str] = None
    order_date: Optional[str] = None
    actions: List[ActionItem] = []


class AnalyzeResponse(BaseModel):
    """Top-level response for POST /analyze."""
    file_id: str
    extraction_source: str
    char_count: int
    analysis: CaseAnalysis
    message: str


# ─── Verification – Step 5 ────────────────────────────────────────────────────

class UpdatedActionData(BaseModel):
    action: Optional[str] = None
    deadline: Optional[str] = None

class ActionVerification(BaseModel):
    index: int
    status: str  # approved | edited | rejected
    updated_data: Optional[UpdatedActionData] = None

class VerifyRequest(BaseModel):
    file_id: str
    tracking_id: Optional[str] = None
    verified_by: str = "human_officer"
    actions: List[ActionVerification]

class VerifyResponse(BaseModel):
    file_id: str
    tracking_id: Optional[str] = None
    message: str
    verified_actions_count: int
    rejected_actions_count: int


# ─── Cases – Step 5 ───────────────────────────────────────────────────────────

class CaseResponse(BaseModel):
    file_id: str
    tracking_id: Optional[str] = None
    summary: str
    citizen_explanation: Optional[str] = None
    verified_actions: List[ActionItem]
    status: str = "verified"
    timestamp: Optional[str] = None
    order_date: Optional[str] = None
    court: Optional[str] = None
    risk_level: Optional[str] = "LOW"
