"use client";

import { motion, AnimatePresence } from "framer-motion";
import EditionSelector from "./EditionSelector";
import { useLanguage } from "../context/LanguageContext";

/**
 * Newspaper Masthead — replaces the old SaaS Header.
 * Retains: role badge, date, case indicator, notification toggle, switch role.
 */
export default function Masthead({
  role,
  activeCasesCount,
  criticalCount,
  onToggleNotices,
  onSwitchRole,
  noticesOpen,
}) {
  const { t } = useLanguage();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isOfficer = role === "officer";

  return (
    <header
      style={{
        background: "transparent",
        borderBottom: "4px double var(--newsprint-gray)",
        position: "sticky",
        top: 0,
        zIndex: 101,
        padding: "1.2rem 2.5rem",
      }}
    >
      <div
        className="masthead-inner"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        {/* Title & Masthead Text */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--serif-display)",
              fontSize: "2.2rem",
              fontWeight: 900,
              letterSpacing: "-.03em",
              textTransform: "uppercase",
              lineHeight: 1,
              color: "var(--ink-black)",
              margin: 0
            }}
          >
            Nyaya<span style={{ fontStyle: "italic", color: "var(--red-bright)" }}>Lens</span>
          </h1>
          
          <div style={{ 
            display: "flex", 
            gap: "1.5rem", 
            alignItems: "center",
            fontFamily: "var(--sans)",
            fontSize: ".65rem",
            letterSpacing: ".35em",
            textTransform: "uppercase",
            color: "var(--newsprint-gray)",
            fontWeight: 500
          }}>
            <div style={{ opacity: 0.7 }}>{today}</div>
            <div style={{ width: "1px", height: "12px", background: "var(--newsprint-gray)", opacity: .3 }} />
            <div style={{ fontWeight: 800 }}>
              {isOfficer ? "JUDICIAL COMMAND" : "CITIZEN ACCESS"}
            </div>
            {!isOfficer && (
              <>
                <div style={{ width: "1px", height: "12px", background: "var(--newsprint-gray)", opacity: .3 }} />
                <EditionSelector />
              </>
            )}
          </div>
        </div>

        {/* Intelligence Meta */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
           {activeCasesCount > 0 && (
             <div style={{ display: "flex", gap: "1.5rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: 900, color: "var(--text-main)" }}>{activeCasesCount}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.5rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t("activeCases")}</div>
                </div>
                {criticalCount > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: 900, color: "var(--court-red)" }}>{criticalCount}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: "0.5rem", color: "var(--court-red)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t("criticalAlerts")}</div>
                  </div>
                )}
             </div>
           )}

           <div style={{ display: "flex", gap: "0.8rem" }}>
              <button
                onClick={onToggleNotices}
                style={{
                  background: noticesOpen ? "var(--text-main)" : "none",
                  color: noticesOpen ? "var(--card-bg)" : "var(--text-main)",
                  border: "1px solid var(--border-dim)",
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--sans)",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>notifications</span>
                Notices
              </button>
              
              <button
                onClick={onSwitchRole}
                style={{
                  background: "var(--highlight)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-dim)",
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--sans)",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  cursor: "pointer"
                }}
              >
                {t("exitDesk")}
              </button>
           </div>
        </div>
      </div>
    </header>
  );
}
