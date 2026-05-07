"use client";

import { motion, AnimatePresence } from "framer-motion";

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
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const roleBadge =
    role === "judge"
      ? { label: "Court Officer Access", cls: "bg-[var(--red-critical)] text-white" }
      : { label: "Citizen Access", cls: "bg-[var(--gold-primary)] text-[var(--ink-black)]" };

  return (
    <header
      style={{
        background: "var(--paper-white)",
        borderBottom: "2px solid var(--newsprint-gray)",
        position: "sticky",
        top: 0,
        zIndex: 101,
        boxShadow: "0 4px 12px rgba(0,0,0,.15)",
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
          padding: "1.1rem 2.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Title */}
        <div>
          <h1
            style={{
              fontFamily: "var(--serif-display)",
              fontSize: "2rem",
              fontWeight: 900,
              letterSpacing: "-.03em",
              textTransform: "uppercase",
              lineHeight: 0.95,
              color: "var(--ink-black)",
            }}
          >
            Nyaya<span style={{ fontStyle: "italic", color: "var(--red-bright)" }}>Lens</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: ".6rem",
              letterSpacing: ".25em",
              textTransform: "uppercase",
              color: "var(--newsprint-gray)",
              opacity: 0.55,
              marginTop: ".2rem",
            }}
          >
            Living Legal Newspaper — AI Legal Intelligence
          </p>
        </div>

        {/* Meta */}
        <div
          className="masthead-meta"
          style={{
            fontFamily: "var(--sans)",
            fontSize: ".65rem",
            letterSpacing: ".3em",
            textTransform: "uppercase",
            color: "var(--newsprint-gray)",
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            className={`px-2 py-1 text-[.6rem] font-bold tracking-widest uppercase ${roleBadge.cls}`}
          >
            {roleBadge.label}
          </span>
          <span style={{ opacity: .7 }}>{today}</span>
          {activeCasesCount > 0 && (
            <>
              <span style={{ width: 1, height: 12, background: "var(--newsprint-gray)", opacity: .3, display: "inline-block" }} />
              <span>
                {activeCasesCount} Active{" "}
                {criticalCount > 0 && (
                  <span style={{ color: "var(--red-bright)", fontWeight: 800 }}>
                    · {criticalCount} Critical
                  </span>
                )}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
          <button
            onClick={onToggleNotices}
            style={{
              background: noticesOpen ? "var(--newsprint-gray)" : "none",
              color: noticesOpen ? "var(--paper-white)" : "var(--newsprint-gray)",
              border: "1px solid var(--newsprint-gray)",
              cursor: "pointer",
              padding: ".35rem .8rem",
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontWeight: 600,
              transition: "all .25s",
            }}
          >
            🔔 Notices
          </button>
          <button
            onClick={onSwitchRole}
            style={{
              background: "none",
              border: "1px solid var(--newsprint-gray)",
              cursor: "pointer",
              padding: ".35rem .8rem",
              fontFamily: "var(--sans)",
              fontSize: ".7rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--newsprint-gray)",
              fontWeight: 600,
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
            Switch Role
          </button>
        </div>
      </div>
    </header>
  );
}
