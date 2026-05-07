# Project Structure

## Root

courttrack-ai/
│
├── frontend/        # Next.js UI (completed)
├── backend/         # FastAPI backend (in progress)
├── docs/            # Project documentation
├── data/            # Sample PDFs and test files

---

## Frontend

frontend/
├── app/
├── components/
├── pages/
├── styles/

---

## Backend

backend/
├── main.py
├── routes/
│   ├── upload.py
│   ├── verify.py
│   ├── cases.py
│
├── services/
│   ├── ocr_service.py
│   ├── ai_service.py
│   ├── parser_service.py
│   ├── risk_service.py
│
├── models/
│   ├── schema.py
│
├── database/
│   ├── db.py

---

## Docs

docs/
├── AGENT.md
├── PROJECT_GUIDE.md
