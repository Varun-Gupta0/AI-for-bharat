"use client";

import { motion } from "framer-motion";

/**
 * CaseDetail — replaces old case detail panels.
 * Maps to "Front Page Story" editorial section.
 * Keeps: selectedCase data, verified_actions, summary, citizen_explanation.
 */
export default function CaseDetail({ selectedCase, role, onBack, onGenerateReport }) {
  if (!selectedCase) return null;

  const primaryAction = selectedCase.verified_actions?.[0] || {};
  const risk = primaryAction.risk_level || "LOW";
  const riskColor = {
    HIGH: "var(--red-bright)",
    MEDIUM: "var(--amber-warn)",
    LOW: "var(--green-verified)",
  }[risk];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      {/* Back nav */}
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
          ← Back to Archive
        </button>
        {selectedCase.tracking_id && (
          <span
            style={{
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--newsprint-gray)",
              opacity: 0.55,
            }}
          >
            {selectedCase.tracking_id}
          </span>
        )}
      </div>

      {/* FRONT PAGE STORY */}
      <article
        style={{
          border: "2px solid var(--newsprint-gray)",
          padding: "2rem 2.2rem",
          background: "var(--paper-white)",
          position: "relative",
          boxShadow: "0 8px 24px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "repeating-linear-gradient(90deg, var(--newsprint-gray) 0px, var(--newsprint-gray) 15px, transparent 15px, transparent 30px)",
          }}
        />

        {/* Meta tags */}
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: ".62rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--newsprint-gray)",
            marginBottom: "1rem",
            marginTop: ".5rem",
            display: "flex",
            gap: ".8rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {primaryAction.department && (
            <span style={{ padding: ".2rem .6rem", background: "rgba(0,0,0,.07)", fontWeight: 600 }}>
              {primaryAction.department}
            </span>
          )}
          <span
            style={{
              border: `1px solid ${riskColor}`,
              color: riskColor,
              padding: ".2rem .5rem",
              fontWeight: 700,
              fontSize: ".6rem",
            }}
          >
            {risk} RISK
          </span>
          <span style={{ opacity: 0.45 }}>
            {primaryAction.deadline || "Deadline TBD"}
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-.03em",
            color: "var(--ink-black)",
            marginBottom: ".8rem",
          }}
        >
          {selectedCase.summary}
        </h1>

        {/* Sub-hed: recommended action */}
        {primaryAction.action && (
          <p
            style={{
              fontFamily: "var(--serif-body)",
              fontSize: "1.2rem",
              fontStyle: "italic",
              color: "var(--newsprint-gray)",
              lineHeight: 1.5,
              marginBottom: "1.5rem",
              paddingBottom: "1.2rem",
              borderBottom: "1px solid rgba(0,0,0,.1)",
              opacity: 0.85,
            }}
          >
            {primaryAction.action}
          </p>
        )}

        {/* Data grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 1,
            background: "var(--newsprint-gray)",
            border: "1px solid var(--newsprint-gray)",
            marginBottom: "1.8rem",
          }}
        >
          {[
            { label: "Tracking ID", value: selectedCase.tracking_id || "—", color: null },
            { label: "Deadline", value: primaryAction.deadline || "TBD", color: riskColor },
            {
              label: "Days Remaining",
              value: primaryAction.days_remaining != null ? `${primaryAction.days_remaining}` : "—",
              color: primaryAction.days_remaining <= 3 ? "var(--red-bright)" : null,
            },
            { label: "Risk Level", value: risk, color: riskColor },
          ].map((cell, i) => (
            <div
              key={i}
              style={{
                background: "var(--paper-white)",
                padding: "1rem",
                borderRight: "1px solid var(--newsprint-gray)",
                borderBottom: "1px solid var(--newsprint-gray)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".62rem",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "var(--newsprint-gray)",
                  opacity: 0.55,
                  marginBottom: ".3rem",
                  fontWeight: 600,
                }}
              >
                {cell.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--serif-display)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: cell.color || "var(--ink-black)",
                  lineHeight: 1,
                }}
              >
                {cell.value}
              </div>
            </div>
          ))}
        </div>

        {/* Body columns */}
        {role !== "citizen" && selectedCase.verified_actions?.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "1.8rem",
            }}
            className="story-grid"
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".65rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "var(--newsprint-gray)",
                  borderBottom: "1px solid rgba(0,0,0,.1)",
                  paddingBottom: ".5rem",
                }}
              >
                Required Directives
              </div>
              {selectedCase.verified_actions.map((action, i) => (
                <div
                  key={i}
                  style={{
                    paddingBottom: ".8rem",
                    marginBottom: ".8rem",
                    borderBottom: i < selectedCase.verified_actions.length - 1 ? "1px dashed rgba(0,0,0,.1)" : "none",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--serif-body)",
                      fontSize: ".95rem",
                      fontWeight: 600,
                      color: "var(--ink-black)",
                      marginBottom: ".2rem",
                    }}
                  >
                    {action.action}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: ".7rem",
                      color: "var(--newsprint-gray)",
                      opacity: 0.55,
                    }}
                  >
                    {action.department} · {action.deadline || "No deadline"}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".65rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "var(--newsprint-gray)",
                  borderBottom: "1px solid rgba(0,0,0,.1)",
                  paddingBottom: ".5rem",
                }}
              >
                Compliance Status
              </div>
              <div
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: "3rem",
                  fontWeight: 900,
                  color: "var(--green-verified)",
                  lineHeight: 1,
                  marginBottom: ".5rem",
                }}
              >
                100%
              </div>
              <p
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: ".95rem",
                  color: "var(--newsprint-gray)",
                  lineHeight: 1.6,
                  opacity: 0.75,
                }}
              >
                All extracted directives have been human-verified and assigned to departments.
              </p>
            </div>
          </div>
        )}

        {/* CITIZEN VIEW — Public Understanding */}
        {role === "citizen" && (
          <div
            style={{
              background: "rgba(45,106,79,.06)",
              borderLeft: "4px solid var(--green-verified)",
              padding: "1.8rem",
              marginTop: ".5rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".65rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--green-verified)",
                fontWeight: 700,
                marginBottom: ".8rem",
              }}
            >
              📰 What This Means for You — Public Understanding
            </div>
            <h3
              style={{
                fontFamily: "var(--serif-display)",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--ink-black)",
                marginBottom: "1rem",
              }}
            >
              Understanding the Court's Decision
            </h3>
            <div
              style={{
                fontFamily: "var(--serif-body)",
                fontSize: "1rem",
                color: "var(--newsprint-gray)",
                lineHeight: 1.8,
              }}
            >
              {selectedCase.citizen_explanation ? (
                <p>{selectedCase.citizen_explanation}</p>
              ) : (
                <>
                  <p style={{ marginBottom: ".7rem" }}>
                    The court has issued a legal directive requiring government departments to take
                    specific actions. This is a binding order—not a request.
                  </p>
                  <p>
                    You are not required to take any action yourself. The court is monitoring this
                    matter and has assigned compliance responsibilities to the relevant departments.
                  </p>
                </>
              )}
            </div>

            {/* Deadline cards */}
            {selectedCase.verified_actions?.length > 0 && (
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
                {selectedCase.verified_actions.map((action, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: ".8rem 1rem",
                      background: "rgba(45,106,79,.08)",
                      borderLeft: "3px solid var(--green-verified)",
                      flexWrap: "wrap",
                      gap: ".5rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--serif-body)",
                        fontSize: ".9rem",
                        fontWeight: 600,
                        color: "var(--ink-black)",
                      }}
                    >
                      {action.action}
                    </p>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: ".8rem",
                          fontWeight: 700,
                          color: "var(--newsprint-gray)",
                        }}
                      >
                        {action.deadline || "No Deadline"}
                      </p>
                      {action.days_remaining != null && (
                        <p
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: ".65rem",
                            color: "var(--newsprint-gray)",
                            opacity: 0.5,
                            textTransform: "uppercase",
                          }}
                        >
                          {action.days_remaining} days left
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generate Report */}
        <div style={{ marginTop: "1.5rem" }}>
          <button
            onClick={onGenerateReport}
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
              transition: "opacity .25s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = ".8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            📄 Generate Official Report
          </button>
        </div>
      </article>
    </motion.div>
  );
}
