"""
NyayaLens Backend - Main Application Entry Point

Pipeline: PDF → Text → AI Extraction → Structured Output → API Response
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables (MUST BE BEFORE ROUTER IMPORTS)
load_dotenv()

from routes.upload import router as upload_router
from routes.extract import router as extract_router
from routes.analyze import router as analyze_router
from routes.verify import router as verify_router
from routes.cases import router as cases_router
from routes.pdf import router as pdf_router
from routes.translate import router as translate_router

from database.db import init_db

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="NyayaLens API",
    description="CourtTrack AI – Converts court judgment PDFs into structured legal insights.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.on_event("startup")
def startup_event():
    init_db()
    logger.info("NyayaLens Judicial Archive is online and persistent.")

# ─── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

app.include_router(upload_router,  prefix="/api/v1", tags=["Upload"])
app.include_router(extract_router, prefix="/api/v1", tags=["Extract"])
app.include_router(analyze_router, prefix="/api/v1", tags=["Analyze"])
app.include_router(verify_router,  prefix="/api/v1", tags=["Verify"])
app.include_router(cases_router,   prefix="/api/v1", tags=["Cases"])
app.include_router(translate_router, prefix="/api/v1", tags=["Translate"])
app.include_router(pdf_router, prefix="/api/v1", tags=["PDF"])

# ─── Static Files ─────────────────────────────────────────────────────────────

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount(f"/{UPLOAD_DIR}", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "service": "NyayaLens API",
        "version": "1.0.0",
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST", "0.0.0.0"),
        port=int(os.getenv("APP_PORT", 8000)),
        reload=os.getenv("DEBUG", "true").lower() == "true",
    )
