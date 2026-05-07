"use client";

import { useEffect, useState } from "react";

const DEFAULT_ALERTS = [
  "Contempt proceedings initiated against 3 municipal bodies for non-compliance with court directives.",
  "Supreme Court issues notice to 12 states on environmental compliance — deadline 14 May 2025.",
  "High Court approves Urban Development Ministry compliance report — Case WP-3421.",
  "RTI response deadline expires in 2 days for Case No. PIL-2024-0931.",
  "8 departments yet to file affidavits in matter of road infrastructure — deadline 10 May.",
];

/**
 * Breaking Legal Strip — scrolling ticker replacing old risk alerts.
 * Populated from real case data + static breaking news.
 */
export default function BreakingStrip({ cases = [] }) {
  const [items, setItems] = useState(DEFAULT_ALERTS);

  useEffect(() => {
    const caseAlerts = cases
      .filter((c) => c.verified_actions?.some((a) => a.risk_level === "HIGH"))
      .map((c) => `⚠ HIGH RISK — ${c.summary || "Case requires immediate action."}`);
    if (caseAlerts.length > 0) {
      setItems([...caseAlerts, ...DEFAULT_ALERTS]);
    }
  }, [cases]);

  const text = items.join("  •  ");

  return (
    <div
      style={{
        background: "var(--red-bright)",
        color: "white",
        padding: ".55rem 1rem",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        position: "relative",
      }}
    >
      {/* Label */}
      <span
        className="news-pulse"
        style={{
          fontFamily: "var(--sans)",
          fontSize: ".62rem",
          letterSpacing: ".2em",
          textTransform: "uppercase",
          fontWeight: 800,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: ".3rem",
        }}
      >
        ⚠ Breaking Legal Proceedings
      </span>

      {/* Scroll container */}
      <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
        <div
          className="ticker-scroll"
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            fontFamily: "var(--sans)",
            fontSize: ".72rem",
            letterSpacing: ".05em",
          }}
        >
          {/* Duplicate for seamless loop */}
          <span>{text} &nbsp;&nbsp;&nbsp;{text}</span>
        </div>
      </div>
    </div>
  );
}
