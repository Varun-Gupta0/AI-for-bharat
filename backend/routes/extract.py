"""
Extract Route – POST /api/v1/extract

Accepts a file_id (from the upload step) or a direct file_path,
runs text extraction via ocr_service, and returns the raw text.

This is Step 2 of the pipeline:
  Upload → [Extract] → AI Extraction → Structured Output
"""

import os
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.ocr_service import extract_text_from_pdf
from models.schema import ExtractionResponse

logger = logging.getLogger(__name__)

router = APIRouter()

# ─── Config ───────────────────────────────────────────────────────────────────

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


# ─── Request body ─────────────────────────────────────────────────────────────

class ExtractRequest(BaseModel):
    file_id: Optional[str] = None
    file_path: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "file_id": "25e6896f-60cb-4a62-a569-5e0d7e740f43"
            }
        }
    }


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post(
    "/extract",
    response_model=ExtractionResponse,
    summary="Extract text from an uploaded PDF",
    description=(
        "Runs text extraction on a previously uploaded PDF. "
        "Supply either `file_id` (preferred) or a direct `file_path`. "
        "Automatically detects whether the PDF is text-based or scanned and applies OCR if needed."
    ),
)
def extract_text(body: ExtractRequest):
    """
    Step 2 of the pipeline: Extract raw text from the uploaded PDF.

    - If file_id is provided, resolves to uploads/<file_id>.pdf
    - If file_path is provided, uses it directly
    - Returns extracted text, source type (pdf/ocr), page count, char count
    """

    # ── Resolve file path ──────────────────────────────────────────────────────
    if body.file_id:
        resolved_path = os.path.join(UPLOAD_DIR, f"{body.file_id}.pdf")
    elif body.file_path:
        resolved_path = body.file_path
    else:
        raise HTTPException(
            status_code=422,
            detail="Provide either 'file_id' or 'file_path' in the request body.",
        )

    if not os.path.exists(resolved_path):
        raise HTTPException(
            status_code=404,
            detail=f"File not found: '{resolved_path}'. Upload the PDF first via POST /upload.",
        )

    # ── Run extraction ─────────────────────────────────────────────────────────
    logger.info(f"Extracting text from: {resolved_path}")

    try:
        result = extract_text_from_pdf(resolved_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")

    logger.info(
        f"Extraction complete — source={result['source']}, "
        f"chars={result['char_count']}, pages={result['page_count']}"
    )

    return ExtractionResponse(
        file_id=body.file_id,
        file_path=resolved_path,
        text=result["text"],
        source=result["source"],
        page_count=result["page_count"],
        char_count=result["char_count"],
        message=f"Text extraction successful via {result['source'].upper()} method.",
    )
