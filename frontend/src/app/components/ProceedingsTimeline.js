"use client";

/**
 * ProceedingsTimeline — replaces old progress bars / step tracker.
 * Printed proceedings strip in newspaper style.
 * Keeps: timeline data (status of judgment flow).
 */
export default function ProceedingsTimeline({ selectedCase }) {
  const steps = [
    { label: "Judgment Filed", icon: "description", status: "done" },
    { label: "AI Review", icon: "auto_awesome", status: "done" },
    { label: "Verification", icon: "balance", status: selectedCase ? "done" : "active" },
    { label: "Directives Issued", icon: "checklist", status: selectedCase ? "active" : "pending" },
    { label: "Resolution", icon: "verified", status: "pending" },
  ];

  const colors = {
    done: "var(--status-verified)",
    active: "var(--accent-gold)",
    pending: "var(--border-dim)",
  };

  return (
    <div
      style={{
        padding: "2.5rem 2rem",
        border: "1px solid var(--border-dim)",
        background: "var(--card-bg)",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "var(--serif-display)",
          fontSize: "1.2rem",
          fontWeight: 800,
          letterSpacing: "-.02em",
          marginBottom: "2rem",
          color: "var(--text-main)",
          textTransform: "uppercase"
        }}
      >
        Proceeding Lifecycle
      </div>

      {/* Track */}
      <div
        className="timeline-track"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0,
          position: "relative",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 22,
                  left: "50%",
                  right: "-50%",
                  height: 2,
                  background:
                    step.status === "done"
                      ? "var(--status-verified)"
                      : "var(--border-dim)",
                  zIndex: 0,
                }}
              />
            )}

            {/* Node */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: `2px solid ${colors[step.status]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  step.status === "done"
                    ? "var(--status-verified)"
                    : step.status === "active"
                    ? "var(--card-bg)"
                    : "var(--card-bg)",
                zIndex: 1,
                position: "relative",
                transition: "all .3s",
                boxShadow:
                  step.status === "active"
                    ? `0 0 0 6px var(--highlight)`
                    : "none",
              }}
            >
              <span 
                className="material-symbols-outlined" 
                style={{ 
                  fontSize: "18px", 
                  color: step.status === "done" ? "white" : colors[step.status],
                  fontWeight: 900
                }}
              >
                {step.status === "done" ? "check" : step.icon}
              </span>
            </div>

            {/* Label */}
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".65rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: colors[step.status],
                marginTop: "1.2rem",
                textAlign: "center",
                fontWeight: 800,
                opacity: step.status === "pending" ? 0.4 : 1,
              }}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
