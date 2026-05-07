"""
Evidence Service – Source Tracing for Evidence Linking

For every extracted action, this service:
  1. Searches all pages for the sentence that best matches the action text.
  2. Records the exact matched sentence (source_text).
  3. Records the page number (1-indexed).
  4. Records one sentence of context before and after (source_context).
  5. Falls back to fuzzy matching if exact match fails.

Uses rapidfuzz for fast fuzzy string matching on large PDFs.
"""

import re
import logging
from typing import List, Dict, Any, Optional, Tuple

logger = logging.getLogger(__name__)

# Minimum similarity score (0–100) for fuzzy match to be accepted
FUZZY_THRESHOLD = 55


def _split_sentences(text: str) -> List[str]:
    """
    Split legal text into sentences.
    Legal documents use varied punctuation so we use a robust splitter.
    """
    # Split on period+space, semicolon, newline sequences
    raw = re.split(r'(?<=[.;])\s+|\n{2,}', text)
    return [s.strip() for s in raw if len(s.strip()) > 15]


def _find_best_match(
    query: str,
    pages: List[Dict[str, Any]],
) -> Tuple[Optional[str], Optional[int], Optional[str], float]:
    """
    Find the best-matching sentence across all pages for a given action text.

    Args:
        query:  The action text to search for.
        pages:  List of {"page": int, "text": str} dicts from OCR/PDF extraction.

    Returns:
        (matched_sentence, page_number, context_string, confidence_score)
    """
    try:
        from rapidfuzz import fuzz, process
    except ImportError:
        logger.warning("rapidfuzz not installed — evidence linking disabled. Run: pip install rapidfuzz")
        return None, None, None, 0.0

    best_score = 0.0
    best_sentence = None
    best_page = None
    best_context = None

    query_lower = query.lower().strip()

    for page_data in pages:
        page_num = page_data["page"]
        page_text = page_data["text"]

        if not page_text:
            continue

        sentences = _split_sentences(page_text)

        if not sentences:
            continue

        # First try: exact substring match (fastest, most precise)
        for i, sentence in enumerate(sentences):
            if query_lower[:40] in sentence.lower():
                context = _build_context(sentences, i)
                return sentence, page_num, context, 0.98

        # Second try: keyword overlap (fast heuristic)
        query_keywords = set(re.findall(r'\b\w{5,}\b', query_lower))
        for i, sentence in enumerate(sentences):
            sent_lower = sentence.lower()
            if len(query_keywords) > 0:
                hits = sum(1 for kw in query_keywords if kw in sent_lower)
                keyword_score = (hits / len(query_keywords)) * 100
                if keyword_score > best_score and keyword_score >= FUZZY_THRESHOLD:
                    best_score = keyword_score
                    best_sentence = sentence
                    best_page = page_num
                    best_context = _build_context(sentences, i)

        # Third try: fuzzy matching (most thorough, slower)
        if len(sentences) > 0:
            result = process.extractOne(
                query,
                sentences,
                scorer=fuzz.partial_ratio,
            )
            if result and result[1] > best_score:
                best_score = result[1]
                idx = sentences.index(result[0])
                best_sentence = result[0]
                best_page = page_num
                best_context = _build_context(sentences, idx)

    if best_score >= FUZZY_THRESHOLD:
        return best_sentence, best_page, best_context, round(best_score / 100, 2)

    return None, None, None, 0.0


def _build_context(sentences: List[str], idx: int) -> str:
    """
    Build a context string: prev sentence + matched sentence + next sentence.
    This prevents misleading partial extractions.
    """
    parts = []
    if idx > 0:
        parts.append(sentences[idx - 1])
    parts.append(f">>> {sentences[idx]} <<<")   # mark the matched one
    if idx < len(sentences) - 1:
        parts.append(sentences[idx + 1])
    return " ".join(parts)


def attach_evidence(
    actions: List[Dict[str, Any]],
    pages: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Main entry point: attach source_text, page, source_context, source_available
    to each action dict.

    Args:
        actions: List of raw action dicts from AI extraction.
        pages:   Per-page text data from ocr_service.

    Returns:
        The same action list with evidence fields populated.
    """
    if not pages:
        logger.warning("[Evidence] No page data available — skipping evidence linking.")
        return actions

    enriched = []
    for action in actions:
        action_text = action.get("action", "")
        matched_sentence, page_num, context, score = _find_best_match(action_text, pages)

        action["source_text"] = matched_sentence
        action["page"] = page_num
        action["source_context"] = context
        action["source_available"] = matched_sentence is not None

        if matched_sentence:
            # Boost confidence if we found solid evidence
            existing_conf = float(action.get("confidence", 0.7))
            action["confidence"] = min(0.99, max(existing_conf, score))
            logger.info(
                f"[Evidence] ✓ Matched action on page {page_num} "
                f"(score={score:.2f}): {action_text[:60]}..."
            )
        else:
            logger.info(
                f"[Evidence] ✗ No match found for: {action_text[:60]}..."
            )

        enriched.append(action)

    return enriched
