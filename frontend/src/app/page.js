"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument, analyzeDocument, verifyActions, fetchVerifiedCases } from '../lib/api';
import { getLocalCases, saveLocalCase, syncCases } from '../lib/persistence';
import { generateReport } from '../lib/reportGenerator';

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | analyzing | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [activeView, setActiveView] = useState("extraction"); // extraction | dashboard
  
  // Data state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileId, setFileId] = useState("");
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [role, setRole] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [trackingSearch, setTrackingSearch] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      router.push("/role-select");
    } else {
      setRole(savedRole);
      // Citizen defaults to dashboard view
      if (savedRole === "citizen") {
        setActiveView("dashboard");
      }
    }
    loadCases();
  }, [router]);

  const handleCopyID = (id) => {
    navigator.clipboard.writeText(id);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const generateTrackingID = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `NY-2026-${random}`;
  };

  const handleTrackCase = (e) => {
    e.preventDefault();
    const searchID = trackingSearch.trim().toUpperCase();
    const found = cases.find(c => (c.tracking_id || "").toUpperCase() === searchID);
    
    if (found) {
        setSelectedCase(found);
        setActiveView("dashboard");
        setTrackingSearch(""); // Clear search
    } else {
        alert(`Tracking ID "${searchID}" not found. Please check the ID and try again.`);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedCase) return;
    
    const reports = generateReport(selectedCase, role);
    setGeneratedReport(reports);
    setActiveView("report");
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const loadCases = async () => {
    try {
        const backendCases = await fetchVerifiedCases();
        const synced = syncCases(backendCases).map(c => ({
            ...c,
            tracking_id: c.tracking_id || `NY-${c.file_id.substring(0, 4)}-LEGACY`
        }));
        setCases(synced);
    } catch (err) {
        console.warn("Backend fetch failed, using local storage fallback", err);
        const local = getLocalCases().map(c => ({
            ...c,
            tracking_id: c.tracking_id || `NY-${c.file_id.substring(0, 4)}-LEGACY`
        }));
        setCases(local);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessDocument = async () => {
    if (!file) return;
    try {
      setStatus("uploading");
      setErrorMsg("");
      const uploadResult = await uploadDocument(file);
      setFileId(uploadResult.file_id);
      
      setStatus("analyzing");
      const analyzeResult = await analyzeDocument(uploadResult.file_id);
      setAnalysisResult(analyzeResult.analysis);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const handleVerify = async () => {
    if (!analysisResult) return;
    
    const trackingID = generateTrackingID();
    const verifiedData = {
        file_id: fileId,
        tracking_id: trackingID,
        summary: analysisResult.decision_summary || analysisResult.case_summary,
        verified_actions: analysisResult.actions,
        status: "VERIFIED",
        timestamp: new Date().toISOString()
    };

    try {
        const payload = analysisResult.actions.map((action, idx) => ({
            index: idx,
            status: "approved"
        }));
        
        await verifyActions(fileId, payload);
        saveLocalCase(verifiedData);
        setVerificationSuccess(trackingID);
        await loadCases();
        setAnalysisResult(null);
        setActiveView("dashboard");
    } catch (err) {
        console.error("Failed to verify case", err);
        // Fallback to local save
        saveLocalCase(verifiedData);
        setVerificationSuccess(trackingID);
        await loadCases();
        setAnalysisResult(null);
        setActiveView("dashboard");
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden text-on-background">
      {/* Sidebar */}
      <nav className="w-64 border-r border-outline-variant bg-surface-container-lowest h-full flex flex-col py-6 px-4 shrink-0 z-50">
        <div className="flex items-center gap-sm mb-xl">
          <span className="material-symbols-outlined text-primary text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tighter text-on-background font-data-header">NyayaLens</span>
            <span className="text-caption font-caption text-on-surface-variant">Legal Intelligence</span>
          </div>
        </div>
        <button 
          onClick={() => { setStatus("idle"); setAnalysisResult(null); setFile(null); }}
          className="w-full bg-primary-container text-on-primary font-data-header py-sm px-md rounded hover:bg-primary transition-colors duration-200 ease-in-out mb-xl flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Case Research
        </button>
        <ul className="flex-1 flex flex-col gap-sm">
          {role === "judge" && (
            <li>
              <button 
                onClick={() => setActiveView("extraction")}
                className={`w-full flex items-center gap-md py-sm px-sm rounded font-data-body text-sm font-semibold transition-colors ${activeView === 'extraction' ? 'border-l-4 border-primary-container bg-surface-container' : 'text-on-surface-variant hover:text-on-background hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined" style={{fontVariationSettings: activeView === 'extraction' ? "'FILL' 1" : "'FILL' 0"}}>fact_check</span>
                Verification
              </button>
            </li>
          )}
          <li>
            <button 
              onClick={() => setActiveView("dashboard")}
              className={`w-full flex items-center gap-md py-sm px-sm rounded font-data-body text-sm font-semibold transition-colors ${activeView === 'dashboard' ? 'border-l-4 border-primary-container bg-surface-container' : 'text-on-surface-variant hover:text-on-background hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined" style={{fontVariationSettings: activeView === 'dashboard' ? "'FILL' 1" : "'FILL' 0"}}>dashboard</span>
              {role === "citizen" ? "My Legal Overview" : "Cases Dashboard"}
            </button>
          </li>
          {generatedReport && (
            <li>
              <button 
                onClick={() => setActiveView("report")}
                className={`w-full flex items-center gap-md py-sm px-sm rounded font-data-body text-sm font-semibold transition-colors ${activeView === 'report' ? 'border-l-4 border-primary-container bg-surface-container' : 'text-on-surface-variant hover:text-on-background hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined" style={{fontVariationSettings: activeView === 'report' ? "'FILL' 1" : "'FILL' 0"}}>description</span>
                Active Report
              </button>
            </li>
          )}
          <li className="mt-auto pt-md border-t border-outline-variant">
            <button 
              onClick={() => { localStorage.removeItem("role"); router.push("/role-select"); }}
              className="flex items-center gap-md py-sm px-sm rounded text-error hover:bg-error-container/20 transition-colors font-data-body text-sm w-full"
            >
              <span className="material-symbols-outlined">logout</span>
              Switch Role
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-8 z-40 sticky top-0">
            <nav className="hidden md:flex gap-8">
                <button 
                  onClick={() => setActiveView("dashboard")}
                  className={`font-data-header text-sm ${activeView === 'dashboard' ? 'text-on-background border-b-2 border-primary-container pb-1' : 'text-on-surface-variant hover:text-on-background'}`}
                >
                  {role === "citizen" ? "My Cases" : "Cases"}
                </button>
                {role === "judge" && <button className="font-data-body text-sm text-on-surface-variant hover:text-on-background">Statutes</button>}
                {activeView === "report" && (
                  <button className="font-data-header text-sm text-on-background border-b-2 border-primary-container pb-1">Generated Report</button>
                )}
            </nav>
            <div className="flex items-center gap-md relative">
                {role === "judge" && <button className="text-error font-data-header text-sm border border-error rounded px-md py-xs hover:bg-error-container transition-colors">Urgent Action</button>}
                <div className="flex items-center gap-sm text-on-surface-variant relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-xs rounded hover:bg-surface-variant transition-colors relative ${showNotifications ? 'bg-surface-variant' : ''}`}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {(cases.some(c => c.verified_actions.some(a => a.risk_level === 'HIGH'))) && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                                <h4 className="font-data-header font-bold text-sm">Alerts & Status</h4>
                                <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">LIVE</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {cases.filter(c => c.verified_actions.some(a => a.risk_level === 'HIGH')).map((c, i) => (
                                    <div key={i} className="p-4 border-b border-outline-variant hover:bg-error-container/10 transition-colors cursor-pointer group" onClick={() => { setSelectedCase(c); setShowNotifications(false); setActiveView("dashboard"); }}>
                                        <div className="flex gap-3">
                                            <span className="material-symbols-outlined text-error text-sm mt-1">warning</span>
                                            <div>
                                                <p className="text-xs font-bold text-error uppercase tracking-tighter">High Risk Directive</p>
                                                <p className="text-[11px] font-semibold text-on-background line-clamp-2 mt-1">{c.summary}</p>
                                                {c.verified_actions[0]?.days_remaining !== null && (
                                                    <p className="text-[10px] text-on-surface-variant mt-1 italic">{c.verified_actions[0].days_remaining} days left to comply</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {role === "judge" && (
                                    <div className="p-4 bg-surface-container-low/50">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary text-sm">pending_actions</span>
                                            <p className="text-[11px] font-medium">3 verifications in analysis queue</p>
                                        </div>
                                    </div>
                                )}

                                {cases.filter(c => c.verified_actions.some(a => a.risk_level === 'HIGH')).length === 0 && (
                                    <div className="p-8 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-outline/30 text-3xl mb-2">notifications_off</span>
                                        <p className="text-[11px] text-on-surface-variant">No critical alerts at this time.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-surface-container-low border-t border-outline-variant text-center">
                                <button className="text-[10px] font-bold text-primary hover:underline">View All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Content */}
        <main className="p-gutter max-w-6xl mx-auto w-full pb-xl">
          {activeView === "dashboard" ? (
            <div className="flex flex-col gap-lg">
                {!selectedCase ? (
                  <>
                    <div className="flex flex-col gap-md mb-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-headline-serif text-3xl mb-1 text-primary">
                                    {role === "citizen" ? "Track Your Case" : "Case Intelligence Ledger"}
                                </h1>
                                <p className="font-data-body text-on-surface-variant">
                                    {role === "citizen" 
                                        ? "Enter your tracking number to access your legal report." 
                                        : "Centralized record of all verified court directives and deadlines."}
                                </p>
                            </div>
                            {role === "judge" && (
                                <button 
                                    onClick={() => setActiveView("extraction")}
                                    className="bg-primary text-on-primary px-md py-sm rounded-lg font-data-header text-sm shadow-md hover:bg-primary/90 transition-all flex items-center gap-xs"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    New Case
                                </button>
                            )}
                        </div>

                        {/* Search Bar for Citizens */}
                        {role === "citizen" && (
                            <form onSubmit={handleTrackCase} className="flex gap-md bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant shadow-lg max-w-2xl">
                                <div className="flex-1 flex items-center gap-sm px-md">
                                    <span className="material-symbols-outlined text-outline">search</span>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Tracking ID (e.g. NY-2026-1234)..."
                                        className="flex-1 bg-transparent border-none focus:outline-none font-data-body text-sm py-2"
                                        value={trackingSearch}
                                        onChange={(e) => setTrackingSearch(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="bg-primary text-on-primary px-lg py-2 rounded-xl font-data-header text-sm shadow-md hover:bg-primary/90 transition-all">
                                    Access Report
                                </button>
                            </form>
                        )}

                        {/* Verification Success Alert */}
                        {verificationSuccess && (
                            <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl border border-primary/20 flex items-center justify-between animate-in slide-in-from-top-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary text-on-primary p-3 rounded-full">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">Case Successfully Verified</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-sm opacity-80">Tracking ID: <span className="font-black text-lg select-all text-primary">{verificationSuccess}</span></p>
                                            <button 
                                                onClick={() => handleCopyID(verificationSuccess)}
                                                className="bg-white/20 hover:bg-white/40 p-1.5 rounded-lg flex items-center gap-1 transition-all"
                                                title="Copy Tracking ID"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">{copySuccess ? 'check' : 'content_copy'}</span>
                                                <span className="text-[10px] font-bold">{copySuccess ? 'COPIED' : 'COPY'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setVerificationSuccess(null)} className="p-2 hover:bg-black/5 rounded-full"><span className="material-symbols-outlined">close</span></button>
                            </div>
                        )}
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl overflow-hidden">
                        {cases.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center">
                                <div className="bg-surface-container p-6 rounded-full mb-4">
                                    <span className="material-symbols-outlined text-outline text-[64px]">folder_managed</span>
                                </div>
                                <h3 className="font-headline-serif text-2xl mb-2">No Active Cases</h3>
                                <p className="font-data-body text-on-surface-variant max-w-[320px]">
                                    {role === "citizen" 
                                        ? "You don't have any cases tracked yet. Use the search bar above to find your case." 
                                        : "Your legal intelligence ledger is empty. Upload a judgment to begin."}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-outline-variant">
                                        <th className="font-label-caps text-[11px] tracking-widest text-on-surface-variant py-4 px-6">Tracking ID</th>
                                        <th className="font-label-caps text-[11px] tracking-widest text-on-surface-variant py-4 px-6 w-1/2">Case Summary</th>
                                        {role === "judge" && <th className="font-label-caps text-[11px] tracking-widest text-on-surface-variant py-4 px-6">Dept</th>}
                                        <th className="font-label-caps text-[11px] tracking-widest text-on-surface-variant py-4 px-6">Deadline</th>
                                        <th className="font-label-caps text-[11px] tracking-widest text-on-surface-variant py-4 px-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {cases.map((c, idx) => {
                                        const primaryAction = c.verified_actions[0] || {};
                                        const risk = primaryAction.risk_level || "LOW";
                                        
                                        const riskColors = {
                                            HIGH: "bg-error-container text-on-error-container border-error",
                                            MEDIUM: "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary",
                                            LOW: "bg-green-100 text-green-900 border-green-300"
                                        };

                                        return (
                                            <tr 
                                                key={idx} 
                                                onClick={() => setSelectedCase(c)}
                                                className="hover:bg-primary-fixed/20 transition-all cursor-pointer group"
                                            >
                                                <td className="py-5 px-6 font-data-body">
                                                    <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                                                        {c.tracking_id || "PENDING"}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 font-data-body">
                                                    <p className="font-semibold text-on-background group-hover:text-primary transition-colors line-clamp-1">{c.summary}</p>
                                                </td>
                                                {role === "judge" && (
                                                    <td className="py-5 px-6 font-data-body text-sm text-on-surface-variant">
                                                        {primaryAction.department || "General"}
                                                    </td>
                                                )}
                                                <td className="py-5 px-6 font-data-body text-sm">
                                                    {primaryAction.deadline || "TBD"}
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${risk === 'HIGH' ? 'bg-error animate-pulse' : 'bg-green-500'}`}></div>
                                                        <span className="text-[11px] font-bold text-on-surface-variant uppercase">{risk === 'HIGH' ? 'URGENT' : 'ACTIVE'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-md">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSelectedCase(null)}
                                className="p-2 rounded-full hover:bg-surface-container transition-colors"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="font-headline-serif text-3xl text-primary">
                                    {role === "citizen" ? "Your Case Summary" : "Case Detail"}
                                </h1>
                                <p className="font-data-body text-sm text-on-surface-variant">
                                    {role === "citizen" ? "Simplified legal overview" : `Tracking ID: ${selectedCase.tracking_id || selectedCase.file_id}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-container text-primary px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm">pin</span>
                                <span className="font-black text-sm tracking-widest uppercase">{selectedCase.tracking_id || "INTERNAL-ONLY"}</span>
                            </div>
                            <button 
                                onClick={() => handleCopyID(selectedCase.tracking_id)}
                                className="bg-surface-container hover:bg-surface-variant p-2.5 rounded-xl border border-outline-variant transition-all group relative"
                                title="Copy ID"
                            >
                                <span className="material-symbols-outlined text-[20px]">{copySuccess ? 'check' : 'content_copy'}</span>
                                {copySuccess && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-background text-surface px-2 py-1 rounded text-[10px] font-bold">COPIED</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm mb-lg">
                        <div className="flex items-center justify-between relative max-w-4xl mx-auto py-4">
                            {/* Connector Lines */}
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant -translate-y-4 z-0"></div>
                            
                            {[
                                { label: 'Judgment', icon: 'gavel', status: 'completed' },
                                { label: 'Action', icon: 'bolt', status: 'completed' },
                                { label: 'Deadline', icon: 'event', status: 'verified' },
                                { label: 'Status', icon: 'verified_user', status: 'pending' }
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 relative z-10 bg-surface-container-lowest px-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                        step.status === 'completed' ? 'bg-primary border-primary text-on-primary' : 
                                        step.status === 'verified' ? 'bg-primary-container border-primary text-primary' : 
                                        'bg-surface-container border-outline-variant text-on-surface-variant'
                                    }`}>
                                        <span className="material-symbols-outlined text-sm">{step.icon}</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-bold uppercase tracking-widest">{step.label}</p>
                                        <p className={`text-[9px] font-black uppercase ${
                                            step.status === 'completed' ? 'text-primary' : 
                                            step.status === 'verified' ? 'text-primary' : 
                                            'text-on-surface-variant'
                                        }`}>
                                            {step.status === 'completed' ? 'Received' : step.status === 'verified' ? 'Active' : 'In Progress'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                        <div className="lg:col-span-2 flex flex-col gap-lg">
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
                                <h3 className="font-data-header font-bold text-primary mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined">subject</span>
                                    {role === "citizen" ? "What happened in your case?" : "Decision Executive Summary"}
                                </h3>
                                <p className="font-summary-body text-lg leading-relaxed text-on-surface italic border-l-4 border-primary-container pl-6 py-2">
                                    "{selectedCase.summary}"
                                </p>

                                {role === "citizen" && selectedCase.citizen_explanation && (
                                    <div className="mt-6 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
                                        <h4 className="font-data-header font-bold text-sm mb-2 text-on-background">In Simple Terms:</h4>
                                        <p className="font-data-body text-on-surface-variant leading-relaxed">
                                            {selectedCase.citizen_explanation}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {role === "judge" && (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                                    <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
                                        <h3 className="font-data-header font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined">list_alt</span>
                                            Required Directives
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-outline-variant">
                                        {selectedCase.verified_actions.map((action, i) => (
                                            <div key={i} className="p-6 hover:bg-surface-variant/30 transition-colors">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <p className="font-data-body font-semibold text-on-background flex-1">{action.action}</p>
                                                    <span className={`text-[10px] px-2 py-1 rounded border font-bold uppercase ${action.risk_level === 'HIGH' ? 'bg-error-container text-on-error-container border-error' : 'bg-surface-container text-on-surface-variant border-outline'}`}>
                                                        {action.risk_level || 'LOW'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-md text-xs text-on-surface-variant">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">business</span>
                                                        {action.department}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">event</span>
                                                        {action.deadline || "No deadline set"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {role === "citizen" && (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
                                    <h3 className="font-data-header font-bold text-primary mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined">event</span>
                                        Important Deadlines
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedCase.verified_actions.map((action, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-surface-container rounded-xl">
                                                <p className="font-data-body text-sm font-semibold">{action.action}</p>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold">{action.deadline || "No Deadline"}</p>
                                                    {action.days_remaining !== null && <p className="text-[10px] text-on-surface-variant uppercase">{action.days_remaining} days left</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-lg">
                            <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-xl">
                                <h4 className="font-data-header font-bold mb-4 opacity-80 uppercase text-xs tracking-widest">
                                    {role === "citizen" ? "Next Steps" : "Case Compliance"}
                                </h4>
                                <div className="text-4xl font-headline-serif mb-2">
                                    {role === "citizen" ? "Follow Up" : "100%"}
                                </div>
                                <p className="text-xs opacity-70 mb-6">
                                    {role === "citizen" 
                                        ? "The court has assigned actions to various departments. No action is needed from your side at this moment." 
                                        : "All extracted directives have been human-verified and assigned to departments."}
                                </p>
                                <button 
                                    onClick={handleGenerateReport}
                                    className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-bold transition-colors"
                                >
                                    Generate Report
                                </button>
                            </div>

                            {role === "judge" && (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-data-header font-bold mb-4 text-sm">Audit Trail</h4>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-3 items-start">
                                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                                            <div>
                                                <p className="text-xs font-bold">Verified by Officer John</p>
                                                <p className="text-[10px] text-on-surface-variant">May 04, 2026 • 14:11</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {role === "citizen" && (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-data-header font-bold mb-4 text-sm">Need Legal Help?</h4>
                                    <p className="text-xs text-on-surface-variant mb-4">If you don't understand these directives, you can contact the free legal aid cell.</p>
                                    <button className="w-full border border-outline-variant py-2 rounded-lg text-xs font-bold hover:bg-surface-variant transition-colors">
                                        Call Legal Aid
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                )}
            </div>
          ) : activeView === "report" ? (
            <div className="flex flex-col gap-lg animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-md">
                <div className="flex items-center justify-between mb-md">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setActiveView("dashboard")}
                            className="p-2 rounded-full hover:bg-surface-container transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="font-headline-serif text-3xl text-primary">Report Preview</h1>
                            <p className="font-data-body text-sm text-on-surface-variant">Review the generated legal directive before downloading.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleDownloadPDF}
                        className="bg-primary text-on-primary px-lg py-sm rounded-xl font-data-header shadow-lg hover:bg-primary/90 transition-all flex items-center gap-sm"
                    >
                        <span className="material-symbols-outlined">download</span>
                        Download as PDF
                    </button>
                </div>

                <div className="bg-white border border-outline-variant rounded-2xl shadow-2xl overflow-hidden min-h-[800px] p-xl">
                    <div dangerouslySetInnerHTML={{ __html: generatedReport.html }} />
                </div>
            </div>
          ) : (
            <>
              {!analysisResult ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg shadow-sm">
                  <h2 className="font-headline-serif text-2xl mb-2">Upload Source Document</h2>
                  <p className="font-data-body text-sm text-on-surface-variant mb-6">Upload a PDF judgment or order to begin AI extraction.</p>
                  
                  <div className="mb-4">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-on-surface-variant
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-data-header
                        file:bg-surface-container file:text-on-background
                        hover:file:bg-surface-variant cursor-pointer border border-outline-variant rounded p-2"
                    />
                  </div>

                  <button 
                    onClick={handleProcessDocument}
                    disabled={!file || status === "uploading" || status === "analyzing"}
                    className="bg-primary-container text-on-primary font-data-header py-2 px-6 rounded disabled:opacity-50 hover:bg-primary transition-colors"
                  >
                    {status === "idle" && "Extract Data"}
                    {status === "uploading" && "Uploading Document..."}
                    {status === "analyzing" && "AI is Extracting..."}
                    {status === "error" && "Retry Extraction"}
                  </button>

                  {status === "error" && (
                    <p className="text-error font-data-body text-sm mt-4">{errorMsg}</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-lg">
                    <div className="mb-md">
                        <h1 className="font-headline-serif text-3xl mb-2">Data Extraction Review</h1>
                        <p className="font-data-body text-on-surface-variant">Review AI-extracted fields against the source document.</p>
                    </div>

                    {/* Case Summary Panel */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded p-md shadow-sm">
                        <h3 className="font-data-header text-on-surface mb-4 border-b border-outline-variant pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined">description</span> 
                            Case Insights & Summary
                        </h3>
                        
                        {/* Top Row: Court & Date */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <span className="font-label-caps text-on-surface-variant block mb-1">Court</span>
                                <p className="font-data-body">{analysisResult?.court || "Unknown"}</p>
                            </div>
                            <div>
                                <span className="font-label-caps text-on-surface-variant block mb-1">Date</span>
                                <p className="font-data-body">{analysisResult?.order_date || "Unknown"}</p>
                            </div>
                        </div>

                        {/* Alert: Urgency Message (If present) */}
                        {analysisResult?.urgency_message && (
                            <div className="mb-6 bg-error-container/20 border border-error-container text-on-surface rounded p-3 flex gap-2 items-start">
                                <span className="material-symbols-outlined text-error text-sm mt-0.5">warning</span>
                                <div>
                                    <span className="font-label-caps text-error block mb-0.5">Urgency Level</span>
                                    <p className="font-data-body text-sm">{analysisResult.urgency_message}</p>
                                </div>
                            </div>
                        )}

                        {/* Analysis Blocks */}
                        <div className="flex flex-col gap-5">
                            {/* Decision Summary */}
                            <div>
                                <span className="font-label-caps text-on-surface-variant block mb-1">Core Decision</span>
                                <p className="font-summary-body leading-relaxed border-l-4 border-primary-container pl-3 py-1 font-semibold text-on-surface">
                                    {analysisResult?.decision_summary || analysisResult?.case_summary || "Processing..."}
                                </p>
                            </div>

                            {/* Citizen Explanation */}
                            {analysisResult?.citizen_explanation && (
                                <div>
                                    <span className="font-label-caps text-on-surface-variant block mb-1">Plain Language Explanation</span>
                                    <p className="font-data-body text-sm leading-relaxed bg-surface-container-low p-3 rounded border border-outline-variant">
                                        {analysisResult.citizen_explanation}
                                    </p>
                                </div>
                            )}

                            {/* Recommended Action */}
                            {analysisResult?.recommended_action && (
                                <div>
                                    <span className="font-label-caps text-on-surface-variant block mb-1">Recommended Next Step</span>
                                    <p className="font-data-body text-sm leading-relaxed border-l-4 border-secondary-container pl-3 py-1 text-on-surface-variant">
                                        {analysisResult.recommended_action}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Table */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant">
                                    <th className="font-label-caps text-on-surface-variant py-sm px-md w-1/3">Required Action</th>
                                    <th className="font-label-caps text-on-surface-variant py-sm px-md w-1/4">Department</th>
                                    <th className="font-label-caps text-on-surface-variant py-sm px-md w-1/4">Deadline / Risk</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {analysisResult.actions.map((action, idx) => (
                                    <tr key={idx} className="hover:bg-surface-variant transition-colors group">
                                        <td className="py-sm px-md font-data-body">
                                            <p className="font-semibold">{action.action}</p>
                                            <p className="text-xs text-on-surface-variant mt-1">Type: {action.action_type}</p>
                                        </td>
                                        <td className="py-sm px-md font-data-body text-sm">{action.department}</td>
                                        <td className="py-sm px-md font-data-body">
                                            {action.deadline ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold">{action.deadline}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded w-max font-bold ${action.risk_level === 'HIGH' ? 'bg-error-container text-on-error-container border border-error' : 'bg-surface-container text-on-surface-variant border border-outline-variant'}`}>
                                                        {action.days_remaining !== null ? `${action.days_remaining} Days Left` : 'Unknown Risk'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-on-surface-variant text-sm">No Deadline</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-surface-container-low p-md rounded border border-outline-variant flex gap-md justify-end mt-4">
                        <button className="px-md py-sm border border-primary-container text-primary-container rounded font-data-header hover:bg-surface-variant transition-colors">
                            Edit Manually
                        </button>
                        <button onClick={handleVerify} className="px-md py-sm bg-primary-container text-on-primary rounded font-data-header hover:bg-primary transition-colors flex items-center gap-xs shadow-sm">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Approve All
                        </button>
                    </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
