"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

/**
 * VoiceExplainer — Text-to-speech component for the Citizen view.
 * Provides a compassionate, human-centered summary playback with multi-language support.
 */
export default function VoiceExplainer({ text }) {
  const { lang, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Map our language code to SpeechSynthesis BCP 47 tags
  const getSpeechLangTag = (code) => {
    switch (code) {
      case "kn": return "kn-IN";
      case "hi": return "hi-IN";
      default: return "en-IN";
    }
  };

  const handlePlayStop = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      synthRef.current.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLangTag(lang);
      
      // Try to find a suitable voice for the language
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith(getSpeechLangTag(lang).substring(0, 2)));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Configure calm reading style
      utterance.rate = 0.85;
      utterance.pitch = 0.9;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      synthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <button
        onClick={handlePlayStop}
        style={{
          background: isPlaying ? "var(--text-main)" : "none",
          color: isPlaying ? "var(--card-bg)" : "var(--status-verified)",
          border: `2px solid ${isPlaying ? "var(--text-main)" : "var(--status-verified)"}`,
          cursor: "pointer",
          padding: "0.8rem 1.5rem",
          fontFamily: "var(--sans)",
          fontSize: "0.75rem",
          letterSpacing: ".1em",
          textTransform: "uppercase",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          transition: "all 0.3s ease",
          boxShadow: isPlaying ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
          {isPlaying ? "stop_circle" : "volume_up"}
        </span>
        {isPlaying ? t("stopExplanation") : t("explainOrder")}
      </button>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              marginTop: "1rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "4px",
              overflow: "hidden" 
            }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: ["10px", "24px", "8px"], 
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.2, 
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
                style={{
                  width: "4px",
                  background: "var(--status-verified)",
                  borderRadius: "2px"
                }}
              />
            ))}
            <span style={{ 
              marginLeft: "0.8rem", 
              fontFamily: "var(--sans)", 
              fontSize: "0.7rem", 
              color: "var(--text-muted)",
              letterSpacing: ".1em",
              textTransform: "uppercase" 
            }}>
              Playing audio explanation...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
