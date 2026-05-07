"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Backend integrations (PRESERVED — DO NOT REMOVE) ───────────────────────
import { uploadDocument, analyzeDocument, verifyActions, fetchVerifiedCases } from '../lib/api';
import { getLocalCases, saveLocalCase, syncCases } from '../lib/persistence';
import { generateReport } from '../lib/reportGenerator';

// ─── Newspaper UI Components ─────────────────────────────────────────────────
import Masthead from './components/Masthead';
import BreakingStrip from './components/BreakingStrip';
import FilingDesk from './components/FilingDesk';
import EditorialIntelligence from './components/EditorialIntelligence';
import VerificationDesk from './components/VerificationDesk';
import CaseArchive from './components/CaseArchive';
import CaseDetail from './components/CaseDetail';
import NoticesPanel from './components/NoticesPanel';
import CourtCalendar from './components/CourtCalendar';
import ProceedingsTimeline from './components/ProceedingsTimeline';

// ─── Report View (carries over PDF generation) ───────────────────────────────
function ReportView({ generatedReport, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "1px solid var(--newsprint-gray)",
              cursor: "pointer",
              padding: ".3rem .8rem",
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--newsprint-gray)",
            }}
          >
            ← Back
          </button>
          <div>
            <div
              style={{
                fontFamily: "var(--serif-display)",
                fontSize: "1.8rem",
                fontWeight: 900,
                letterSpacing: "-.03em",
                color: "var(--ink-black)",
              }}
            >
              Official Report
            </div>
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".65rem",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "var(--newsprint-gray)",
                opacity: 0.55,
              }}
            >
              Generated Legal Directive — Review before printing
            </div>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            background: "var(--ink-black)",
            color: "var(--paper-white)",
            border: "none",
            cursor: "pointer",
            padding: ".65rem 1.8rem",
            fontFamily: "var(--sans)",
            fontSize: ".75rem",
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          ⬇ Download PDF
        </button>
      </div>
      <div
        style={{
          background: "white",
          border: "2px solid var(--newsprint-gray)",
          padding: "3rem",
          minHeight: 800,
          boxShadow: "0 12px 40px rgba(0,0,0,.1)",
        }}
        dangerouslySetInnerHTML={{ __html: generatedReport?.html || "<p>Report data missing.</p>" }}
      />
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();

  // ── State (all preserved from original) ──────────────────────────────────
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeView, setActiveView] = useState("extraction");

  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileId, setFileId] = useState("");
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [role, setRole] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [trackingSearch, setTrackingSearch] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      router.push("/role-select");
    } else {
      setRole(savedRole);
      if (savedRole === "citizen") setActiveView("dashboard");
      else setActiveView("extraction");
    }
    loadCases();
  }, [router]);

  // ── Helpers (all preserved) ───────────────────────────────────────────────
  const handleCopyID = (id) => {
    navigator.clipboard.writeText(id);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const generateTrackingID = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `NY-2026-${random}`;
  };

  const handleTrackCase = (e) => {
    e.preventDefault();
    const searchID = trackingSearch.trim().toUpperCase();
    const found = cases.find((c) => (c.tracking_id || "").toUpperCase() === searchID);
    if (found) {
      setSelectedCase(found);
      setActiveView("dashboard");
      setTrackingSearch("");
    } else {
      alert(`Tracking ID "${searchID}" not found. Please check the ID and try again.`);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedCase) return;
    const reports = generateReport(selectedCase, role);
    setGeneratedReport(reports);
    setActiveView("report");
  };

  const loadCases = async () => {
    try {
      const backendCases = await fetchVerifiedCases();
      const synced = syncCases(backendCases).map((c) => ({
        ...c,
        tracking_id: c.tracking_id || `NY-${c.file_id.substring(0, 4)}-LEGACY`,
      }));
      setCases(synced);
    } catch (err) {
      console.warn("Backend fetch failed, using local storage fallback", err);
      const local = getLocalCases().map((c) => ({
        ...c,
        tracking_id: c.tracking_id || `NY-${c.file_id.substring(0, 4)}-LEGACY`,
      }));
      setCases(local);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setAnalysisResult(null);
    }
  };

  const handleProcessDocument = async () => {
    if (!file) return;
    try {
      setStatus("uploading");
      setErrorMsg("");
      const uploadResult = await uploadDocument(file);
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

    const trackingID = generateTrackingID();
    const verifiedData = {
      file_id: fileId,
      tracking_id: trackingID,
      summary: analysisResult.decision_summary || analysisResult.case_summary,
      verified_actions: analysisResult.actions,
      citizen_explanation: analysisResult.citizen_explanation,
      status: "VERIFIED",
      timestamp: new Date().toISOString(),
    };

    try {
      const payload = analysisResult.actions.map((action, idx) => ({
        index: idx,
        status: "approved",
      }));
      await verifyActions(fileId, payload);
      saveLocalCase(verifiedData);
      setVerificationSuccess(trackingID);
      await loadCases();
      setAnalysisResult(null);
      setActiveView("dashboard");
    } catch (err) {
      console.error("Failed to verify case", err);
      saveLocalCase(verifiedData);
      setVerificationSuccess(trackingID);
      await loadCases();
      setAnalysisResult(null);
      setActiveView("dashboard");
    }
  };

  const handleSwitchRole = () => {
    localStorage.removeItem("role");
    router.push("/role-select");
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const criticalCases = cases.filter((c) =>
    c.verified_actions?.some((a) => a.risk_level === "HIGH")
  );

  if (!role) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "relative",
        zIndex: 6,
        background: "var(--paper-white)",
        minHeight: "100vh",
      }}
    >
      {/* ── MASTHEAD ─────────────────────────────────────────────────────── */}
      <Masthead
        role={role}
        activeCasesCount={cases.length}
        criticalCount={criticalCases.length}
        onToggleNotices={() => setShowNotifications((v) => !v)}
        onSwitchRole={handleSwitchRole}
        noticesOpen={showNotifications}
      />

      {/* ── BREAKING STRIP ───────────────────────────────────────────────── */}
      <BreakingStrip cases={cases} />

      {/* ── VIEW TABS (newspaper-style) ──────────────────────────────────── */}
      <div
        style={{
          background: "var(--paper-cream)",
          borderBottom: "1px solid rgba(0,0,0,.1)",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: ".5rem 2.5rem",
            display: "flex",
            gap: 0,
          }}
        >
          {[
            { key: "dashboard", label: role === "citizen" ? "Archived Proceedings" : "Case Ledger", show: true },
            { key: "extraction", label: "Filing Desk", show: role === "judge" },
            { key: "report", label: "Generated Report", show: !!generatedReport },
          ]
            .filter((t) => t.show)
            .map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".68rem",
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: ".6rem 1.2rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: activeView === tab.key ? "var(--ink-black)" : "rgba(0,0,0,.4)",
                  borderBottom: activeView === tab.key ? "2px solid var(--ink-black)" : "2px solid transparent",
                  transition: "all .2s",
                }}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      {/* ── NEWSPAPER SPREAD ─────────────────────────────────────────────── */}
      <div
        className="newspaper-grid"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "2.5rem",
          display: "grid",
          gridTemplateColumns: showNotifications ? "3fr 1fr" : "1fr",
          gap: "3rem",
        }}
      >
        {/* ── EDITORIAL COLUMN (main) ──────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <AnimatePresence mode="wait">
            {/* ── REPORT VIEW ──────────────────────────────────────────── */}
            {activeView === "report" && generatedReport && (
              <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ReportView generatedReport={generatedReport} onBack={() => setActiveView("dashboard")} />
              </motion.div>
            )}

            {/* ── FILING DESK + AI REVIEW ──────────────────────────────── */}
            {activeView === "extraction" && (
              <motion.div
                key="extraction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
              >
                {/* Proceedings Timeline */}
                <ProceedingsTimeline selectedCase={null} />

                {/* Filing Desk */}
                <FilingDesk
                  file={file}
                  status={status}
                  errorMsg={errorMsg}
                  onFileChange={handleFileChange}
                  onProcessDocument={handleProcessDocument}
                />

                {/* AI Analysis Result */}
                {analysisResult && (
                  <EditorialIntelligence analysisResult={analysisResult} role={role} />
                )}

                {/* Verification Desk */}
                {analysisResult && (
                  <VerificationDesk
                    analysisResult={analysisResult}
                    verificationSuccess={verificationSuccess}
                    copySuccess={copySuccess}
                    onVerify={handleVerify}
                    onCopyID={handleCopyID}
                  />
                )}
              </motion.div>
            )}

            {/* ── CASE ARCHIVE / DASHBOARD ─────────────────────────────── */}
            {activeView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
              >
                {/* Verification success banner */}
                {verificationSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "rgba(45,106,79,.08)",
                      border: "2px solid var(--green-verified)",
                      padding: "1.2rem 1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--green-verified)", fontWeight: 800, marginBottom: ".3rem" }}>
                        ✓ Case Certified & Archived
                      </div>
                      <div style={{ fontFamily: "var(--serif-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--ink-black)" }}>
                        Tracking ID: <span style={{ color: "var(--green-verified)" }}>{verificationSuccess}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: ".8rem" }}>
                      <button
                        onClick={() => handleCopyID(verificationSuccess)}
                        style={{ background: "var(--green-verified)", color: "white", border: "none", cursor: "pointer", padding: ".4rem 1rem", fontFamily: "var(--sans)", fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}
                      >
                        {copySuccess ? "✓ Copied" : "Copy ID"}
                      </button>
                      <button
                        onClick={() => setVerificationSuccess(null)}
                        style={{ background: "none", border: "1px solid var(--newsprint-gray)", cursor: "pointer", padding: ".4rem .8rem", fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--newsprint-gray)" }}
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Citizen: Tracking Search */}
                {role === "citizen" && (
                  <div>
                    <div style={{ fontFamily: "var(--serif-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink-black)", marginBottom: "1rem", letterSpacing: "-.02em" }}>
                      Track Your Case
                    </div>
                    <form
                      onSubmit={handleTrackCase}
                      style={{ display: "flex", gap: "1rem", maxWidth: 560, flexWrap: "wrap" }}
                    >
                      <input
                        type="text"
                        placeholder="Enter Tracking ID (e.g. NY-2026-1234)"
                        value={trackingSearch}
                        onChange={(e) => setTrackingSearch(e.target.value)}
                        style={{
                          flex: 1,
                          border: "1px solid var(--newsprint-gray)",
                          padding: ".6rem 1rem",
                          fontFamily: "var(--sans)",
                          fontSize: ".85rem",
                          background: "var(--paper-white)",
                          outline: "none",
                          color: "var(--ink-black)",
                          minWidth: 240,
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: "var(--ink-black)",
                          color: "var(--paper-white)",
                          border: "none",
                          cursor: "pointer",
                          padding: ".6rem 1.5rem",
                          fontFamily: "var(--sans)",
                          fontSize: ".72rem",
                          letterSpacing: ".12em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        Access Report
                      </button>
                    </form>
                  </div>
                )}

                {/* Proceedings Timeline */}
                <ProceedingsTimeline selectedCase={selectedCase} />

                {/* Case Detail or Archive */}
                {selectedCase ? (
                  <CaseDetail
                    selectedCase={selectedCase}
                    role={role}
                    onBack={() => setSelectedCase(null)}
                    onGenerateReport={handleGenerateReport}
                  />
                ) : (
                  <CaseArchive
                    cases={cases}
                    onSelectCase={setSelectedCase}
                    role={role}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── NOTICES SIDEBAR ─────────────────────────────────────────────── */}
        {showNotifications && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <NoticesPanel cases={cases} isOpen={showNotifications} />
            <CourtCalendar cases={cases} />
          </motion.aside>
        )}
      </div>
    </div>
  );
}
