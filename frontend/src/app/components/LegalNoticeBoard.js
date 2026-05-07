"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * LegalNoticeBoard — Replaces generic notifications with pinned legal notices,
 * official bulletins, and courtroom directives.
 */
export default function LegalNoticeBoard({ isOpen, onClose, role }) {
  if (!isOpen) return null;

  const notices = [
    {
      id: 1,
      type: "URGENCY",
      title: "Immediate Action Required",
      description: "Compliance deadline approaching for Case NY-2026-8491. Escalation risk detected.",
      timestamp: "10 Mins Ago",
      severity: "critical",
    },
    {
      id: 2,
      type: "PROCEEDING",
      title: "Verification Pending",
      description: "Revenue Department proceeding requires officer verification.",
      timestamp: "1 Hour Ago",
      severity: "high",
    },
    {
      id: 3,
      type: "NOTICE",
      title: "Court Directive Archived",
      description: "Case NY-2026-1120 has been certified and archived.",
      timestamp: "3 Hours Ago",
      severity: "medium",
    },
    {
      id: 4,
      type: "NOTICE",
      title: "New Judgment Uploaded",
      description: "State High Court judgment added to the local repository.",
      timestamp: "1 Day Ago",
      severity: "informational",
    }
  ];

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "critical":
        return { color: "var(--court-red)", bg: "rgba(139,26,26,0.05)", border: "var(--court-red)" };
      case "high":
        return { color: "var(--amber-warn)", bg: "rgba(180,130,0,0.05)", border: "var(--amber-warn)" };
      case "medium":
        return { color: "var(--accent-blue)", bg: "rgba(30,58,138,0.05)", border: "var(--accent-blue)" };
      case "informational":
      default:
        return { color: "var(--newsprint-gray)", bg: "rgba(0,0,0,0.03)", border: "var(--border-dim)" };
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          position: "absolute",
          top: "100%",
          right: "2.5rem",
          width: "400px",
          background: "var(--card-bg)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          zIndex: 1000,
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
        className="luxury-border paper-emboss"
      >
        {/* Header */}
        <div style={{ padding: "1.5rem", borderBottom: "3px double var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontFamily: "var(--serif-display)", fontSize: "1.4rem", fontWeight: 900, color: "var(--text-main)", letterSpacing: "0.02em", margin: 0 }}>
              Legal Notice Board
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0.3rem 0 0 0", fontWeight: 700 }}>
              Official Administrative Bulletins
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)" }}>
            ×
          </button>
        </div>

        {/* Notices List */}
        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {notices.map((notice) => {
            const style = getSeverityStyle(notice.severity);
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  position: "relative",
                  background: "var(--paper-white)",
                  border: "1px solid var(--border-dim)",
                  borderLeft: `4px solid ${style.border}`,
                  padding: "1.2rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 15px rgba(0,0,0,0.05)" }}
              >
                {/* Pin/Clip Visual */}
                <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: "20px", height: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "2px" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ 
                    fontFamily: "var(--sans)", 
                    fontSize: "0.55rem", 
                    fontWeight: 900, 
                    letterSpacing: "0.2em", 
                    textTransform: "uppercase", 
                    color: style.color,
                    background: style.bg,
                    padding: "0.2rem 0.5rem",
                  }}>
                    {notice.type}
                  </span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {notice.timestamp}
                  </span>
                </div>
                
                <h4 style={{ fontFamily: "var(--serif-display)", fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)", margin: "0 0 0.4rem 0", lineHeight: 1.3 }}>
                  {notice.title}
                </h4>
                
                <p style={{ fontFamily: "var(--serif-body)", fontSize: "0.85rem", color: "var(--newsprint-gray)", margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                  {notice.description}
                </p>

                {notice.severity === "critical" && (
                  <div style={{ position: "absolute", bottom: "10px", right: "10px", transform: "rotate(-10deg)", border: "2px solid var(--court-red)", color: "var(--court-red)", padding: "0.1rem 0.4rem", fontFamily: "var(--sans)", fontSize: "0.5rem", fontWeight: 900, letterSpacing: "0.1em" }}>
                    URGENT
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem", borderTop: "1px solid var(--border-dim)", textAlign: "center", background: "var(--paper-white)" }}>
          <button style={{ background: "none", border: "none", fontFamily: "var(--sans)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer" }}>
            View Complete Archive
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
