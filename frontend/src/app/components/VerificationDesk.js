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
          background: "rgba(45,106,79,.06)",
          border: "2px solid var(--green-verified)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "3rem",
            fontWeight: 900,
            color: "var(--green-verified)",
            border: "3px solid var(--green-verified)",
            display: "inline-block",
            padding: ".4rem 1.5rem",
            transform: "rotate(-1.5deg)",
            letterSpacing: ".1em",
            marginBottom: "1rem",
          }}
        >
          CERTIFIED
        </div>
        <div
          style={{
            fontFamily: "var(--serif-body)",
            fontSize: "1.1rem",
            color: "var(--newsprint-gray)",
            marginBottom: "1.2rem",
            lineHeight: 1.6,
          }}
        >
          Case verified and archived in the Judicial Record.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--newsprint-gray)",
              opacity: 0.6,
            }}
          >
            Tracking ID:
          </span>
          <span
            style={{
              fontFamily: "var(--serif-display)",
              fontSize: "1.3rem",
              fontWeight: 900,
              color: "var(--green-verified)",
              letterSpacing: ".05em",
            }}
          >
            {verificationSuccess}
          </span>
          <button
            onClick={() => onCopyID(verificationSuccess)}
            style={{
              background: "var(--green-verified)",
              color: "white",
              border: "none",
              cursor: "pointer",
              padding: ".3rem .8rem",
              fontFamily: "var(--sans)",
              fontSize: ".65rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {copySuccess ? "✓ Copied" : "Copy ID"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(139,26,26,.06)",
        border: "2px solid var(--red-bright)",
        padding: "1.5rem 2rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--sans)",
          fontSize: ".7rem",
          letterSpacing: ".25em",
          textTransform: "uppercase",
          color: "var(--red-bright)",
          fontWeight: 800,
          marginBottom: "1rem",
        }}
      >
        ⚖ Judicial Review Desk — Officer Verification Required
      </div>
      <div
        style={{
          fontFamily: "var(--serif-body)",
          fontSize: "1rem",
          color: "var(--newsprint-gray)",
          lineHeight: 1.6,
          marginBottom: "1.5rem",
        }}
      >
        Review the extracted directives above. Upon approval, this case will be certified
        and archived in the system with a unique tracking ID.
      </div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={onVerify}
          style={{
            background: "var(--green-verified)",
            color: "white",
            border: "none",
            cursor: "pointer",
            padding: ".65rem 1.8rem",
            fontFamily: "var(--sans)",
            fontSize: ".75rem",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            fontWeight: 700,
            transition: "opacity .25s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = ".85")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          ✓ Certify & Archive Case
        </button>
        <button
          style={{
            background: "none",
            border: "1px solid var(--newsprint-gray)",
            cursor: "pointer",
            padding: ".65rem 1.8rem",
            fontFamily: "var(--sans)",
            fontSize: ".75rem",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "var(--newsprint-gray)",
            transition: "all .25s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "var(--newsprint-gray)";
            e.target.style.color = "var(--paper-white)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "none";
            e.target.style.color = "var(--newsprint-gray)";
          }}
        >
          ✎ Edit Manually
        </button>
      </div>
    </div>
  );
}
