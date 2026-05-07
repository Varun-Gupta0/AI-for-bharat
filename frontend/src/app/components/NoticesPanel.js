"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * NoticesPanel — replaces old notification dropdown.
 * Pinned Legal Notice Board in newspaper sidebar.
 * Keeps: notification logic (case alerts from high-risk cases).
 */
export default function NoticesPanel({ cases, isOpen }) {
  const highRisk = cases.filter((c) =>
    c.verified_actions?.some((a) => a.risk_level === "HIGH")
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            border: "1px solid var(--newsprint-gray)",
            padding: "1.2rem",
            background: "var(--paper-white)",
          }}
        >
          {/* Header */}
          <div
            style={{
              fontFamily: "var(--serif-display)",
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "-.02em",
              marginBottom: ".8rem",
              paddingBottom: ".6rem",
              borderBottom: "2px solid var(--newsprint-gray)",
              color: "var(--ink-black)",
            }}
          >
            ⊙ Pinned Legal Notices
          </div>

          {/* Notices from real cases */}
          {highRisk.length === 0 && (
            <div
              style={{
                fontFamily: "var(--serif-body)",
                fontSize: ".9rem",
                color: "var(--newsprint-gray)",
                opacity: 0.55,
                fontStyle: "italic",
                padding: "1rem 0",
                textAlign: "center",
              }}
            >
              No critical notices at this time.
            </div>
          )}

          {highRisk.map((c, i) => {
            const action = c.verified_actions?.[0] || {};
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: ".8rem",
                  marginBottom: ".8rem",
                  padding: ".8rem",
                  background: "rgba(0,0,0,.04)",
                  borderLeft: "3px solid var(--red-bright)",
                  cursor: "pointer",
                  transition: "background .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,.04)")}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--red-bright)",
                    marginTop: ".35rem",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--serif-body)",
                      fontSize: ".85rem",
                      color: "var(--newsprint-gray)",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: "var(--ink-black)", fontWeight: 600 }}>
                      {c.tracking_id || "URGENT"}:
                    </strong>{" "}
                    {c.summary?.slice(0, 90) || "Case requires immediate action."}
                    {c.summary?.length > 90 ? "..." : ""}
                  </div>
                  {action.days_remaining != null && (
                    <div
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: ".65rem",
                        color: "var(--red-bright)",
                        opacity: 0.75,
                        marginTop: ".3rem",
                        fontWeight: 600,
                      }}
                    >
                      {action.days_remaining} days remaining
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Static pinned notices */}
          {[
            { label: "WP-3421", text: "Urban Development Ministry response deadline approaching.", type: "warning", color: "var(--amber-warn)", time: "Upcoming" },
            { label: "Suo Motu 441", text: "Hearing scheduled 16 May. Consolidated report required.", type: "info", color: "var(--gold-primary)", time: "Scheduled" },
          ].map((n, i) => (
            <div
              key={`static-${i}`}
              style={{
                display: "flex",
                gap: ".8rem",
                marginBottom: ".8rem",
                padding: ".8rem",
                background: "rgba(0,0,0,.04)",
                borderLeft: `3px solid ${n.color}`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: n.color,
                  marginTop: ".35rem",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--serif-body)",
                    fontSize: ".85rem",
                    color: "var(--newsprint-gray)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "var(--ink-black)", fontWeight: 600 }}>
                    {n.label}:
                  </strong>{" "}
                  {n.text}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".62rem",
                    color: "var(--newsprint-gray)",
                    opacity: 0.45,
                    marginTop: ".3rem",
                  }}
                >
                  {n.time}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
