"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    languageName: "EN",
    mastheadTitle: "NYAYALENS",
    mastheadSubtitle: "Legal Intelligence & Public Transparency System",
    officerEdition: "Officer Edition",
    citizenEdition: "Citizen Edition",
    activeCases: "ACTIVE",
    criticalAlerts: "CRITICAL",
    publicAccess: "PUBLIC ACCESS",
    verifiedRecords: "VERIFIED RECORDS",
    backToArchive: "← Return to Records",
    understandingProceeding: "Understanding this proceeding",
    publicAwarenessNotice: "📰 Public Awareness Notice",
    whatThisMeansForYou: "📰 What This Means for You — Public Understanding",
    understandingCourtDecision: "Understanding the Court's Decision",
    noDeadline: "No Deadline",
    daysLeft: "days left",
    verifiedSource: "Verified Source",
    downloadRecord: "Download Official Record",
    archivedOn: "Archived on",
    explainOrder: "🔊 Explain this Order",
    stopExplanation: "⏹ Stop Explanation",
    // CaseArchive
    verifiedJudicialArchive: "Verified Judicial Archive",
    publicLegalRecords: "Public Legal Records",
    // Edition selector
    switchEdition: "Switch Edition",
    exitDesk: "Exit Desk",
    returnToPortal: "Return to Portal",
  },
  kn: {
    languageName: "ಕನ್ನಡ",
    mastheadTitle: "ನ್ಯಾಯಲೆನ್ಸ್",
    mastheadSubtitle: "ಕಾನೂನು ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಪಾರದರ್ಶಕತೆ ವ್ಯವಸ್ಥೆ",
    officerEdition: "ಅಧಿಕಾರಿ ಆವೃತ್ತಿ",
    citizenEdition: "ನಾಗರಿಕ ಆವೃತ್ತಿ",
    activeCases: "ಸಕ್ರಿಯ",
    criticalAlerts: "ನಿರ್ಣಾಯಕ",
    publicAccess: "ಸಾರ್ವಜನಿಕ ಪ್ರವೇಶ",
    verifiedRecords: "ಪರಿಶೀಲಿಸಿದ ದಾಖಲೆಗಳು",
    backToArchive: "← ದಾಖಲೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    understandingProceeding: "ಈ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು",
    publicAwarenessNotice: "📰 ಸಾರ್ವಜನಿಕ ಜಾಗೃತಿ ಸೂಚನೆ",
    whatThisMeansForYou: "📰 ಇದರ ಅರ್ಥವೇನು — ಸಾರ್ವಜನಿಕ ತಿಳುವಳಿಕೆ",
    understandingCourtDecision: "ನ್ಯಾಯಾಲಯದ ನಿರ್ಧಾರವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು",
    noDeadline: "ಯಾವುದೇ ಗಡುವು ಇಲ್ಲ",
    daysLeft: "ದಿನಗಳು ಬಾಕಿ",
    verifiedSource: "ಪರಿಶೀಲಿಸಿದ ಮೂಲ",
    downloadRecord: "ಅಧಿಕೃತ ದಾಖಲೆಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    archivedOn: "ದಾಖಲಿಸಿದ ದಿನಾಂಕ",
    explainOrder: "🔊 ಈ ಆದೇಶವನ್ನು ವಿವರಿಸಿ",
    stopExplanation: "⏹ ವಿವರಣೆಯನ್ನು ನಿಲ್ಲಿಸಿ",
    // CaseArchive
    verifiedJudicialArchive: "ಪರಿಶೀಲಿಸಿದ ನ್ಯಾಯಾಂಗ ಆರ್ಕೈವ್",
    publicLegalRecords: "ಸಾರ್ವಜನಿಕ ಕಾನೂನು ದಾಖಲೆಗಳು",
    // Edition selector
    switchEdition: "ಆವೃತ್ತಿ ಬದಲಾಯಿಸಿ",
    exitDesk: "ಡೆಸ್ಕ್‌ನಿಂದ ನಿರ್ಗಮಿಸಿ",
    returnToPortal: "ಪೋರ್ಟಲ್‌ಗೆ ಹಿಂತಿರುಗಿ",
  },
  hi: {
    languageName: "हिन्दी",
    mastheadTitle: "न्यायलेंस",
    mastheadSubtitle: "कानूनी बुद्धिमत्ता और सार्वजनिक पारदर्शिता प्रणाली",
    officerEdition: "अधिकारी संस्करण",
    citizenEdition: "नागरिक संस्करण",
    activeCases: "सक्रिय",
    criticalAlerts: "महत्वपूर्ण",
    publicAccess: "सार्वजनिक पहुँच",
    verifiedRecords: "सत्यापित रिकॉर्ड",
    backToArchive: "← रिकॉर्ड पर लौटें",
    understandingProceeding: "इस कार्यवाही को समझना",
    publicAwarenessNotice: "📰 सार्वजनिक जागरूकता सूचना",
    whatThisMeansForYou: "📰 आपके लिए इसका क्या अर्थ है — सार्वजनिक समझ",
    understandingCourtDecision: "अदालत के फैसले को समझना",
    noDeadline: "कोई समय सीमा नहीं",
    daysLeft: "दिन बाकी",
    verifiedSource: "सत्यापित स्रोत",
    downloadRecord: "आधिकारिक रिकॉर्ड डाउनलोड करें",
    archivedOn: "संग्रहीत किया गया",
    explainOrder: "🔊 इस आदेश को समझाएं",
    stopExplanation: "⏹ स्पष्टीकरण रोकें",
    // CaseArchive
    verifiedJudicialArchive: "सत्यापित न्यायिक अभिलेखागार",
    publicLegalRecords: "सार्वजनिक कानूनी रिकॉर्ड",
    // Edition selector
    switchEdition: "संस्करण बदलें",
    exitDesk: "डेस्क से बाहर निकलें",
    returnToPortal: "पोर्टल पर लौटें",
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("nyayalens_lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem("nyayalens_lang", newLang);
    }
  };

  const t = (key) => {
    return translations[lang][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
