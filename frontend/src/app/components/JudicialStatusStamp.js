"use client";

import { motion } from "framer-motion";

/**
 * JudicialStatusStamp — Official status markers that look like physical legal stamps.
 */
export default function JudicialStatusStamp({ status, size = "small" }) {
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
      case "pending review":
        return {
          label: "Awaiting Review",
          color: "#9a6b00", // Muted Amber
          bg: "rgba(154, 107, 0, 0.05)",
          icon: "schedule",
          rotation: -2
        };
      case "under review":
      case "processing":
        return {
          label: "Under Judicial Review",
          color: "#1e3a8a", // Navy Blue
          bg: "rgba(30, 58, 138, 0.05)",
          icon: "visibility",
          rotation: 0
        };
      case "verified":
      case "certified":
        return {
          label: "Verified by Officer",
          color: "#065f46", // Muted Green
          bg: "rgba(6, 95, 70, 0.05)",
          icon: "verified_user",
          rotation: -3
        };
      case "completed":
        return {
          label: "Proceeding Completed",
          color: "#374151", // Muted Gray/Charcoal
          bg: "rgba(55, 65, 81, 0.05)",
          icon: "task_alt",
          rotation: 0
        };
      case "escalated":
      case "high risk":
        return {
          label: "Escalated: Contempt Risk",
          color: "#b91c1c", // Red
          bg: "rgba(185, 28, 28, 0.08)",
          icon: "priority_high",
          rotation: 2
        };
      default:
        return {
          label: status || "Archived",
          color: "var(--newsprint-gray)",
          bg: "rgba(0,0,0,0.05)",
          icon: "folder",
          rotation: 0
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: size === "small" ? "0.3rem 0.7rem" : "0.6rem 1.2rem",
        border: `2px solid ${config.color}`,
        borderRadius: "2px",
        color: config.color,
        background: config.bg,
        transform: `rotate(${config.rotation}deg)`,
        boxShadow: "1px 1px 0 rgba(0,0,0,0.1)",
        fontFamily: "var(--sans)",
        fontSize: size === "small" ? "0.55rem" : "0.75rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        position: "relative",
        userSelect: "none",
        pointerEvents: "none"
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: size === "small" ? "12px" : "18px" }}>
        {config.icon}
      </span>
      {config.label}

      {/* Subtle Stamp Texture Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.1,
        backgroundImage: "radial-gradient(#000 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px"
      }} />
    </motion.div>
  );
}
