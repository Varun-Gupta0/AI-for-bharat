"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * CaseArchive — replaces old case table / grid.
 * Newspaper clipping archive layout.
 * Keeps: cases data, filters, case routing (setSelectedCase).
 */
export default function CaseArchive({ cases, onSelectCase, role }) {
  if (cases.length === 0) {
    return (
      <div
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          border: "2px dashed rgba(0,0,0,.1)",
          background: "var(--paper-cream)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }}>📁</div>
        <h3
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--ink-black)",
            marginBottom: ".5rem",
          }}
        >
          No Archived Proceedings
        </h3>
        <p
          style={{
            fontFamily: "var(--serif-body)",
            fontSize: "1rem",
            color: "var(--newsprint-gray)",
            opacity: 0.65,
          }}
        >
          {role === "citizen"
            ? "Enter your tracking ID above to find your case."
            : "Upload and verify documents to build the case archive."}
        </p>
      </div>
    );
  }

  const statusMap = (c) => {
    const risk = c.verified_actions?.[0]?.risk_level;
    if (risk === "HIGH") return { label: "Critical", cls: "status-critical", color: "var(--red-bright)" };
    if (risk === "MEDIUM") return { label: "Review", cls: "status-review", color: "var(--amber-warn)" };
    return { label: "Verified", cls: "status-verified", color: "var(--green-verified)" };
  };

  return (
    <div>
      {/* Section heading */}
      <h2
        style={{
          fontFamily: "var(--serif-display)",
          fontSize: "1.6rem",
          fontWeight: 700,
          letterSpacing: "-.02em",
          color: "var(--ink-black)",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "2px solid var(--newsprint-gray)",
        }}
      >
        Archived Proceedings
      </h2>

      {/* Clippings Grid */}
      <div
        className="clippings-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {cases.map((c, i) => {
          const st = statusMap(c);
          const primaryAction = c.verified_actions?.[0] || {};
          return (
            <motion.div
              key={c.file_id || i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              onClick={() => onSelectCase(c)}
              style={{
                border: "1px solid var(--newsprint-gray)",
                padding: "1rem",
                background: "var(--paper-cream)",
                cursor: "pointer",
                position: "relative",
                boxShadow: "2px 2px 0px rgba(0,0,0,.1)",
                transition: "all .3s cubic-bezier(.25,.46,.45,.94)",
              }}
              whileHover={{ y: -4, boxShadow: "4px 8px 16px rgba(0,0,0,.12)" }}
            >
              {/* Dept tag */}
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".62rem",
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  color: "var(--newsprint-gray)",
                  opacity: 0.55,
                  marginBottom: ".4rem",
                  fontWeight: 600,
                }}
              >
                {primaryAction.department || "Legal"}
              </div>

              {/* Title */}
              <div
                style={{
                  fontFamily: "var(--serif-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "var(--ink-black)",
                  marginBottom: ".6rem",
                  letterSpacing: "-.01em",
                }}
              >
                {c.summary?.slice(0, 80) || "Legal Proceeding"}
                {c.summary?.length > 80 ? "..." : ""}
              </div>

              {/* Tracking ID */}
              {c.tracking_id && (
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".62rem",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--newsprint-gray)",
                    opacity: 0.45,
                    marginBottom: ".8rem",
                  }}
                >
                  {c.tracking_id}
                </div>
              )}

              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  paddingTop: ".8rem",
                  borderTop: "1px dotted rgba(0,0,0,.12)",
                  gap: ".5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".65rem",
                    color: "var(--newsprint-gray)",
                    opacity: 0.45,
                  }}
                >
                  {primaryAction.deadline || (c.timestamp && new Date(c.timestamp).toLocaleDateString("en-IN")) || "—"}
                </div>
                <span
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".58rem",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    padding: ".15rem .4rem",
                    border: `1px solid ${st.color}`,
                    color: st.color,
                  }}
                >
                  {st.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
