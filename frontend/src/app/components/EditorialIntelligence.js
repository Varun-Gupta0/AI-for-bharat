"use client";

import { motion } from "framer-motion";

/**
 * EditorialIntelligence — replaces old AI analysis card.
 * Renders the AI output as a newspaper editorial section.
 * Keeps: analysisResult data structure, all analysis fields.
 */
export default function EditorialIntelligence({ analysisResult, role, onActionClick }) {
  if (!analysisResult) return null;

  const riskColor = {
    HIGH: "var(--court-red)",
    MEDIUM: "var(--accent-gold)",
    LOW: "var(--status-verified)",
  };

  const primaryRisk = analysisResult.actions?.[0]?.risk_level || "LOW";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      {/* EDITORIAL HEADER */}
      <div
        style={{
          borderTop: "3px solid var(--text-main)",
          borderBottom: "1px solid var(--border-dim)",
          padding: "1rem 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: ".5rem",
        }}
      >
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: ".65rem",
            letterSpacing: ".25em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "var(--text-muted)",
          }}
        >
          Data Extraction Review
        </div>
        <div style={{ display: "flex", gap: ".8rem", alignItems: "center", flexWrap: "wrap" }}>
          {analysisResult.court && (
            <span
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".65rem",
                padding: ".2rem .6rem",
                background: "var(--highlight)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--text-main)"
              }}
            >
              {analysisResult.court}
            </span>
          )}
          {analysisResult.order_date && (
            <span
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".65rem",
                color: "var(--text-muted)",
              }}
            >
              {analysisResult.order_date}
            </span>
          )}
          <span
            style={{
              border: `1px solid ${riskColor[primaryRisk]}`,
              color: riskColor[primaryRisk],
              fontFamily: "var(--sans)",
              fontSize: ".6rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              padding: ".2rem .5rem",
            }}
          >
            {primaryRisk} RISK
          </span>
        </div>
      </div>

      {/* URGENCY ALERT */}
      {analysisResult.urgency_message && (
        <div
          style={{
            borderLeft: "4px solid var(--court-red)",
            background: "rgba(139,26,26,.05)",
            padding: "1.2rem 1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".25em",
              textTransform: "uppercase",
              color: "var(--court-red)",
              fontWeight: 800,
              marginBottom: ".4rem",
            }}
          >
            ⚠ Immediate Action Required
          </div>
          <div
            style={{
              fontFamily: "var(--serif-body)",
              fontSize: ".98rem",
              lineHeight: 1.6,
              color: "var(--text-main)",
            }}
          >
            {analysisResult.urgency_message}
          </div>
        </div>
      )}

      {/* FRONT PAGE STORY — Decision Summary */}
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="luxury-border paper-emboss"
        style={{
          padding: "2.5rem 2.5rem",
          background: "var(--card-bg)",
          position: "relative",
          boxShadow: "0 15px 40px rgba(0,0,0,.08)",
        }}
      >
        {/* Top rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "repeating-linear-gradient(90deg, var(--text-main) 0px, var(--text-main) 20px, transparent 20px, transparent 40px)",
          }}
        />

        <h2
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-.02em",
            color: "var(--ink-black)",
            marginBottom: "1rem",
            marginTop: ".5rem",
          }}
        >
          {analysisResult.decision_summary || analysisResult.case_summary || "Case Analysis Complete"}
        </h2>

        {analysisResult.recommended_action && (
          <p
            style={{
              fontFamily: "var(--serif-body)",
              fontSize: "1.2rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "1.8rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid rgba(0,0,0,.08)",
              opacity: 0.9,
            }}
          >
            {analysisResult.recommended_action}
          </p>
        )}

        {/* Data Cells */}
        {analysisResult.actions && analysisResult.actions.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 1,
              background: "var(--border-dim)",
              marginBottom: "1.5rem",
              border: "1px solid var(--border-dim)",
            }}
          >
            {analysisResult.actions.slice(0, 4).map((action, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card-bg)",
                  padding: "1.2rem",
                  borderRight: "1px solid var(--border-dim)",
                  borderBottom: "1px solid var(--border-dim)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".65rem",
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    opacity: 0.7,
                    marginBottom: ".4rem",
                    fontWeight: 700,
                  }}
                >
                  {action.department || "Action"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--serif-display)",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color:
                      action.risk_level === "HIGH"
                        ? "var(--court-red)"
                        : action.risk_level === "MEDIUM"
                        ? "var(--accent-gold)"
                        : "var(--text-main)",
                    lineHeight: 1.2,
                  }}
                >
                  {action.deadline || "No Deadline"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".65rem",
                    color: "var(--text-muted)",
                    opacity: 0.6,
                    marginTop: ".3rem",
                  }}
                >
                  {action.days_remaining !== null && action.days_remaining !== undefined
                    ? `${action.days_remaining} days left`
                    : action.risk_level || ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.article>

      {/* EDITORIAL INTELLIGENCE BOX */}
      <div
        style={{
          border: "2px dashed var(--gold-primary)",
          padding: "1.5rem",
          background: "rgba(201,168,76,.08)",
          position: "relative",
          fontStyle: "italic",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "1rem",
            fontFamily: "var(--sans)",
            fontSize: ".6rem",
            letterSpacing: ".25em",
            background: "var(--paper-white)",
            color: "var(--gold-primary)",
            padding: ".2rem .5rem",
            fontWeight: 800,
            textTransform: "uppercase",
            fontStyle: "normal",
          }}
        >
          Editorial Intelligence
        </div>
        <p
          style={{
            fontFamily: "var(--serif-body)",
            fontSize: "1rem",
            color: "var(--newsprint-gray)",
            lineHeight: 1.7,
            marginTop: ".5rem",
          }}
        >
          NyayaLens AI has processed this document through a{" "}
          <strong style={{ fontWeight: 600, color: "var(--ink-black)", fontStyle: "normal" }}>
            3-layer intelligence pipeline
          </strong>{" "}
          (Pattern Recognition → Local Model → Cloud AI).{" "}
          {analysisResult.actions?.length || 0} actionable directives extracted.{" "}
          {role === "judge" && (
            <strong style={{ fontStyle: "normal" }}>
              Officer verification required to certify this analysis.
            </strong>
          )}
        </p>
        {analysisResult.citizen_explanation && (
          <div
            style={{
              background: "rgba(0,0,0,.04)",
              borderLeft: "3px solid var(--gold-primary)",
              padding: ".8rem",
              marginTop: "1rem",
              fontFamily: "var(--sans)",
              fontSize: ".85rem",
              fontStyle: "normal",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ display: "block", marginBottom: ".3rem" }}>
              Plain Language Summary:
            </strong>
            {analysisResult.citizen_explanation}
          </div>
        )}
      </div>

      {/* ACTIONS TABLE */}
      {analysisResult.actions && analysisResult.actions.length > 0 && (
        <div
          style={{
            border: "1px solid var(--newsprint-gray)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "var(--newsprint-gray)",
              padding: ".8rem 1.2rem",
              display: "grid",
              gridTemplateColumns: "1fr 180px 160px",
              gap: "1rem",
            }}
          >
            {["Required Directive", "Department", "Deadline / Risk"].map((h) => (
              <div
                key={h}
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".62rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "var(--paper-white)",
                  fontWeight: 700,
                }}
              >
                {h}
              </div>
            ))}
          </div>
          {analysisResult.actions.map((action, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px 160px",
                gap: "1rem",
                padding: ".9rem 1.2rem",
                borderBottom: idx < analysisResult.actions.length - 1 ? "1px solid rgba(0,0,0,.08)" : "none",
                background: idx % 2 === 0 ? "var(--paper-white)" : "var(--paper-cream)",
                alignItems: "start",
              }}
            >
              <div>
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
                <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: ".68rem",
                      color: "var(--newsprint-gray)",
                      opacity: 0.55,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                    }}
                  >
                    {action.action_type}
                  </p>
                  
                  {action.source_available && (
                    <button
                      onClick={() => onActionClick?.(action)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: ".3rem",
                        padding: 0,
                        color: "var(--gold-primary)",
                        fontFamily: "var(--sans)",
                        fontSize: ".65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>find_in_page</span>
                      View Evidence
                    </button>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".8rem",
                  color: "var(--newsprint-gray)",
                  paddingTop: ".2rem",
                }}
              >
                {action.department}
              </div>
              <div>
                {action.deadline ? (
                  <>
                    <div
                      style={{
                        fontFamily: "var(--serif-display)",
                        fontSize: ".95rem",
                        fontWeight: 700,
                        color: "var(--ink-black)",
                      }}
                    >
                      {action.deadline}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: ".6rem",
                        fontWeight: 700,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        padding: ".15rem .4rem",
                        border: `1px solid ${riskColor[action.risk_level] || riskColor.LOW}`,
                        color: riskColor[action.risk_level] || riskColor.LOW,
                        display: "inline-block",
                        marginTop: ".3rem",
                      }}
                    >
                      {action.days_remaining != null
                        ? `${action.days_remaining} days left`
                        : action.risk_level || "LOW"}
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: ".8rem",
                      color: "var(--newsprint-gray)",
                      opacity: 0.5,
                    }}
                  >
                    No Deadline
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
