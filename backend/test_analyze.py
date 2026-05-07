"""
Test script for the /analyze endpoint.
Uploads a sample text and sends it to the /analyze endpoint.
"""
import urllib.request
import json
import time

BASE_URL = "http://localhost:8000/api/v1"
BOUNDARY = "NyayaLensTestBoundaryAnalyze"

def build_multipart(field_name: str, filename: str, data: bytes, mime: str = "application/pdf") -> bytes:
    body = (
        f"--{BOUNDARY}\r\n"
        f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'
        f"Content-Type: {mime}\r\n\r\n"
    ).encode()
    body += data
    body += f"\r\n--{BOUNDARY}--\r\n".encode()
    return body

def post(url: str, body: bytes, content_type: str) -> dict:
    req = urllib.request.Request(url, data=body, method='POST')
    req.add_header('Content-Type', content_type)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()}

def make_test_pdf() -> bytes:
    # PDF with some legal text to test extraction
    pdf = (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n"
        b"4 0 obj\n<< /Length 200 >>\nstream\n"
        b"BT /F1 12 Tf 100 700 Td (IN THE HIGH COURT OF KERALA AT ERNAKULAM) Tj \n"
        b"0 -15 Td (W.P.(C) No. 1234 of 2024) Tj \n"
        b"0 -30 Td (The Revenue Department is directed to file a compliance report within 4 weeks.) Tj \n"
        b"0 -15 Td (Failure to do so will result in contempt proceedings.) Tj ET\n"
        b"endstream\nendobj\n"
        b"xref\n0 5\n0000000000 65535 f \n"
        b"0000000009 00000 n \n0000000058 00000 n \n0000000107 00000 n \n0000000192 00000 n \n"
        b"trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n440\n%%EOF\n"
    )
    return pdf

def run_test():
    print("--- [1] Uploading Test PDF ---")
    pdf_data = make_test_pdf()
    upload_body = build_multipart("file", "legal_test.pdf", pdf_data)
    upload_resp = post(f"{BASE_URL}/upload", upload_body, f"multipart/form-data; boundary={BOUNDARY}")
    
    if "file_id" not in upload_resp:
        print("Upload Failed:", upload_resp)
        return False
    
    file_id = upload_resp["file_id"]
    print(f"Success! File ID: {file_id}")
    
    print("\n--- [2] Triggering /analyze ---")
    print("Ensure OPENAI_API_KEY is set in your .env for this to work!")
    analyze_payload = json.dumps({"file_id": file_id}).encode()
    analyze_resp = post(f"{BASE_URL}/analyze", analyze_payload, "application/json")
    
    if "error" in analyze_resp:
        print("\nAnalyze Failed:", analyze_resp["error"])
        print("Detail:", analyze_resp["detail"])
        return False
        
    print("\nAnalyze Success! Parsed Result:")
    print(json.dumps(analyze_resp["analysis"], indent=2))
    return True

if __name__ == "__main__":
    run_test()
