'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * EvidenceViewer - The Trust Layer Component
 * 
 * Displays the original PDF and highlights the specific evidence sentence.
 */
export default function EvidenceViewer({ 
  fileId, 
  highlightText, 
  pageNumber = 1,
  onClose 
}) {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.2);
  const containerRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (fileId) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      setPdfUrl(`${baseUrl}/pdf/${fileId}`);
    }
  }, [fileId]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // Text layer highlight logic
  const textRenderer = (textItem) => {
    if (!highlightText || !textItem.str.includes(highlightText.substring(0, 10))) {
      return textItem.str;
    }

    // Basic substring highlight - in a production app, we'd use a more robust 
    // text layer search, but for this cinematic prototype, we'll use CSS classes
    const parts = textItem.str.split(highlightText);
    if (parts.length === 1) return textItem.str;

    return (
      <>
        {parts[0]}
        <mark className="legal-highlight">{highlightText}</mark>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="evidence-viewer-container flex flex-col h-full bg-[#1A1A1A] text-white shadow-2xl border-l border-white/10 overflow-hidden unfold-anim">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#252525]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gold-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-gold-primary text-sm">verified_user</span>
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-gold-light">Evidence Verification</h3>
            <p className="text-[10px] text-white/40 font-mono">SOURCE ID: {fileId?.substring(0, 8)}...</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-black/40 rounded px-2 py-1 gap-2">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="text-white/60 hover:text-white">
               <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="text-[10px] font-mono w-8 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="text-white/60 hover:text-white">
               <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <span className="material-symbols-outlined text-white/60">close</span>
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#121212] custom-scrollbar" ref={containerRef}>
        <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-2 border-gold-primary/20 border-t-gold-primary rounded-full animate-spin"></div>
                <p className="font-display text-gold-light/60 italic animate-pulse">Decrypting Original Record...</p>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale} 
              renderAnnotationLayer={true}
              renderTextLayer={true}
              className="unfold-anim"
            />
          </Document>
          
          {/* Visual Overlays */}
          <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
             <div className="text-[60px] font-display text-gold-primary/10 rotate-12 border-4 border-gold-primary/10 px-4 py-2">
                ORIGINAL
             </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      {highlightText && (
        <div className="p-4 bg-gold-primary/5 border-t border-gold-primary/20 slide-up">
          <div className="flex items-start gap-3">
             <span className="material-symbols-outlined text-gold-light mt-1">find_in_page</span>
             <div>
                <p className="text-[10px] font-mono text-gold-light/60 uppercase tracking-tighter mb-1">Extracted Evidence (Page {pageNumber})</p>
                <p className="text-xs text-white/80 italic leading-relaxed">
                   "...{highlightText}..."
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
