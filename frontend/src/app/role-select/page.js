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
    // Add data attribute to body immediately for CSS vars
    document.body.setAttribute('data-role', role);
    router.push("/");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "transparent", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      zIndex: 20
    }}>
      <div className="newspaper-split-container" style={{ 
        width: "95vw", 
        maxWidth: "1400px", 
        height: "85vh", 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "4px",
        background: "var(--newsprint-gray)",
        border: "12px solid #1a1a1a",
        boxShadow: "0 50px 100px rgba(0,0,0,0.8)",
        position: "relative"
      }}>
        
        {/* CENTER DIVIDER LABEL */}
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%) rotate(-90deg)", 
          zIndex: 10,
          background: "#1a1a1a",
          padding: "1rem 2rem",
          color: "white",
          fontFamily: "var(--sans)",
          fontSize: "0.7rem",
          fontWeight: 900,
          letterSpacing: "0.5em",
          textTransform: "uppercase"
        }}>
          NYAYALENS SELECTION
        </div>

        {/* LEFT SIDE: JUDGE / OFFICER (Dark Judicial Command) */}
        <motion.div 
          whileHover={{ flex: 1.2 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          onClick={() => handleRoleSelection("officer")}
          style={{ 
            background: "#0d1117", 
            cursor: "pointer", 
            padding: "4rem", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          {/* Background Archive Texture */}
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            opacity: 0.05, 
            backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
            pointerEvents: "none"
          }} />

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: "0.7rem", color: "#c6a306", fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Judicial Ops
            </div>
            <h1 style={{ fontFamily: "var(--serif-display)", fontSize: "4rem", fontWeight: 900, color: "white", lineHeight: 1, marginBottom: "2rem" }}>
              Court Intelligence <br/>Desk
            </h1>
            <p style={{ fontFamily: "var(--serif-body)", fontSize: "1.2rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "450px" }}>
              Official portal for Judges and Government Officers. Verification, Compliance Tracking, and Judicial Authority Desk.
            </p>
            
            <div style={{ marginTop: "3rem", display: "flex", gap: "2rem" }}>
               <div style={{ borderLeft: "2px solid #8b0000", paddingLeft: "1rem" }}>
                  <div style={{ color: "white", fontWeight: 800, fontSize: "1.2rem" }}>COMPLIANCE</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>URGENCY TRACKING</div>
               </div>
               <div style={{ borderLeft: "2px solid #c6a306", paddingLeft: "1rem" }}>
                  <div style={{ color: "white", fontWeight: 800, fontSize: "1.2rem" }}>VERIFIED</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>ARCHIVAL RECORDS</div>
               </div>
            </div>

            <div style={{ 
              marginTop: "4rem", 
              padding: "1rem 2rem", 
              border: "1px solid white", 
              display: "inline-block", 
              color: "white",
              fontFamily: "var(--sans)",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.1em"
            }}>
              AUTHORIZE ACCESS →
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: CITIZEN (Warm Newspaper) */}
        <motion.div 
          whileHover={{ flex: 1.2 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          onClick={() => handleRoleSelection("citizen")}
          style={{ 
            background: "#fdfcf8", 
            cursor: "pointer", 
            padding: "4rem", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            position: "relative"
          }}
        >
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <div style={{ fontFamily: "var(--sans)", fontSize: "0.7rem", color: "#2c5282", fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Public Access
            </div>
            <h1 style={{ fontFamily: "var(--serif-display)", fontSize: "4rem", fontWeight: 900, color: "#1a1a1a", lineHeight: 1, marginBottom: "2rem" }}>
              Citizen Legal <br/>Access
            </h1>
            <p style={{ fontFamily: "var(--serif-body)", fontSize: "1.2rem", color: "#4a4a4a", lineHeight: 1.6, maxWidth: "450px" }}>
              Simple explanations for the public. Understand what is happening in your case without the legal jargon.
            </p>

            <div style={{ marginTop: "3rem", display: "flex", gap: "2rem" }}>
               <div style={{ borderLeft: "2px solid #2c5282", paddingLeft: "1rem" }}>
                  <div style={{ color: "#1a1a1a", fontWeight: 800, fontSize: "1.2rem" }}>CLARITY</div>
                  <div style={{ color: "#718096", fontSize: "0.7rem" }}>PLAIN LANGUAGE</div>
               </div>
               <div style={{ borderLeft: "2px solid #b45309", paddingLeft: "1rem" }}>
                  <div style={{ color: "#1a1a1a", fontWeight: 800, fontSize: "1.2rem" }}>TRUST</div>
                  <div style={{ color: "#718096", fontSize: "0.7rem" }}>TRANSPARENCY</div>
               </div>
            </div>

            <div style={{ 
              marginTop: "4rem", 
              padding: "1rem 2rem", 
              background: "#2c5282", 
              display: "inline-block", 
              color: "white",
              fontFamily: "var(--sans)",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              borderRadius: "4px"
            }}>
              VIEW MY CASE →
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* MASTHEAD FLOATING */}
      <div style={{ position: "fixed", top: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
          <h2 style={{ 
            fontFamily: "var(--serif-display)", 
            fontSize: "1.2rem", 
            fontWeight: 900, 
            color: "white", 
            background: "#8b0000",
            padding: "0.5rem 1.5rem",
            letterSpacing: "0.2em"
          }}>
            NYAYALENS
          </h2>
      </div>
    </div>
  );
}
