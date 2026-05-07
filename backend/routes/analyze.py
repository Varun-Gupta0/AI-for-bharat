"""
Analyze Route – POST /api/v1/analyze

Full pipeline in one call:
  file_id → load PDF → extract text (Step 2) → AI extraction (Step 3) → structured JSON

This is the primary endpoint for CourtTrack AI.
"""

import os
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.ocr_service import extract_text_from_pdf
from services.ai_service import extract_case_data
from services.parser_service import parse_extraction
from services.risk_service import process_case_analysis
from models.schema import AnalyzeResponse
from database.db import save_raw_case

logger = logging.getLogger(__name__)
router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


# ─── Request ──────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    file_id: str

    model_config = {
        "json_schema_extra": {
            "example": {"file_id": "25e6896f-60cb-4a62-a569-5e0d7e740f43"}
        }
    }


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Full pipeline: Upload → Extract → AI Analysis",
    description=(
        "Runs the complete NyayaLens pipeline on an uploaded PDF. "
        "Provide the file_id from POST /upload. "
        "Returns structured case insights: summary, actions, deadlines, risk."
    ),
)
def analyze_judgment(body: AnalyzeRequest):
    """
    Step 1+2+3 combined:
      1. Resolve uploaded PDF path from file_id
      2. Extract text (PDF-native or OCR fallback)
      3. Send text to AI for structured extraction
      4. Parse and validate response
      5. Return clean JSON
    """

    # ── 1. Resolve file path ───────────────────────────────────────────────────
    file_path = os.path.join(UPLOAD_DIR, f"{body.file_id}.pdf")

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail=f"No uploaded file found for file_id='{body.file_id}'. Upload via POST /upload first.",
        )

    logger.info(f"[Analyze] Starting pipeline for file_id={body.file_id}")

    # ── 2. Text extraction ─────────────────────────────────────────────────────
    try:
        extraction = extract_text_from_pdf(file_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {e}")

    text = extraction["text"]
    extraction_source = extraction["source"]
    logger.info(f"[Analyze] Text extracted via {extraction_source} — {extraction['char_count']} chars")

    if not text or len(text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail=(
                "Extracted text is too short to analyze. "
                "The PDF may be blank, corrupted, or an unsupported format."
            ),
        )

    # ── 3. AI extraction ───────────────────────────────────────────────────────
    try:
        raw_ai_data = extract_case_data(text)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"AI extraction failed: {e}")

    # ── 4. Parse into validated model ──────────────────────────────────────────
    try:
        case_analysis = parse_extraction(raw_ai_data)
        
        # Step 4: Enhance AI output with processing logic (Risk, Deadlines, Priority)
        case_analysis = process_case_analysis(case_analysis)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse or process AI response: {e}")

    logger.info(
        f"[Analyze] Done — {len(case_analysis.actions)} actions, "
        f"case_type={case_analysis.case_type}"
    )

    # ── 5. Save Raw AI Analysis to DB ──────────────────────────────────────────
    save_raw_case(body.file_id, case_analysis)

    # ── 6. Return ──────────────────────────────────────────────────────────────
    return AnalyzeResponse(
        file_id=body.file_id,
        extraction_source=extraction_source,
        char_count=extraction["char_count"],
        analysis=case_analysis,
        message="Analysis complete.",
    )
