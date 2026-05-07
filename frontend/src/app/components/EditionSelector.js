"use client";

import { useLanguage, translations } from "../context/LanguageContext";

export default function EditionSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        border: "1px solid var(--border-dim)",
        padding: "0.2rem 0.5rem",
        borderRadius: "2px",
        background: "var(--card-bg)"
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--text-muted)" }}>
        language
      </span>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {Object.keys(translations).map((key) => (
          <button
            key={key}
            onClick={() => setLang(key)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              fontSize: "0.65rem",
              fontWeight: lang === key ? 900 : 500,
              color: lang === key ? "var(--text-main)" : "var(--text-muted)",
              textDecoration: lang === key ? "underline" : "none",
              padding: 0,
              textTransform: "uppercase",
              letterSpacing: ".05em"
            }}
          >
            {translations[key].languageName}
          </button>
        ))}
      </div>
    </div>
  );
}
