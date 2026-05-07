"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * FilingDesk — replaces old "Upload Source Document" box.
 * Keeps: handleFileChange, handleProcessDocument, status, file state.
 * Replaces: generic file input box → large filing desk section.
 */
export default function FilingDesk({
  file,
  status,
  errorMsg,
  onFileChange,
  onProcessDocument,
}) {
  const statusLabel = {
    idle: "Submit for Intelligence Processing",
    uploading: "Uploading Case File...",
    analyzing: "Running Judicial Extraction...",
    success: "Intelligence Ready",
    error: "Retry Submission",
  }[status];

  const isLoading = status === "uploading" || status === "analyzing";

  return (
    <div
      style={{
        padding: "4rem 2rem",
        background: "var(--card-bg)",
        border: `2px dashed var(--border-dim)`,
        position: "relative",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .35s",
        overflow: "hidden",
        boxShadow: "inset 0 0 50px rgba(0,0,0,0.05)"
      }}
      onClick={() => !isLoading && document.getElementById("filing-input").click()}
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--accent-gold)"; }}
      onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-dim)"; }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = "var(--border-dim)";
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFileChange({ target: { files: [dropped] } });
      }}
    >
      <div
        className="official-seal-bg material-symbols-outlined"
      >
        account_balance
      </div>

      {/* Archival Background Text */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: 0,
          right: 0,
          fontFamily: "var(--serif-display)",
          fontSize: "4.5rem",
          fontWeight: 900,
          color: "var(--text-main)",
          opacity: 0.02,
          textAlign: "center",
          letterSpacing: ".15em",
          lineHeight: .9,
          pointerEvents: "none",
          userSelect: "none",
          textTransform: "uppercase"
        }}
      >
        Official Filing Area
      </div>

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ fontSize: "3rem", marginBottom: "1.5rem", color: "var(--accent-gold)", opacity: 0.9 }}
        >
          {isLoading ? (
             <motion.span 
               animate={{ rotate: 360 }} 
               transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
               className="material-symbols-outlined" 
               style={{ fontSize: "64px" }}
             >
               hourglass_empty
             </motion.span>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: "64px" }}>history_edu</span>
          )}
        </motion.div>

        <h2
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "2.4rem",
            fontWeight: 800,
            letterSpacing: "-.02em",
            color: "var(--text-main)",
            marginBottom: "1rem",
            position: "relative"
          }}
        >
          {file ? (
            <>
              {file.name}
              <div style={{
                position: "absolute",
                top: "-2rem",
                right: "-2rem",
                transform: "rotate(15deg)",
                border: "3px solid var(--accent-gold)",
                color: "var(--accent-gold)",
                padding: "0.2rem 0.6rem",
                fontFamily: "var(--sans)",
                fontSize: "0.6rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}>
                Staged for Review
              </div>
            </>
          ) : "Submit Official Record"}
        </h2>

        <p
          style={{
            fontFamily: "var(--serif-body)",
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            maxWidth: "480px",
            margin: "0 auto 2.5rem auto",
            fontStyle: "italic"
          }}
        >
          {file
            ? `Source size: ${(file.size / 1024).toFixed(1)} KB. Staged for intelligent archival extraction.`
            : "Drop court judgments or verified orders onto the desk. NyayaLens will extract actionable proceedings and index them into the judicial archive."}
        </p>

        <input
          id="filing-input"
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={onFileChange}
        />

        {file && status !== "success" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProcessDocument();
            }}
            disabled={isLoading}
            style={{
              background: isLoading ? "var(--border-dim)" : "var(--accent-gold)",
              color: "white",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              padding: "1rem 2.5rem",
              fontFamily: "var(--sans)",
              fontSize: "0.8rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              fontWeight: 800,
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
            }}
          >
            {statusLabel}
          </button>
        )}

        {!file && (
          <button
            style={{
              background: "var(--text-main)",
              color: "var(--card-bg)",
              border: "none",
              cursor: "pointer",
              padding: "0.8rem 2rem",
              fontFamily: "var(--sans)",
              fontSize: "0.75rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              fontWeight: 800,
            }}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("filing-input").click();
            }}
          >
            SELECT RECORD
          </button>
        )}

        {status === "error" && (
          <p
            style={{
              marginTop: "1.5rem",
              fontFamily: "var(--sans)",
              fontSize: ".8rem",
              color: "var(--court-red)",
              fontWeight: 600,
            }}
          >
            ⚠ ERROR: {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
