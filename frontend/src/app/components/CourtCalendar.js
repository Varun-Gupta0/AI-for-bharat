"use client";

import { motion } from "framer-motion";

/**
 * CourtCalendar — new feature from the UI design.
 * Sits in the sidebar showing upcoming case dates.
 */
export default function CourtCalendar({ cases }) {
  // Build calendar entries from real case data
  const entries = cases
    .filter((c) => c.verified_actions?.[0]?.deadline)
    .slice(0, 4)
    .map((c) => {
      const action = c.verified_actions[0];
      const dateStr = action.deadline;
      let day = "—", month = "—";
      try {
        const d = new Date(dateStr);
        if (!isNaN(d)) {
          day = d.getDate().toString();
          month = d.toLocaleString("en-IN", { month: "short" }).toUpperCase();
        } else {
          // Try parsing "DD Mon YYYY" or "Month DD, YYYY"
          const parts = dateStr.split(" ");
          if (parts.length >= 2) {
            day = parts[0];
            month = parts[1].toUpperCase().slice(0, 3);
          }
        }
      } catch (_) {}
      return {
        day,
        month,
        title: c.summary?.slice(0, 50) || "Case Hearing",
        sub: action.department || "General",
        trackingId: c.tracking_id,
      };
    });

  // Static entries if no real data
  const staticEntries = [
    { day: "14", month: "MAY", title: "PIL 2847 — Compliance Hearing", sub: "Division Bench · Room 4 · 10:30 AM" },
    { day: "16", month: "MAY", title: "Suo Motu Case 441/2024", sub: "Division Bench · Consolidated Report Due" },
    { day: "22", month: "MAY", title: "WP-3421 Final Verification", sub: "Road Infrastructure Complete Review" },
  ];

  const displayEntries = entries.length > 0 ? entries : staticEntries;

  return (
    <div
      style={{
        border: "1px solid var(--newsprint-gray)",
        padding: "1.2rem",
        background: "var(--paper-white)",
      }}
    >
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
        📅 Court Calendar
      </div>

      {displayEntries.map((entry, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          style={{
            padding: ".8rem 0",
            borderBottom: i < displayEntries.length - 1 ? "1px dotted rgba(0,0,0,.1)" : "none",
            display: "grid",
            gridTemplateColumns: "50px 1fr",
            gap: "1rem",
            alignItems: "start",
          }}
        >
          {/* Date */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--serif-display)",
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "var(--gold-primary)",
                lineHeight: 1,
              }}
            >
              {entry.day}
            </div>
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".58rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--newsprint-gray)",
                opacity: 0.55,
                fontWeight: 600,
              }}
            >
              {entry.month}
            </div>
          </div>

          {/* Info */}
          <div>
            <div
              style={{
                fontFamily: "var(--serif-body)",
                fontSize: ".85rem",
                color: "var(--ink-black)",
                lineHeight: 1.4,
                fontWeight: 600,
              }}
            >
              {entry.title}
            </div>
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".68rem",
                color: "var(--newsprint-gray)",
                opacity: 0.5,
                marginTop: ".2rem",
              }}
            >
              {entry.sub || entry.trackingId}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
