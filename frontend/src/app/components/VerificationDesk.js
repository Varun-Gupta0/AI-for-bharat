"use client";

import { motion } from "framer-motion";

/**
 * VerificationDesk — replaces old "Approve All" verification panel.
 * Judicial Review Desk in newspaper UI.
 * Keeps: handleVerify logic, verificationSuccess state.
 */
export default function VerificationDesk({
  analysisResult,
  verificationSuccess,
  copySuccess,
  onVerify,
  onCopyID,
}) {
  if (!analysisResult && !verificationSuccess) return null;

  if (verificationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "var(--highlight)",
          border: `2px solid var(--status-verified)`,
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
      >
        <div
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "3rem",
            fontWeight: 900,
            color: "var(--status-verified)",
            border: `4px solid var(--status-verified)`,
            display: "inline-block",
            padding: ".5rem 2rem",
            transform: "rotate(-2deg)",
            letterSpacing: ".1em",
            marginBottom: "1.5rem",
            textTransform: "uppercase"
          }}
        >
          Certified
        </div>
        <div
          style={{
            fontFamily: "var(--serif-body)",
            fontSize: "1.2rem",
            color: "var(--text-main)",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
            fontWeight: 700
          }}
        >
          Case verified and permanently archived in the Judicial Record.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            background: "var(--card-bg)",
            padding: "1rem",
            border: "1px solid var(--border-dim)"
          }}
        >
          <span
            style={{
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              fontWeight: 800
            }}
          >
            RECORD ID:
          </span>
          <span
            style={{
              fontFamily: "var(--serif-display)",
              fontSize: "1.4rem",
              fontWeight: 900,
              color: "var(--accent-gold)",
              letterSpacing: ".05em",
            }}
          >
            {verificationSuccess}
          </span>
          <button
            onClick={() => onCopyID(verificationSuccess)}
            style={{
              background: "var(--accent-gold)",
              color: "white",
              border: "none",
              cursor: "pointer",
              padding: ".5rem 1.2rem",
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              fontWeight: 900,
            }}
          >
            {copySuccess ? "✓ COPIED" : "COPY ID"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className="luxury-border paper-emboss"
      style={{
        background: "var(--card-bg)",
        border: `2px solid var(--court-red)`,
        padding: "2rem 2.5rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >
      <div
        style={{
          fontFamily: "var(--sans)",
          fontSize: ".7rem",
          letterSpacing: ".25em",
          textTransform: "uppercase",
          color: "var(--court-red)",
          fontWeight: 900,
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem"
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>gavel</span>
        Judicial Review Desk — OFFICER VERIFICATION REQUIRED
      </div>
      <div
        style={{
          fontFamily: "var(--serif-body)",
          fontSize: "1.05rem",
          color: "var(--text-main)",
          lineHeight: 1.6,
          marginBottom: "2rem",
          opacity: 0.9
        }}
      >
        Please review the extracted directives above. Upon certification, this case will be 
        committed to the permanent judicial archive and assigned a public tracking identifier.
      </div>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <button
          onClick={onVerify}
          style={{
            background: "var(--status-verified)",
            color: "white",
            border: "none",
            cursor: "pointer",
            padding: "1rem 2.5rem",
            fontFamily: "var(--sans)",
            fontSize: "0.8rem",
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontWeight: 800,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}
        >
          ✓ Certify & Commit to Archive
        </button>
        <button
          style={{
            background: "none",
            border: "1px solid var(--border-dim)",
            cursor: "pointer",
            padding: "1rem 2.5rem",
            fontFamily: "var(--sans)",
            fontSize: "0.8rem",
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontWeight: 800,
            color: "var(--text-main)",
          }}
        >
          ✎ Manual Correction
        </button>
      </div>
    </div>
  );
}
