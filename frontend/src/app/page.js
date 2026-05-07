"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Backend integrations ───────────────────────────────────────────────────
import { uploadDocument, analyzeDocument, verifyActions, fetchVerifiedCases, fetchRecentCases, searchCases } from '../lib/api';
import { getLocalCases, saveLocalCase, syncCases } from '../lib/persistence';
import { generateReport } from '../lib/reportGenerator';

// ─── Component Worlds ───────────────────────────────────────────────────────
import JudicialCommandCenter from './components/JudicialCommandCenter';
import CitizenPortal from './components/CitizenPortal';
import Masthead from './components/Masthead';
import LegalNoticeBoard from './components/LegalNoticeBoard';
import dynamic from 'next/dynamic';
const EvidenceViewer = dynamic(() => import('./components/EvidenceViewer'), { ssr: false });

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();

  // ── Shared State ──────────────────────────────────────────────────────────
  const [role, setRole] = useState(null);
  const [cases, setCases] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeView, setActiveView] = useState("dashboard"); // dashboard | extraction
  const [activeEvidence, setActiveEvidence] = useState(null);
  
  // Extraction specific state
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileId, setFileId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(null);

  const [noticesOpen, setNoticesOpen] = useState(false);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      router.push("/role-select");
    } else {
      setRole(savedRole);
      document.body.setAttribute('data-role', savedRole);
      if (savedRole === "citizen") setActiveView("dashboard");
    }
    loadCases();
    loadRecent();
  }, [router]);

  const loadCases = async () => {
    try {
      const backendCases = await fetchVerifiedCases();
      setCases(syncCases(backendCases));
    } catch (err) {
      setCases(getLocalCases());
    }
  };

  const loadRecent = async () => {
    try {
      const data = await fetchRecentCases(6);
      setRecentCases(data);
    } catch (err) {
      console.warn("Recent fetch failed");
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleProcessDocument = async (selectedFile) => {
    try {
      setStatus("uploading");
      const uploadResult = await uploadDocument(selectedFile);
      setFileId(uploadResult.file_id);
      setStatus("analyzing");
      const analyzeResult = await analyzeDocument(uploadResult.file_id);
      setAnalysisResult(analyzeResult.analysis);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const handleVerify = async () => {
    if (!analysisResult) return;
    const trackingID = `NY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const payload = analysisResult.actions.map((_, idx) => ({ index: idx, status: "approved" }));
      await verifyActions(fileId, payload);
      const verifiedData = {
        file_id: fileId,
        tracking_id: trackingID,
        summary: analysisResult.case_summary,
        verified_actions: analysisResult.actions,
        citizen_explanation: analysisResult.citizen_explanation,
        status: "verified",
        timestamp: new Date().toISOString()
      };
      saveLocalCase(verifiedData);
      setVerificationSuccess(trackingID);
      await loadCases();
      await loadRecent();
      setAnalysisResult(null);
      setActiveView("dashboard");
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  if (!role) return null;

  return (
    <div style={{ position: "relative" }}>
      
      {/* ── SPLIT VIEW EVIDENCE LAYER ─────────────────────────────────────── */}
      <AnimatePresence>
        {activeEvidence && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ 
              position: "fixed", 
              top: 0, 
              right: 0, 
              width: "50vw", 
              height: "100vh", 
              zIndex: 100,
              boxShadow: "-10px 0 30px rgba(0,0,0,0.3)"
            }}
          >
            <EvidenceViewer 
              fileId={activeEvidence.fileId}
              highlightText={activeEvidence.highlightText}
              pageNumber={activeEvidence.pageNumber}
              onClose={() => setActiveEvidence(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHARED MASTHEAD ─────────────────────────────────────────────── */}
      <Masthead 
        role={role}
        activeCasesCount={cases.length}
        criticalCount={cases.filter(c => c.verified_actions?.[0]?.risk_level === "HIGH").length}
        noticesOpen={noticesOpen}
        onToggleNotices={() => setNoticesOpen(!noticesOpen)}
        onSwitchRole={() => { localStorage.removeItem("role"); router.push("/role-select"); }}
      />
      <LegalNoticeBoard isOpen={noticesOpen} onClose={() => setNoticesOpen(false)} role={role} />

      {/* ── ROLE-BASED WORLD RENDERING ───────────────────────────────────── */}
      <div className="newspaper-spread">
        {role === "officer" ? (
          <JudicialCommandCenter 
            analysisResult={analysisResult}
            cases={cases}
            recentCases={recentCases}
            activeView={activeView}
            setActiveView={setActiveView}
            onSelectCase={setSelectedCase}
            onVerify={handleVerify}
            onActionClick={(action) => {
              if (action.source_available) {
                setActiveEvidence({ fileId, highlightText: action.source_text, pageNumber: action.page });
              }
            }}
            file={file}
            status={status}
            errorMsg={errorMsg}
            onFileChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
                setAnalysisResult(null);
              }
            }}
            onProcessDocument={() => handleProcessDocument(file)}
          />
        ) : (
          <CitizenPortal 
            selectedCase={selectedCase}
            cases={cases}
            onSelectCase={setSelectedCase}
            onBack={() => setSelectedCase(null)}
          />
        )}
      </div>

      {/* ── FLOATING EDITION TOGGLE ── */}
      <button 
        onClick={() => { localStorage.removeItem("role"); router.push("/role-select"); }}
        className="luxury-border paper-emboss"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "var(--paper-white)",
          border: "1px solid var(--newsprint-gray)",
          color: "var(--ink-black)",
          padding: "0.6rem 1.2rem",
          fontFamily: "var(--sans)",
          fontSize: "0.65rem",
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: "pointer",
          zIndex: 50,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
        }}
      >
        Return to Front Page
      </button>

    </div>
  );
}
