"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * CitizenDashboard — redirects citizen users to the main page 
 * (which handles role-based rendering). All citizen logic lives in page.js.
 */
export default function CitizenDashboard() {
  const router = useRouter();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      router.push("/role-select");
    } else {
      // Citizen view is handled inside the main page with role state
      router.push("/");
    }
  }, [router]);

  // Loading state in newspaper style
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper-white)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 6,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--serif-display)",
            fontSize: "2.5rem",
            fontWeight: 900,
            letterSpacing: "-.03em",
            color: "var(--ink-black)",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          Nyaya<span style={{ fontStyle: "italic", color: "var(--green-verified)" }}>Lens</span>
        </div>
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: ".7rem",
            letterSpacing: ".25em",
            textTransform: "uppercase",
            color: "var(--newsprint-gray)",
            opacity: 0.5,
          }}
        >
          Loading Citizen Edition...
        </div>
      </div>
    </div>
  );
}
