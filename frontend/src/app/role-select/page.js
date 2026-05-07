"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function RoleSelect() {
  const router = useRouter();

  const handleRoleSelection = (role) => {
    localStorage.setItem("role", role);
    if (role === "judge") {
      router.push("/");
    } else {
      router.push("/citizen");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        zIndex: 6,
      }}
    >
      {/* 3D newspaper layer backgrounds */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Back page */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%) perspective(1200px) rotateY(3deg) rotateX(2deg)",
            width: "90%",
            maxWidth: 1300,
            height: "calc(100vh - 120px)",
            background: "var(--paper-cream)",
            boxShadow: "0 30px 60px rgba(0,0,0,.4)",
            borderRadius: "0 8px 8px 0",
          }}
        />
        {/* Middle page */}
        <div
          style={{
            position: "absolute",
            top: 55,
            left: "50%",
            transform: "translateX(-50%) perspective(1200px) rotateY(-2deg) rotateX(1deg)",
            width: "90%",
            maxWidth: 1300,
            height: "calc(100vh - 110px)",
            background: "var(--paper-dark)",
            boxShadow: "0 25px 50px rgba(0,0,0,.35)",
            borderRadius: "0 6px 6px 0",
          }}
        />
        {/* Front page */}
        <div
          style={{
            position: "absolute",
            top: 50,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: 1300,
            height: "calc(100vh - 100px)",
            background: "var(--paper-white)",
            boxShadow: "0 20px 80px rgba(0,0,0,.5), -8px 0 20px rgba(0,0,0,.3)",
            borderRadius: "0 10px 10px 0",
            borderLeft: "1px solid rgba(0,0,0,.08)",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="unfold-anim"
        style={{
          maxWidth: 1200,
          width: "100%",
          position: "relative",
          zIndex: 6,
        }}
      >
        {/* Newspaper front page */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "2.5rem",
            padding: "3rem 2.5rem",
            border: "1px solid var(--newsprint-gray)",
            background: "var(--paper-white)",
            position: "relative",
            boxShadow: "0 10px 40px rgba(0,0,0,.1)",
          }}
          className="front-grid"
        >
          {/* Top rule decoration */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background:
                "repeating-linear-gradient(90deg, var(--newsprint-gray) 0px, var(--newsprint-gray) 20px, transparent 20px, transparent 40px)",
            }}
          />

          {/* FEATURE COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Masthead */}
            <div style={{ borderBottom: "2px solid var(--newsprint-gray)", paddingBottom: "1rem" }}>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".68rem",
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  color: "var(--newsprint-gray)",
                  marginBottom: ".4rem",
                  fontWeight: 600,
                }}
              >
                Legal Intelligence Edition
              </div>
              <h1
                style={{
                  fontFamily: "var(--serif-display)",
                  fontSize: "clamp(2rem, 6vw, 3.8rem)",
                  fontWeight: 900,
                  letterSpacing: "-.04em",
                  textTransform: "uppercase",
                  lineHeight: 0.92,
                  color: "var(--ink-black)",
                  marginBottom: ".3rem",
                }}
              >
                Nyaya<span style={{ fontStyle: "italic", color: "var(--red-bright)" }}>Lens</span>
              </h1>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".7rem",
                  letterSpacing: ".08em",
                  color: "var(--newsprint-gray)",
                  opacity: 0.55,
                }}
              >
                {today} · Legal Intelligence System · AI-Powered
              </div>
            </div>

            {/* OFFICER ARTICLE */}
            <motion.div
              role="button"
              tabIndex={0}
              onClick={() => handleRoleSelection("judge")}
              onKeyDown={(e) => e.key === "Enter" && handleRoleSelection("judge")}
              style={{
                cursor: "pointer",
                padding: "1.5rem 0",
                borderBottom: "1px solid rgba(0,0,0,.08)",
                position: "relative",
                transition: "all .35s cubic-bezier(.25,.46,.45,.94)",
              }}
              whileHover={{ x: 8 }}
            >
              <div
                style={{
                  fontFamily: "var(--serif-display)",
                  fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-.02em",
                  color: "var(--ink-black)",
                  marginBottom: ".5rem",
                  transition: "color .3s",
                }}
              >
                Court & Government{" "}
                <span style={{ color: "var(--red-bright)" }}>Intelligence Access</span>
              </div>
              <div
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: "var(--newsprint-gray)",
                  marginBottom: ".8rem",
                  opacity: 0.85,
                  lineHeight: 1.5,
                }}
              >
                Verification. Compliance. Judicial Authority.
              </div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".68rem",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--newsprint-gray)",
                  opacity: 0.45,
                  marginBottom: ".8rem",
                }}
              >
                ⚖ Division Bench · Case Management
              </div>
              <div
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: ".95rem",
                  color: "var(--newsprint-gray)",
                  lineHeight: 1.7,
                  marginBottom: "1rem",
                  columns: 2,
                  columnGap: "1.5rem",
                }}
              >
                Access the complete judicial intelligence network. Verify departmental compliance,
                track deadlines with precision, monitor contempt risk in real-time, and issue
                authoritative directives. Upload judgments and let the 3-layer AI pipeline extract
                actionable intelligence. Review all active proceedings and maintain judicial integrity.
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontFamily: "var(--sans)",
                  fontSize: ".75rem",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--ink-black)",
                  fontWeight: 700,
                }}
              >
                Enter as Court Officer →
              </div>
            </motion.div>

            {/* CITIZEN ARTICLE */}
            <motion.div
              role="button"
              tabIndex={0}
              onClick={() => handleRoleSelection("citizen")}
              onKeyDown={(e) => e.key === "Enter" && handleRoleSelection("citizen")}
              style={{
                cursor: "pointer",
                padding: "1.5rem 0",
                position: "relative",
                transition: "all .35s cubic-bezier(.25,.46,.45,.94)",
              }}
              whileHover={{ x: 8 }}
            >
              <div
                style={{
                  fontFamily: "var(--serif-display)",
                  fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-.02em",
                  color: "var(--green-verified)",
                  marginBottom: ".5rem",
                }}
              >
                Citizen Legal{" "}
                <span style={{ color: "var(--green-verified)" }}>Access</span>
              </div>
              <div
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: "var(--newsprint-gray)",
                  marginBottom: ".8rem",
                  opacity: 0.85,
                  lineHeight: 1.5,
                }}
              >
                Understand. Track. Participate.
              </div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".68rem",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--newsprint-gray)",
                  opacity: 0.45,
                  marginBottom: ".8rem",
                }}
              >
                📰 Public Information · Case Tracking
              </div>
              <div
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: ".95rem",
                  color: "var(--newsprint-gray)",
                  lineHeight: 1.7,
                  marginBottom: "1rem",
                  columns: 2,
                  columnGap: "1.5rem",
                }}
              >
                Understand court decisions in plain language. Track your case through every stage of
                the legal process. Access simplified explanations of complex rulings and see exactly
                when important deadlines are approaching. Legal information designed for
                citizens—transparent, readable, and genuinely helpful.
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontFamily: "var(--sans)",
                  fontSize: ".75rem",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--green-verified)",
                  fontWeight: 700,
                }}
              >
                Enter as Citizen →
              </div>
            </motion.div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "2rem" }}>
            <div
              style={{
                border: "1px solid rgba(0,0,0,.15)",
                padding: "1.2rem",
                background: "rgba(0,0,0,.02)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--serif-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "-.02em",
                  marginBottom: ".8rem",
                  paddingBottom: ".6rem",
                  borderBottom: "2px solid var(--newsprint-gray)",
                  color: "var(--ink-black)",
                }}
              >
                In This Edition
              </div>
              {[
                "Editorial Intelligence",
                "Breaking Legal Strip",
                "Daily Proceedings",
                "Filing Desk",
                "Case Archives",
                "Legal Notices",
                "Court Calendar",
                "Public Records",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".72rem",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "var(--newsprint-gray)",
                    padding: ".4rem 0",
                    borderBottom: "1px dotted rgba(0,0,0,.1)",
                    cursor: "default",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                border: "1px solid rgba(0,0,0,.15)",
                padding: "1.2rem",
                background: "rgba(139,26,26,.03)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--serif-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "-.02em",
                  marginBottom: ".8rem",
                  paddingBottom: ".6rem",
                  borderBottom: "2px solid var(--red-bright)",
                  color: "var(--red-bright)",
                }}
              >
                Today's Alerts
              </div>
              {[
                { text: "⚠ Critical: PIL 2847", red: true },
                { text: "→ Compliance Due 10 May" },
                { text: "→ Contempt Risk: HIGH" },
                { text: "→ 2 Days Remaining" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: ".72rem",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: item.red ? "var(--red-bright)" : "var(--newsprint-gray)",
                    fontWeight: item.red ? 700 : 400,
                    padding: ".4rem 0",
                    borderBottom: "1px dotted rgba(0,0,0,.1)",
                  }}
                >
                  {item.text}
                </div>
              ))}
            </div>

            {/* AI System badge */}
            <div
              style={{
                border: "2px dashed var(--gold-primary)",
                padding: "1rem",
                background: "rgba(201,168,76,.06)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  left: "1rem",
                  fontFamily: "var(--sans)",
                  fontSize: ".58rem",
                  letterSpacing: ".25em",
                  background: "var(--paper-white)",
                  color: "var(--gold-primary)",
                  padding: ".15rem .4rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                AI System
              </div>
              <p
                style={{
                  fontFamily: "var(--serif-body)",
                  fontSize: ".85rem",
                  color: "var(--newsprint-gray)",
                  lineHeight: 1.6,
                  marginTop: ".5rem",
                  fontStyle: "italic",
                }}
              >
                3-Layer Intelligence: Regex Patterns → Local Ollama → OpenRouter Cloud AI
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
