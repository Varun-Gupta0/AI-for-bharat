"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import VoiceExplainer from "./VoiceExplainer";
import { useLanguage } from "../context/LanguageContext";
import JudicialStatusStamp from "./JudicialStatusStamp";

/**
 * CaseDetail — replaces old case detail panels.
 * Maps to "Front Page Story" editorial section.
 * Keeps: selectedCase data, verified_actions, summary, citizen_explanation.
 */
export default function CaseDetail({ selectedCase, role, onBack, onGenerateReport, onActionClick }) {
  const { lang, t } = useLanguage();
  const [translatedExplanation, setTranslatedExplanation] = useState(selectedCase?.citizen_explanation || "");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!selectedCase?.citizen_explanation) return;
    
    // If language is English, just use the original
    if (lang === "en") {
      setTranslatedExplanation(selectedCase.citizen_explanation);
      return;
    }

    const fetchTranslation = async () => {
      setIsTranslating(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: selectedCase.citizen_explanation,
            target_language: lang
          })
        });
        const data = await response.json();
        if (data.translated_text) {
          setTranslatedExplanation(data.translated_text);
        }
      } catch (err) {
        console.error("Translation error:", err);
        setTranslatedExplanation(selectedCase.citizen_explanation);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchTranslation();
  }, [lang, selectedCase]);

  if (!selectedCase) return null;

  const primaryAction = selectedCase.verified_actions?.[0] || {};
  const risk = primaryAction.risk_level || "LOW";
  const isOfficer = role === "officer";

  const riskColor = {
    HIGH: "var(--court-red)",
    MEDIUM: "var(--accent-gold)",
    LOW: "var(--status-verified)",
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
            border: "1px solid var(--border-dim)",
            cursor: "pointer",
            padding: ".4rem 1rem",
            fontFamily: "var(--sans)",
            fontSize: ".7rem",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            fontWeight: 800,
            color: "var(--text-main)",
          }}
        >
          ← Return to Records
        </button>
        {selectedCase.tracking_id && (
          <span
            style={{
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              opacity: 0.8,
            }}
          >
            REF: {selectedCase.tracking_id}
          </span>
        )}
      </div>

      {/* FRONT PAGE STORY */}
      <article
        style={{
          border: `2px solid var(--text-main)`,
          padding: "2.5rem",
          background: "var(--card-bg)",
          position: "relative",
          boxShadow: isOfficer ? "0 20px 40px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.05)",
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
              `repeating-linear-gradient(90deg, var(--text-main) 0px, var(--text-main) 15px, transparent 15px, transparent 30px)`,
          }}
        />

        {/* Meta tags */}
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: ".62rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
            display: "flex",
            gap: "1.2rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {primaryAction.department && (
            <span style={{ padding: ".2rem .6rem", background: "var(--highlight)", fontWeight: 700, color: "var(--text-main)" }}>
              {primaryAction.department}
            </span>
          )}
          <span
            style={{
              border: `1.5px solid ${riskColor}`,
              color: riskColor,
              padding: ".2rem .5rem",
              fontWeight: 800,
              fontSize: ".6rem",
            }}
          >
            {risk} RISK LEVEL
          </span>
          <span style={{ opacity: 0.8 }}>
             DATED: {selectedCase.timestamp ? new Date(selectedCase.timestamp).toLocaleDateString() : "PENDING"}
          </span>
          {selectedCase.status === "verified" && (
            <motion.div
              initial={{ scale: 1.5, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: -15 }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                border: "4px solid var(--status-verified)",
                color: "var(--status-verified)",
                padding: "0.5rem 1.5rem",
                fontFamily: "var(--serif-display)",
                fontSize: "1.5rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.8)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                zIndex: 10,
                pointerEvents: "none",
                opacity: 0.8
              }}
            >
              Certified Extract
            </motion.div>
          )}
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-.04em",
            color: "var(--text-main)",
            marginBottom: "1rem",
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
              color: "var(--text-muted)",
              lineHeight: 1.5,
              marginBottom: "2rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid var(--border-dim)",
            }}
          >
            Directive: {primaryAction.action}
          </p>
        )}

        {/* Data grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 1,
            background: "var(--border-dim)",
            border: "1px solid var(--border-dim)",
            marginBottom: "2.5rem",
          }}
        >
          {[
            { label: "Tracking ID", value: selectedCase.tracking_id || "—", color: null },
            { label: "Deadline", value: primaryAction.deadline || "TBD", color: riskColor },
            {
              label: "Action Window",
              value: primaryAction.days_remaining != null ? `${primaryAction.days_remaining} Days` : "—",
              color: primaryAction.days_remaining <= 3 ? "var(--court-red)" : null,
            },
            { label: "Proceeding Status", component: <JudicialStatusStamp status={selectedCase.status} /> },
          ].map((cell, i) => (
            <div
              key={i}
              style={{
                background: "var(--card-bg)",
                padding: "1.2rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".62rem",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: ".4rem",
                  fontWeight: 800,
                }}
              >
                {cell.label}
              </div>
              {cell.component ? (
                <div style={{ marginTop: "0.2rem" }}>{cell.component}</div>
              ) : (
                <div
                  style={{
                    fontFamily: "var(--serif-display)",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: cell.color || "var(--text-main)",
                    lineHeight: 1,
                  }}
                >
                  {cell.value}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Body columns */}
        {isOfficer && selectedCase.verified_actions?.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              marginBottom: "2.5rem",
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
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--border-dim)",
                  paddingBottom: ".5rem",
                }}
              >
                Archived Directives
              </div>
              {selectedCase.verified_actions.map((action, i) => (
                <div
                  key={i}
                  style={{
                    paddingBottom: "1.2rem",
                    marginBottom: "1.2rem",
                    borderBottom: i < selectedCase.verified_actions.length - 1 ? "1px dashed var(--border-dim)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem" }}>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--serif-body)",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "var(--text-main)",
                          marginBottom: ".3rem",
                        }}
                      >
                        {action.action}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: ".7rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {action.department} · {action.deadline || "Permanent Record"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderLeft: "1px solid var(--border-dim)", paddingLeft: "3rem" }}>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".65rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--border-dim)",
                  paddingBottom: ".5rem",
                }}
              >
                Judicial Summary
              </div>
              <p
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: "1rem",
                  color: "var(--text-main)",
                  lineHeight: 1.8,
                  opacity: 0.9,
                }}
              >
                {selectedCase.summary}
              </p>
            </div>
          </div>
        )}

        {/* CITIZEN VIEW — Public Understanding */}
        {!isOfficer && (
          <div
            style={{
              background: "var(--highlight)",
              borderLeft: "4px solid var(--status-verified)",
              padding: "2rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".7rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--status-verified)",
                fontWeight: 900,
                marginBottom: "1rem",
              }}
            >
              {t("publicAwarenessNotice")}
            </div>
            <h3
              style={{
                fontFamily: "var(--serif-display)",
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "1rem",
              }}
            >
              {t("understandingProceeding")}
            </h3>
            <div
              style={{
                fontFamily: "var(--serif-body)",
                fontSize: "1.1rem",
                color: "var(--text-main)",
                lineHeight: 1.8,
                opacity: 0.9
              }}
            >
              {translatedExplanation ? (
                <p>{translatedExplanation}</p>
              ) : (
                <p>
                  {isTranslating ? "Translating..." : "This record documents a judicial proceeding involving departmental compliance. The court has established binding directives that are currently being monitored for transparency and public accountability."}
                </p>
              )}
            </div>
            
            {translatedExplanation && <VoiceExplainer text={translatedExplanation} />}
          </div>
        )}

        {/* Generate Report */}
        <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--border-dim)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <p style={{ fontFamily: "var(--sans)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
             Archived on {selectedCase.timestamp ? new Date(selectedCase.timestamp).toLocaleString() : "Date Unknown"}
           </p>
           <button
             onClick={() => {
               // Cinematic Export Logic
               const printWindow = window.open('', '_blank');
               // We fetch the generateReport function dynamically or import it at the top
               // But since we are here, we can just trigger a nice print preview.
               // We will import it at the top of CaseDetail.
               import('../../lib/reportGenerator').then(({ generateReport }) => {
                 const report = generateReport(selectedCase, role);
                 printWindow.document.write(`
                   <html>
                     <head>
                       <title>Official Record - ${selectedCase.tracking_id}</title>
                       <style>
                         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
                         body { margin: 0; padding: 20px; background: #e5e7eb; display: flex; justify-content: center; }
                         @media print {
                           body { background: white; padding: 0; }
                           .no-print { display: none; }
                         }
                       </style>
                     </head>
                     <body>
                       <div class="no-print" style="position: fixed; top: 20px; right: 20px;">
                         <button onclick="window.print()" style="background: #1a1a1a; color: white; border: none; padding: 10px 20px; font-family: Inter, sans-serif; cursor: pointer; border-radius: 4px;">PRINT OFFICIAL RECORD</button>
                       </div>
                       ${report.html}
                     </body>
                   </html>
                 `);
                 printWindow.document.close();
               });
             }}
             style={{
               background: "var(--text-main)",
               color: "var(--card-bg)",
               border: "none",
               cursor: "pointer",
               padding: "0.8rem 2rem",
               fontFamily: "var(--sans)",
               fontSize: "0.7rem",
               letterSpacing: ".15em",
               textTransform: "uppercase",
               fontWeight: 900,
               transition: "all .25s",
               boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
             }}
             onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
             onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
           >
             Generate Official Report
           </button>
        </div>
      </article>
    </motion.div>
  );
}
