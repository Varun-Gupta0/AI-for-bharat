"""
NyayaLens – Upload Endpoint Test Script
Run from: backend/
Usage: python test_upload.py
"""

import urllib.request
import json
import os
import sys


BASE_URL = "http://localhost:8000"
BOUNDARY = "NyayaLensBoundary12345"


# ── helpers ───────────────────────────────────────────────────────────────────

def build_multipart(field_name: str, filename: str, data: bytes, mime: str = "application/pdf") -> bytes:
    body = (
        f"--{BOUNDARY}\r\n"
        f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'
        f"Content-Type: {mime}\r\n\r\n"
    ).encode()
    body += data
    body += f"\r\n--{BOUNDARY}--\r\n".encode()
    return body


def post(path: str, body: bytes, content_type: str) -> dict:
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=body,
        method="POST",
    )
    req.add_header("Content-Type", content_type)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()}


def get(path: str) -> dict:
    with urllib.request.urlopen(f"{BASE_URL}{path}") as resp:
        return json.loads(resp.read())


def make_minimal_pdf() -> bytes:
    """Build a tiny but structurally valid PDF."""
    pdf  = b"%PDF-1.4\n"
    obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    obj2 = b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    obj3 = b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n"

    offsets = [
        len(pdf),
        len(pdf) + len(obj1),
        len(pdf) + len(obj1) + len(obj2),
    ]
    xref_pos = sum(map(len, [pdf, obj1, obj2, obj3]))

    xref = (
        "xref\n"
        "0 4\n"
        "0000000000 65535 f \n"
        f"{offsets[0]:010d} 00000 n \n"
        f"{offsets[1]:010d} 00000 n \n"
        f"{offsets[2]:010d} 00000 n \n"
    ).encode()

    trailer = (
        "trailer\n"
        "<< /Size 4 /Root 1 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF\n"
    ).encode()

    return pdf + obj1 + obj2 + obj3 + xref + trailer


# ── tests ─────────────────────────────────────────────────────────────────────

def test_health():
    print("\n[1] GET / — Health Check")
    resp = get("/")
    print(json.dumps(resp, indent=2))
    assert resp.get("status") == "ok", "Health check failed!"
    print("    PASSED")


def test_upload_valid_pdf():
    print("\n[2] POST /api/v1/upload — Valid PDF")
    pdf_bytes = make_minimal_pdf()
    body = build_multipart("file", "test_judgment.pdf", pdf_bytes)
    resp = post(
        "/api/v1/upload",
        body,
        f"multipart/form-data; boundary={BOUNDARY}",
    )
    print(json.dumps(resp, indent=2))
    assert "file_id" in resp, "file_id missing from response!"
    assert "file_path" in resp, "file_path missing!"
    assert os.path.exists(resp["file_path"]), "Saved file not found on disk!"
    print("    PASSED — file saved to:", resp["file_path"])
    return resp["file_id"]


def test_upload_non_pdf():
    print("\n[3] POST /api/v1/upload — Non-PDF (should be rejected)")
    fake_data = b"this is not a pdf at all"
    body = build_multipart("file", "fake.txt", fake_data, mime="text/plain")
    resp = post(
        "/api/v1/upload",
        body,
        f"multipart/form-data; boundary={BOUNDARY}",
    )
    print(json.dumps(resp, indent=2))
    assert "error" in resp or "detail" in resp, "Expected rejection, got success!"
    print("    PASSED — correctly rejected non-PDF")


def test_upload_fake_pdf_extension():
    print("\n[4] POST /api/v1/upload — Fake PDF (correct MIME, bad content)")
    fake_data = b"I am a fake pdf content but not really"
    body = build_multipart("file", "fake.pdf", fake_data, mime="application/pdf")
    resp = post(
        "/api/v1/upload",
        body,
        f"multipart/form-data; boundary={BOUNDARY}",
    )
    print(json.dumps(resp, indent=2))
    assert "error" in resp or "detail" in resp, "Expected rejection for bad PDF magic bytes!"
    print("    PASSED — correctly rejected invalid PDF content")


# ── main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 55)
    print("  NyayaLens Backend — Upload Endpoint Test Suite")
    print("=" * 55)

    try:
        test_health()
        test_upload_valid_pdf()
        test_upload_non_pdf()
        test_upload_fake_pdf_extension()

        print("\n" + "=" * 55)
        print("  ALL TESTS PASSED")
        print("=" * 55)

    except AssertionError as e:
        print(f"\n  FAILED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n  ERROR: {e}")
        print("  Is the server running? → python main.py")
        sys.exit(1)
