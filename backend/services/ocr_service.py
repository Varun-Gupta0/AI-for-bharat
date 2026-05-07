"""
OCR Service – Step 2 (Evidence-Aware)

Extracts text from court judgment PDFs with full page-level traceability.

Strategy:
  1. Try native PDF text extraction via pdfplumber (page-by-page).
  2. If extracted text is below MIN_CHARS_PER_PAGE threshold
     (i.e. scanned/image-only PDF), fall back to Tesseract OCR via pdf2image.

Returns:
  {
    "text": str,              # Full concatenated text
    "source": "pdf" | "ocr",
    "page_count": int,
    "char_count": int,
    "pages": [                # NEW — per-page text for evidence linking
      {"page": 1, "text": "..."},
      ...
    ]
  }
"""

import logging
import os
from typing import TypedDict, List, Dict, Any

import pdfplumber

logger = logging.getLogger(__name__)

# ─── Config ───────────────────────────────────────────────────────────────────

MIN_CHARS_PER_PAGE = 100
TESSERACT_LANG = os.getenv("TESSERACT_LANG", "eng")
POPPLER_PATH = os.getenv("POPPLER_PATH", None)


# ─── Return type ──────────────────────────────────────────────────────────────

class ExtractionResult(TypedDict):
    text: str
    source: str
    page_count: int
    char_count: int
    pages: List[Dict[str, Any]]   # [{page: 1, text: "..."}, ...]


# ─── Core function ────────────────────────────────────────────────────────────

def extract_text_from_pdf(file_path: str) -> ExtractionResult:
    """
    Main entry point for text extraction.

    Returns ExtractionResult with per-page breakdown for evidence linking.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF not found: {file_path}")

    logger.info(f"Starting extraction for: {file_path}")

    result = _extract_native(file_path)
    page_count = result["page_count"]
    avg_chars = result["char_count"] / max(page_count, 1)

    if avg_chars >= MIN_CHARS_PER_PAGE:
        logger.info(
            f"[PDF] Native text OK — {result['char_count']} chars, "
            f"{page_count} pages, avg {avg_chars:.0f} chars/page"
        )
        return result

    logger.info(
        f"[OCR] Native text too short (avg {avg_chars:.0f} chars/page < {MIN_CHARS_PER_PAGE}). "
        f"Falling back to OCR."
    )
    return _extract_ocr(file_path)


# ─── Native extraction ────────────────────────────────────────────────────────

def _extract_native(file_path: str) -> ExtractionResult:
    """Extract text from a text-based PDF using pdfplumber, page by page."""
    pages_data = []

    try:
        with pdfplumber.open(file_path) as pdf:
            page_count = len(pdf.pages)
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                pages_data.append({"page": i + 1, "text": text.strip()})
    except Exception as e:
        raise RuntimeError(f"pdfplumber failed on '{file_path}': {e}") from e

    full_text = "\n\n".join(p["text"] for p in pages_data)
    return ExtractionResult(
        text=full_text,
        source="pdf",
        page_count=page_count,
        char_count=len(full_text),
        pages=pages_data,
    )


# ─── OCR fallback ─────────────────────────────────────────────────────────────

def _extract_ocr(file_path: str) -> ExtractionResult:
    """
    Convert PDF pages to images and run Tesseract OCR on each.
    Returns per-page text data for evidence linking.
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

    pages_data = []
    for i, img in enumerate(images):
        try:
            text = pytesseract.image_to_string(img, lang=TESSERACT_LANG)
            pages_data.append({"page": i + 1, "text": text.strip()})
            logger.debug(f"  OCR page {i+1}/{len(images)}: {len(text)} chars")
        except Exception as e:
            logger.warning(f"  OCR failed on page {i+1}: {e}")
            pages_data.append({"page": i + 1, "text": ""})

    full_text = "\n\n".join(p["text"] for p in pages_data)
    return ExtractionResult(
        text=full_text,
        source="ocr",
        page_count=len(images),
        char_count=len(full_text),
        pages=pages_data,
    )
