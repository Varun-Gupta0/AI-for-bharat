"use client";

/**
 * ProceedingsTimeline — replaces old progress bars / step tracker.
 * Printed proceedings strip in newspaper style.
 * Keeps: timeline data (status of judgment flow).
 */
export default function ProceedingsTimeline({ selectedCase }) {
  const steps = [
    { label: "Judgment Filed", icon: "📜", status: "done" },
    { label: "AI Review", icon: "🤖", status: "done" },
    { label: "Verification", icon: "⚖", status: selectedCase ? "done" : "active" },
    { label: "Directives Issued", icon: "📋", status: selectedCase ? "active" : "pending" },
    { label: "Resolution", icon: "✅", status: "pending" },
  ];

  const colors = {
    done: "var(--green-verified)",
    active: "var(--gold-primary)",
    pending: "rgba(0,0,0,.2)",
  };

  return (
    <div
      style={{
        padding: "2rem",
        border: "2px solid var(--newsprint-gray)",
        background: "var(--paper-cream)",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "var(--serif-display)",
          fontSize: "1.2rem",
          fontWeight: 700,
          letterSpacing: "-.02em",
          marginBottom: "1.5rem",
          color: "var(--ink-black)",
        }}
      >
        Daily Proceedings Timeline
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
                  top: 20,
                  left: "50%",
                  right: "-50%",
                  height: 2,
                  background:
                    step.status === "done"
                      ? "var(--green-verified)"
                      : step.status === "active"
                      ? "var(--gold-primary)"
                      : "rgba(0,0,0,.1)",
                  zIndex: 0,
                }}
              />
            )}

            {/* Node */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${colors[step.status]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  step.status === "done"
                    ? "var(--green-verified)"
                    : step.status === "active"
                    ? "var(--gold-primary)"
                    : "var(--paper-white)",
                zIndex: 1,
                position: "relative",
                fontFamily: "var(--sans)",
                fontWeight: 700,
                fontSize: ".75rem",
                color:
                  step.status === "done" || step.status === "active"
                    ? step.status === "active"
                      ? "var(--ink-black)"
                      : "white"
                    : "var(--newsprint-gray)",
                transition: "all .3s",
                boxShadow:
                  step.status === "active"
                    ? `0 0 0 6px rgba(201,168,76,.2)`
                    : "none",
              }}
            >
              {step.status === "done" ? "✓" : step.icon}
            </div>

            {/* Label */}
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: ".65rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color:
                  step.status === "done"
                    ? "var(--green-verified)"
                    : step.status === "active"
                    ? "var(--gold-primary)"
                    : "var(--newsprint-gray)",
                marginTop: ".8rem",
                textAlign: "center",
                fontWeight: 600,
                opacity: step.status === "pending" ? 0.45 : 1,
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
