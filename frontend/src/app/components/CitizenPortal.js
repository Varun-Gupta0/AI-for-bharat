"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CaseArchive from "./CaseArchive";
import VoiceExplainer from "./VoiceExplainer";
import { useLanguage } from "../context/LanguageContext";

/**
 * CitizenPortal — Compassionate, explanatory legal interface for the public.
 */
export default function CitizenPortal({ 
  selectedCase, 
  cases, 
  onSelectCase, 
  onBack 
}) {
  const { lang, t } = useLanguage();
  const [translatedExplanation, setTranslatedExplanation] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!selectedCase?.citizen_explanation) return;
    
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

  return (
    <div className="citizen-portal-root" style={{ background: "transparent", minHeight: "100vh" }}>
      <div className="citizen-layout" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {selectedCase ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
          >
            {/* 1. What This Means For You */}
            <section style={{ 
              background: "var(--card-bg)", 
              border: "1px solid var(--accent-amber)", 
              padding: "2.5rem",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(180, 83, 9, 0.05)",
              position: "relative"
            }}>
              <div style={{ position: "absolute", top: "1rem", right: "2rem", fontFamily: "var(--sans)", fontSize: "0.6rem", fontWeight: 900, color: "var(--accent-amber)", opacity: 0.5, letterSpacing: "0.2em" }}>
                EXPLANATORY SUMMARY
              </div>
              
              <h2 style={{ fontFamily: "var(--serif-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--ink-black)", marginBottom: "1.5rem" }}>
                {t("whatThisMeansForYou")}
              </h2>
              
              <p style={{ 
                fontFamily: "var(--serif-body)", 
                fontSize: "1.2rem", 
                lineHeight: 1.6, 
                color: "var(--ink-black)",
                marginBottom: "2rem" 
              }}>
                {translatedExplanation || (isTranslating ? "Translating..." : "The court has issued an order requiring a review of your case. This is a standard procedure to ensure all facts are verified correctly.")}
              </p>

              {translatedExplanation && <VoiceExplainer text={translatedExplanation} />}
            </section>

            {/* 2. Simplified Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
               <section style={{ background: "var(--card-bg)", padding: "2rem", border: "1px solid var(--border-dim)", borderRadius: "16px" }}>
                  <h3 style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>
                    Status Timeline
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {[
                      { label: "Order Issued", status: "completed", date: selectedCase.order_date },
                      { 
                        label: selectedCase.status === 'verified' ? "Review Completed" : "Under Judicial Review", 
                        status: selectedCase.status === 'verified' ? "completed" : "pending", 
                        date: selectedCase.status === 'verified' ? "Verified by Officer" : "Your case is currently being reviewed" 
                      },
                      { label: "Next Action Step", status: "future", date: "Will be updated after review" },
                    ].map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <div style={{ 
                          width: "20px", 
                          height: "20px", 
                          borderRadius: "50%", 
                          background: step.status === 'completed' ? "var(--status-verified)" : step.status === 'pending' ? "var(--accent-gold)" : "var(--border-dim)",
                          marginTop: "0.2rem",
                          border: "4px solid white",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }} />
                        <div>
                          <div style={{ fontFamily: "var(--sans)", fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>{step.label}</div>
                          <div style={{ fontFamily: "var(--sans)", fontSize: "0.75rem", color: "var(--text-muted)" }}>{step.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
               </section>

               <section style={{ background: "var(--card-bg)", padding: "2rem", border: "1px solid var(--border-dim)", borderRadius: "16px" }}>
                  <h3 style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>
                    Public Resources
                  </h3>
                  <p style={{ fontFamily: "var(--serif-body)", fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "1rem" }}>
                    You have the right to transparent updates on every action verified by the court officers.
                  </p>
                  <button 
                    onClick={onBack}
                    style={{ 
                      background: "none", 
                      border: "1px solid var(--accent-blue)", 
                      color: "var(--accent-blue)",
                      padding: "0.8rem 1.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontFamily: "var(--sans)",
                      fontSize: "0.8rem",
                      fontWeight: 700
                    }}
                  >
                    Return to Case Directory
                  </button>
               </section>
            </div>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            <CaseArchive cases={cases} onSelectCase={onSelectCase} role="citizen" />
            
            <section style={{ textAlign: "center", padding: "4rem", background: "var(--highlight)", borderRadius: "24px" }}>
              <h2 style={{ fontFamily: "var(--serif-display)", fontSize: "1.5rem", color: "var(--accent-blue)", marginBottom: "1rem" }}>
                Rights & Transparency Note
              </h2>
              <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--text-muted)", lineHeight: 1.6 }}>
                NyayaLens works with court officers to simplify complex legal language. If you have questions about your case, you can track specific progress markers archived in our system.
              </p>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}
