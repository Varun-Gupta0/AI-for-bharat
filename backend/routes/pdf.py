"""
PDF Route – GET /api/v1/pdf/{file_id}

Serves the original uploaded PDF file to the browser for the Evidence Viewer.
The file_id is the UUID assigned during upload.
"""

import os
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

logger = logging.getLogger(__name__)
router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


@router.get(
    "/pdf/{file_id}",
    summary="Serve original uploaded PDF",
    description="Returns the raw PDF file for a given file_id. Used by the Evidence Viewer in the frontend.",
    response_class=FileResponse,
)
def serve_pdf(file_id: str):
    """
    Serve the original PDF so react-pdf can render it in the browser.

    Security: Only serves files that were previously uploaded (UUID-based path).
    Prevents path traversal by using only the file_id as the filename.
    """
    # Sanitise: only allow valid UUID-like strings (no slashes, no dots)
    if not all(c in "0123456789abcdef-" for c in file_id.lower()):
        raise HTTPException(status_code=400, detail="Invalid file_id format.")

    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail=f"No PDF found for file_id='{file_id}'. The file may have expired."
        )

    logger.info(f"[PDF Serve] Serving {file_path}")
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={file_id}.pdf",
            # Allow the Next.js frontend to access this cross-origin
            "Access-Control-Allow-Origin": "*",
        },
    )
