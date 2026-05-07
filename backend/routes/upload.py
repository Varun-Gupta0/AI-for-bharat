"""
Upload Route – POST /api/v1/upload

Accepts a PDF file, validates it, saves it locally, and returns a file_id + path.
"""

import os
import uuid
import aiofiles

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from models.schema import UploadResponse

load_dotenv()

router = APIRouter()

# ─── Config ───────────────────────────────────────────────────────────────────

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 20))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"application/pdf"}

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Upload a court judgment PDF",
    description=(
        "Upload a PDF file containing a court judgment. "
        "The file is saved locally and a unique file_id is returned for subsequent processing."
    ),
)
async def upload_pdf(file: UploadFile = File(..., description="Court judgment PDF file")):
    """
    Step 1 of the pipeline: Accept and store a PDF upload.

    Returns:
        file_id   – UUID assigned to this upload
        file_name – Original filename
        file_path – Server-side path where the file is saved
        size_kb   – File size in kilobytes
    """

    # ── Validation: MIME type ──────────────────────────────────────────────────
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Only PDF files are accepted.",
        )

    # ── Read file contents ─────────────────────────────────────────────────────
    contents = await file.read()

    # ── Validation: File size ──────────────────────────────────────────────────
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_MB} MB.",
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    # ── Validate PDF magic bytes (basic check) ─────────────────────────────────
    if not contents.startswith(b"%PDF"):
        raise HTTPException(
            status_code=400,
            detail="File does not appear to be a valid PDF (missing PDF header).",
        )

    # ── Generate unique file ID and save path ─────────────────────────────────
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}.pdf"
    save_path = os.path.join(UPLOAD_DIR, safe_filename)

    # ── Write to disk asynchronously ──────────────────────────────────────────
    async with aiofiles.open(save_path, "wb") as out_file:
        await out_file.write(contents)

    size_kb = round(len(contents) / 1024, 2)

    return UploadResponse(
        file_id=file_id,
        file_name=file.filename,
        file_path=save_path,
        size_kb=size_kb,
        message="File uploaded successfully. Ready for text extraction.",
    )
