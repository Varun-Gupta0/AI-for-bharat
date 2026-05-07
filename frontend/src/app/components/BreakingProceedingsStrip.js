"use client";

/**
 * BreakingProceedingsStrip — Urgent scrolling alerts for Judicial Command.
 */
export default function BreakingProceedingsStrip() {
  const alerts = [
    "Compliance deadline in 48 hours: Case NY-2026-8491",
    "Contempt risk detected in Department of Revenue proceedings",
    "Official High Court directive received regarding land acquisition",
    "Escalation pending for Case NY-2026-1120 — Internal Review Required",
    "Statutory timeline breach imminent for 3 verified actions"
  ];

  return (
    <div 
      className="judicial-bulletin-ticker"
      style={{
        background: "var(--court-red)",
        color: "white",
        padding: "0.5rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        boxShadow: "0 4px 12px rgba(139, 26, 26, 0.2)"
      }}
    >
      <div style={{
        display: "inline-block",
        paddingRight: "100%",
        animation: "ticker 40s linear infinite",
        fontFamily: "var(--sans)",
        fontSize: "0.65rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.15em"
      }}>
        {alerts.map((a, i) => (
          <span key={i} style={{ paddingRight: "6rem" }}>
            <span style={{ 
              background: "white", 
              color: "var(--court-red)", 
              padding: "0.1rem 0.5rem", 
              marginRight: "1rem",
              borderRadius: "1px"
            }}>
              OFFICIAL BULLETIN
            </span>
            {a} •
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
