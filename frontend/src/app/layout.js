import "./globals.css";

export const metadata = {
  title: "NyayaLens — Living Legal Newspaper",
  description: "AI-powered legal intelligence, served in the tradition of the press.",
};

import { LanguageProvider } from "./context/LanguageContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="newspaper-texture">
        {/* Cinematic Background Layers */}
        <div className="newspaper-layer-back"></div>
        <div className="newspaper-layer-mid"></div>
        <div className="newspaper-layer-front"></div>
        
        <LanguageProvider>
          <main id="app-root" style={{ position: "relative", zIndex: 10 }}>
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
