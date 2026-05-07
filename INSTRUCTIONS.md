# NyayaLens: Institutional Judicial Intelligence

NyayaLens is a premium judicial intelligence platform that transforms court judgment PDFs into a cinematic "Living Legal Newspaper" experience. It uses a 3-layer AI pipeline to extract structured directives, link evidence, and provide simplified explanations for citizens.

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
1. **Python 3.10+**
2. **Node.js 18+**
3. **Ollama** (for local AI processing)

---

## 🚀 Getting Started

### 1. Setup the Backend
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Environment Variables (`backend/.env`)
Create a `.env` file in the `backend` folder with:
```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=google/gemma-3-4b-it
UPLOAD_DIR=uploads
DEBUG=true
```

### 2. Setup the Frontend
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

### 3. Setup AI (Ollama)
Download and start Ollama, then pull the required model:
```bash
ollama serve
ollama pull qwen2.5:3b
```

---

## 🏃 Running the Platform

To run the full system, you need **three terminals** open:

### Terminal 1: AI Engine
```bash
ollama serve
```

### Terminal 2: Backend API
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Terminal 3: Frontend UI
```bash
cd frontend
npm run dev
```

---

## 📍 Accessing the App
*   **Web Interface**: [http://localhost:3000](http://localhost:3000)
*   **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🏛 Key Features
*   **Living Legal Newspaper**: Cinematic UI with 3D archival layers.
*   **3-Layer AI Pipeline**: Combines Rule-based extraction, Local Ollama, and Cloud AI (OpenRouter).
*   **Institutional Realism**: Judicial status stamps, breaking proceedings ticker, and administrative notice boards.
*   **Role-Based views**: Dedicated interfaces for Judges (Command Center) and Citizens (Legal Transparency).
