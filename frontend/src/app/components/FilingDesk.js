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
  const isDragging =
    typeof window !== "undefined" ? false : false; // handled via state in parent

  const statusLabel = {
    idle: "Submit to Filing Desk",
    uploading: "Uploading Document...",
    analyzing: "AI is Extracting Data...",
    success: "Extraction Complete",
    error: "Retry Extraction",
  }[status];

  const isLoading = status === "uploading" || status === "analyzing";

  return (
    <div
      style={{
        padding: "3.5rem 2rem",
        background: "linear-gradient(135deg, var(--paper-white), var(--paper-cream))",
        border: "2px dashed var(--newsprint-gray)",
        position: "relative",
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .35s",
        overflow: "hidden",
      }}
      onClick={() => !isLoading && document.getElementById("filing-input").click()}
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--gold-primary)"; }}
      onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--newsprint-gray)"; }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.style.borderColor = "var(--newsprint-gray)";
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFileChange({ target: { files: [dropped] } });
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: 0,
          right: 0,
          fontFamily: "var(--serif-display)",
          fontSize: "3.5rem",
          fontWeight: 900,
          color: "rgba(0,0,0,.04)",
          textAlign: "center",
          letterSpacing: ".05em",
          lineHeight: .9,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        NYAYALENS FILING DESK
      </div>

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.55 }}>
          {isLoading ? "⚙" : "📄"}
        </div>

        <div
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "-.02em",
            color: "var(--ink-black)",
            marginBottom: ".5rem",
          }}
        >
          {file ? file.name : "Submit New Filing"}
        </div>

        <p
          style={{
            fontFamily: "var(--serif-body)",
            fontSize: "1rem",
            color: "var(--newsprint-gray)",
            lineHeight: 1.6,
            opacity: 0.7,
            marginBottom: "1.5rem",
          }}
        >
          {file
            ? `${(file.size / 1024).toFixed(1)} KB · PDF Ready for Analysis`
            : "Upload judgment PDFs or legal documents\nNyayaLens will extract, verify, and process"}
        </p>

        <input
          id="filing-input"
          type="file"
          accept="application/pdf"
          className="hidden-input"
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
              background: isLoading ? "var(--newsprint-gray)" : "var(--ink-black)",
              color: "var(--paper-white)",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              padding: ".65rem 2rem",
              fontFamily: "var(--sans)",
              fontSize: ".75rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              fontWeight: 700,
              transition: "all .25s",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading && (
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  border: "2px solid rgba(255,255,255,.5)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: 8,
                  verticalAlign: "middle",
                }}
              />
            )}
            {statusLabel}
          </button>
        )}

        {!file && (
          <button
            style={{
              background: "var(--ink-black)",
              color: "var(--paper-white)",
              border: "none",
              cursor: "pointer",
              padding: ".6rem 1.8rem",
              fontFamily: "var(--sans)",
              fontSize: ".75rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              fontWeight: 700,
              transition: "opacity .25s",
            }}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("filing-input").click();
            }}
          >
            Select Document
          </button>
        )}

        <p
          style={{
            marginTop: "1.2rem",
            fontFamily: "var(--sans)",
            fontSize: ".65rem",
            letterSpacing: ".1em",
            color: "var(--newsprint-gray)",
            opacity: .45,
          }}
        >
          PDF · Max 50MB · Encrypted · Government Security
        </p>

        {status === "error" && (
          <p
            style={{
              marginTop: ".8rem",
              fontFamily: "var(--sans)",
              fontSize: ".8rem",
              color: "var(--red-bright)",
              fontWeight: 600,
            }}
          >
            ⚠ {errorMsg}
          </p>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
