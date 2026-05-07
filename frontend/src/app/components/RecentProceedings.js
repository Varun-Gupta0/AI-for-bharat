"use client";

import { motion } from "framer-motion";
import JudicialStatusStamp from "./JudicialStatusStamp";

/**
 * RecentProceedings — Sidebar ledger of latest judicial activity.
 */
export default function RecentProceedings({ recentCases, onSelectCase }) {
  if (!recentCases || recentCases.length === 0) return null;

  return (
    <div 
      className="recent-proceedings-panel luxury-border paper-emboss"
      style={{
        background: "var(--card-bg)",
        padding: "1.5rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        position: "relative"
      }}
    >
      <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 40, height: 12, background: "rgba(0,0,0,0.8)", borderRadius: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />

      <div style={{ borderBottom: "2px solid var(--border-dim)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: "var(--serif-display)", fontSize: "1.2rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-main)" }}>
          Recent Proceedings
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {recentCases.map((c, i) => (
          <motion.div
            key={c.file_id || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            onClick={() => onSelectCase(c)}
            style={{ 
              cursor: "pointer",
              paddingBottom: "1.2rem",
              borderBottom: i < recentCases.length - 1 ? "1px dotted var(--border-dim)" : "none"
            }}
            whileHover={{ x: 6, backgroundColor: "var(--highlight)", paddingLeft: "10px", paddingRight: "10px", margin: "0 -10px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <JudicialStatusStamp status={c.status} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "var(--text-muted)" }}>
                {c.updated_at ? new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </span>
            </div>
            
            <h4 style={{ 
              fontFamily: "var(--serif-display)", 
              fontSize: "0.95rem", 
              fontWeight: 700, 
              lineHeight: 1.3, 
              color: "var(--text-main)",
              marginBottom: "0.3rem"
            }}>
              {c.summary?.slice(0, 50)}...
            </h4>
            
            <div style={{ fontFamily: "var(--sans)", fontSize: ".65rem", color: "var(--text-muted)", opacity: 0.8 }}>
              ID: {c.tracking_id || c.file_id.substring(0, 8).toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-dim)" }}>
        <p style={{ fontFamily: "var(--serif-body)", fontSize: "0.75rem", fontStyle: "italic", color: "var(--text-muted)", textAlign: "center" }}>
          End of recent activity ledger
        </p>
      </div>
    </div>
  );
}
