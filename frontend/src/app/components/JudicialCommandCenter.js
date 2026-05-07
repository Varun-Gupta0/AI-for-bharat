"use client";

import { motion } from "framer-motion";
import BreakingProceedingsStrip from "./BreakingProceedingsStrip";
import CaseArchive from "./CaseArchive";
import RecentProceedings from "./RecentProceedings";
import EditorialIntelligence from "./EditorialIntelligence";
import VerificationDesk from "./VerificationDesk";
import FilingDesk from "./FilingDesk";

/**
 * JudicialCommandCenter — High-authority operational workspace for Judges/Officers.
 */
export default function JudicialCommandCenter({ 
  analysisResult, 
  cases, 
  recentCases, 
  onSelectCase, 
  onVerify,
  onActionClick,
  activeView,
  setActiveView,
  file,
  status,
  errorMsg,
  onFileChange,
  onProcessDocument
}) {
  return (
    <div className="judicial-command-root" style={{ background: "transparent", minHeight: "100vh" }}>
      <BreakingProceedingsStrip />
      
      <div className="judge-layout" style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "2rem", marginTop: "2rem" }}>
        {/* Left Col: Operations & Recent */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ border: "1px solid var(--border-dim)", background: "var(--card-bg)", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--serif-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-gold)", marginBottom: "1rem" }}>
              Judicial Ops
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <button 
                onClick={() => setActiveView("extraction")}
                style={{ 
                  background: activeView === "extraction" ? "var(--highlight)" : "none",
                  border: "1px solid var(--border-dim)",
                  padding: "0.8rem",
                  color: "var(--text-main)",
                  fontFamily: "var(--sans)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                PROCEEDING EXTRACTION
              </button>
              <button 
                onClick={() => setActiveView("dashboard")}
                style={{ 
                  background: activeView === "dashboard" ? "var(--highlight)" : "none",
                  border: "1px solid var(--border-dim)",
                  padding: "0.8rem",
                  color: "var(--text-main)",
                  fontFamily: "var(--sans)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                ARCHIVE REPOSITORY
              </button>
            </div>
          </div>
          
          <RecentProceedings recentCases={recentCases} onSelectCase={onSelectCase} />
          
          <div style={{ 
            border: "2px solid var(--court-red)", 
            padding: "1.5rem", 
            background: "rgba(139, 26, 26, 0.05)", 
            color: "var(--court-red)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ 
              position: "absolute", 
              top: "-10px", 
              right: "-10px", 
              fontSize: "3rem", 
              opacity: 0.1, 
              transform: "rotate(15deg)",
              pointerEvents: "none"
            }} className="material-symbols-outlined">report_problem</div>
            
            <h4 style={{ fontFamily: "var(--sans)", fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.8rem", color: "var(--court-red)" }}>
              Statutory Breach Report
            </h4>
            <p style={{ fontFamily: "var(--serif-body)", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.4, marginBottom: "0.5rem" }}>
              CRITICAL: 3 Departments currently in breach of statutory timelines.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "0.6rem", opacity: 0.8 }}>
              Contempt proceedings may be initiated if compliance is not verified within 48 hours.
            </p>
          </div>
        </aside>

        {/* Main Col: Intelligence & Verification */}
        <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {activeView === "extraction" ? (
            <>
              <FilingDesk 
                file={file}
                status={status}
                errorMsg={errorMsg}
                onFileChange={onFileChange}
                onProcessDocument={onProcessDocument}
              />
              
              {analysisResult && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <EditorialIntelligence 
                    analysisResult={analysisResult} 
                    role="officer" 
                    onActionClick={onActionClick}
                  />
                  <VerificationDesk 
                    analysisResult={analysisResult} 
                    onVerify={onVerify}
                  />
                </div>
              )}
            </>
          ) : (
            <CaseArchive cases={cases} onSelectCase={onSelectCase} role="officer" />
          )}
        </main>

        {/* Right Col: Intelligence Column */}
        <aside>
          <div style={{ 
            background: "var(--card-bg)", 
            border: "1px solid var(--border-dim)", 
            padding: "2rem",
            height: "100%",
            position: "relative"
          }}>
             <div style={{ 
                position: "absolute", 
                top: "1.5rem", 
                right: "1.5rem", 
                width: "40px", 
                height: "40px", 
                border: "2px solid var(--accent-gold)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.3
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--accent-gold)" }}>gavel</span>
              </div>

            <h3 style={{ fontFamily: "var(--serif-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-gold)", marginBottom: "1.5rem", borderBottom: "3px double var(--border-dim)", paddingBottom: "0.8rem" }}>
              Judicial Intelligence Briefing
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="intelligence-note">
                <p style={{ fontFamily: "var(--sans)", fontSize: "0.6rem", fontWeight: 900, color: "var(--accent-gold)", marginBottom: "0.4rem" }}>INTERPRETATION</p>
                <p style={{ fontFamily: "var(--serif-body)", fontSize: "0.85rem", color: "var(--text-main)", fontStyle: "italic", lineHeight: 1.6 }}>
                  "The AI has flagged the department as 'Revenue' based on the specific mention of land acquisition surveys on Page 4. Proceed with internal notification."
                </p>
              </div>

              <div className="intelligence-note">
                <p style={{ fontFamily: "var(--sans)", fontSize: "0.6rem", fontWeight: 900, color: "var(--accent-gold)", marginBottom: "0.4rem" }}>PROCEDURAL ADVISORY</p>
                <p style={{ fontFamily: "var(--serif-body)", fontSize: "0.85rem", color: "var(--text-main)", fontStyle: "italic", lineHeight: 1.6 }}>
                  "Statutory deadlines for contempt proceedings in such cases are typically 14 days. The 7-day window extracted is high-risk."
                </p>
              </div>
            </div>

            <div style={{ marginTop: "4rem", borderTop: "1px solid var(--border-dim)", paddingTop: "1rem" }}>
              <div className="judicial-stamp" style={{ position: "relative", opacity: 0.1, transform: "rotate(-5deg)", textAlign: "center" }}>
                OFFICIAL RECORD
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
