"""
OCR Service – Step 2

Extracts text from court judgment PDFs.

Strategy:
  1. Try native PDF text extraction via pdfplumber.
  2. If extracted text is below MIN_CHARS_PER_PAGE threshold
     (i.e. scanned/image-only PDF), fall back to Tesseract OCR via pdf2image.

Returns:
  { "text": "...", "source": "pdf" | "ocr" }
"""

import logging
import os
from typing import TypedDict

import pdfplumber

logger = logging.getLogger(__name__)

# ─── Config ───────────────────────────────────────────────────────────────────

# If average extracted chars per page is below this, treat as scanned PDF
MIN_CHARS_PER_PAGE = 100

# Tesseract language(s) — add "mal" for Malayalam if installed
TESSERACT_LANG = os.getenv("TESSERACT_LANG", "eng")

# Poppler bin path (Windows only) — set in .env if pdf2image can't find poppler
POPPLER_PATH = os.getenv("POPPLER_PATH", None)  # e.g. "C:/poppler/bin"


# ─── Return type ──────────────────────────────────────────────────────────────

class ExtractionResult(TypedDict):
    text: str
    source: str        # "pdf" or "ocr"
    page_count: int
    char_count: int


# ─── Core function ────────────────────────────────────────────────────────────

def extract_text_from_pdf(file_path: str) -> ExtractionResult:
    """
    Main entry point for text extraction.

    Args:
        file_path: Absolute or relative path to the PDF file.

    Returns:
        ExtractionResult dict with keys: text, source, page_count, char_count.

    Raises:
        FileNotFoundError: If the PDF does not exist.
        RuntimeError: If extraction fails completely.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF not found: {file_path}")

    logger.info(f"Starting extraction for: {file_path}")

    # Step 1 — try native PDF text
    result = _extract_native(file_path)

    page_count = result["page_count"]
    avg_chars = result["char_count"] / max(page_count, 1)

    if avg_chars >= MIN_CHARS_PER_PAGE:
        logger.info(
            f"[PDF] Native text OK — {result['char_count']} chars, "
            f"{page_count} pages, avg {avg_chars:.0f} chars/page"
        )
        return result

    # Step 2 — fallback to OCR
    logger.info(
        f"[OCR] Native text too short (avg {avg_chars:.0f} chars/page < {MIN_CHARS_PER_PAGE}). "
        f"Falling back to OCR."
    )
    return _extract_ocr(file_path)


# ─── Native extraction ────────────────────────────────────────────────────────

def _extract_native(file_path: str) -> ExtractionResult:
    """Extract text from a text-based PDF using pdfplumber."""
    pages_text = []

    try:
        with pdfplumber.open(file_path) as pdf:
            page_count = len(pdf.pages)
            for page in pdf.pages:
                text = page.extract_text() or ""
                pages_text.append(text.strip())
    except Exception as e:
        raise RuntimeError(f"pdfplumber failed on '{file_path}': {e}") from e

    full_text = "\n\n".join(pages_text)
    return ExtractionResult(
        text=full_text,
        source="pdf",
        page_count=page_count,
        char_count=len(full_text),
    )


# ─── OCR fallback ─────────────────────────────────────────────────────────────

def _extract_ocr(file_path: str) -> ExtractionResult:
    """
    Convert PDF pages to images and run Tesseract OCR on each.

    Requires:
        - pytesseract (pip install pytesseract)
        - pdf2image   (pip install pdf2image)
        - Tesseract binary installed on the OS
        - Poppler installed on the OS (for pdf2image on Windows)
    """
    try:
        import pytesseract
        from pdf2image import convert_from_path
    except ImportError as e:
        raise RuntimeError(
            "OCR dependencies missing. Run: pip install pytesseract pdf2image\n"
            "Also install Tesseract and Poppler on your OS."
        ) from e

    try:
        images = convert_from_path(
            file_path,
            dpi=300,
            poppler_path=POPPLER_PATH,
        )
    except Exception as e:
        raise RuntimeError(f"pdf2image failed on '{file_path}': {e}") from e

    pages_text = []
    for i, img in enumerate(images):
        try:
            text = pytesseract.image_to_string(img, lang=TESSERACT_LANG)
            pages_text.append(text.strip())
            logger.debug(f"  OCR page {i+1}/{len(images)}: {len(text)} chars")
        except Exception as e:
            logger.warning(f"  OCR failed on page {i+1}: {e}")
            pages_text.append("")

    full_text = "\n\n".join(pages_text)
    return ExtractionResult(
        text=full_text,
        source="ocr",
        page_count=len(images),
        char_count=len(full_text),
    )
