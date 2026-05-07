import "./globals.css";

export const metadata = {
  title: "NyayaLens - Legal Intelligence",
  description: "AI-powered legal document extraction and verification",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Newsreader:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="antialiased selection:bg-primary-container selection:text-on-primary">
        {children}
      </body>
    </html>
  );
}
