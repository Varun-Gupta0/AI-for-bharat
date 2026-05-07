"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import JudicialStatusStamp from "./JudicialStatusStamp";

/**
 * CaseArchive — The Judicial Records Repository
 * 
 * Replaces generic grids with a cinematic "Stacked Judicial Archives" design.
 * Features:
 * - Stacked paper visual depth
 * - Historical timestamps
 * - Risk & Status indicators
 * - Tracking ID preservation
 */
export default function CaseArchive({ cases, onSelectCase, role }) {
  const { t } = useLanguage();

  if (cases.length === 0) {
    return (
      <div
        className="empty-archive"
        style={{
          padding: "5rem 2rem",
          textAlign: "center",
          border: "2px dashed var(--newsprint-gray)",
          background: "var(--paper-cream)",
          borderRadius: "4px",
          opacity: 0.7,
        }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem", opacity: 0.3 }}>📁</div>
        <h3 style={{ fontFamily: "var(--serif-display)", fontSize: "1.8rem", fontWeight: 700, color: "var(--ink-black)", marginBottom: ".5rem" }}>
          Repository Empty
        </h3>
        <p style={{ fontFamily: "var(--serif-body)", fontSize: "1.1rem", color: "var(--newsprint-gray)", maxWidth: 400, margin: "0 auto" }}>
          {role === "citizen" 
            ? "Enter a tracking ID to retrieve specific proceedings from the archive." 
            : "No proceedings have been archived yet. Process a document to begin."}
        </p>
      </div>
    );
  }

  const getStatusStyle = (c) => {
    const status = c.status?.toUpperCase() || "VERIFIED";
    const risk = c.verified_actions?.[0]?.risk_level || "LOW";
    
    if (status === "PENDING") return { label: "Pending Review", color: "var(--newsprint-gray)", bg: "rgba(0,0,0,0.05)" };
    if (status === "ESCALATED") return { label: "Escalated", color: "var(--red-bright)", bg: "rgba(139,26,26,0.08)" };
    
    if (risk === "HIGH") return { label: "Critical Priority", color: "var(--red-bright)", bg: "rgba(139,26,26,0.05)" };
    if (risk === "MEDIUM") return { label: "Action Required", color: "var(--amber-warn)", bg: "rgba(180,130,0,0.05)" };
    return { label: "Verified Record", color: "var(--green-verified)", bg: "rgba(45,106,79,0.05)" };
  };

  return (
    <div className="judicial-archive-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", borderBottom: "3px solid var(--ink-black)", paddingBottom: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--serif-display)", fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-.03em", color: "var(--ink-black)", marginBottom: "0.2rem" }}>
            {role === "officer" ? t("verifiedJudicialArchive") : t("publicLegalRecords")}
          </h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--newsprint-gray)", opacity: 0.6 }}>
            Historical Legal Memory System • {cases.length} Records
          </p>
        </div>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 700, color: "var(--newsprint-gray)" }}>
          VOLUME {new Date().getFullYear()}.IV
        </div>
      </div>

        <div
        className="archive-stack-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {cases.map((c, i) => {
          const st = getStatusStyle(c);
          const primaryAction = c.verified_actions?.[0] || {};
          const displayDate = c.timestamp ? new Date(c.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently Archived";

          return (
            <motion.div
              key={c.file_id || i}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: i * 0.08 }}
              onClick={() => onSelectCase(c)}
              className="archive-entry-card"
              style={{
                position: "relative",
                cursor: "pointer",
                perspective: "1000px"
              }}
            >
              {/* Stacked Paper Effect - Background Layers */}
              <div style={{ position: "absolute", top: 4, left: 4, right: -4, bottom: -4, background: "var(--card-bg)", border: "1px solid var(--border-dim)", zIndex: 1, opacity: 0.5, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} />
              <div style={{ position: "absolute", top: 8, left: 8, right: -8, bottom: -8, background: "var(--card-bg)", border: "1px solid var(--border-dim)", zIndex: 0, opacity: 0.3, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} />

              {/* Main Content Layer */}
              <motion.div
                whileHover={{ y: -12, x: -6, rotateZ: -1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="luxury-border paper-emboss"
                style={{
                  position: "relative",
                  zIndex: 2,
                  background: "var(--card-bg)",
                  padding: "1.8rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                {/* Archive Header */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.2rem" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 800, color: "var(--text-muted)", opacity: 0.5 }}>
                    RECORD ID: {c.tracking_id || c.file_id?.substring(0, 8).toUpperCase() || "N/A"}
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "var(--text-muted)", opacity: 0.4 }}>
                    {displayDate}
                  </div>
                </div>

                {/* Title / Summary */}
                <h3 style={{ 
                  fontFamily: "var(--serif-display)", 
                  fontSize: "1.25rem", 
                  fontWeight: 800, 
                  lineHeight: 1.25, 
                  color: "var(--text-main)", 
                  marginBottom: "1rem",
                  flexGrow: 1
                }}>
                  {c.summary?.slice(0, 100) || "Judicial Proceeding Detail"}
                  {c.summary?.length > 100 ? "..." : ""}
                </h3>

                {/* Meta Details */}
                <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: "1rem", marginTop: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".6rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text-muted)", opacity: 0.6, marginBottom: "0.2rem" }}>
                        Primary Department
                      </div>
                      <div style={{ fontFamily: "var(--serif-body)", fontSize: ".85rem", fontWeight: 700, color: "var(--text-main)" }}>
                        {primaryAction.department || "Public Law"}
                      </div>
                    </div>
                    
                    <JudicialStatusStamp status={c.status} />
                  </div>
                </div>

                {/* Archived Watermark */}
                <div style={{ 
                  position: "absolute", 
                  bottom: "20%", 
                  right: "10%", 
                  transform: "rotate(-15deg)", 
                  fontFamily: "var(--serif-display)", 
                  fontSize: "2rem", 
                  fontWeight: 900, 
                  color: "var(--text-main)", 
                  opacity: 0.03,
                  pointerEvents: "none",
                  textTransform: "uppercase" 
                }}>
                  ARCHIVED
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
