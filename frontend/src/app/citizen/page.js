"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CitizenDashboard() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      router.push("/role-select");
    } else {
      setRole(savedRole);
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-background font-data-body">
      <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-8">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
          <span className="text-lg font-bold tracking-tighter text-on-background font-data-header">NyayaLens Citizen</span>
        </div>
        <div className="flex items-center gap-md">
           <button 
             onClick={() => { localStorage.removeItem("role"); router.push("/role-select"); }}
             className="text-xs font-data-header text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
           >
             <span className="material-symbols-outlined text-sm">logout</span>
             Change Role
           </button>
        </div>
      </header>

      <main className="p-gutter max-w-4xl mx-auto w-full py-xl">
        <div className="bg-primary-container/10 border border-primary-container/20 rounded-xl p-lg mb-xl shadow-sm">
          <h1 className="font-headline-serif text-3xl mb-2 text-primary">Welcome to your Legal Support</h1>
          <p className="text-on-surface-variant leading-relaxed">
            We simplify complex court orders into clear, actionable explanations so you know exactly what is happening with your case.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
           <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <h3 className="font-data-header font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">search</span>
                Track Case
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">Enter your case number to see the latest simplified order.</p>
              <input 
                type="text" 
                placeholder="e.g. WP/1024/2024"
                className="w-full bg-surface border border-outline-variant rounded p-sm text-sm mb-4 outline-none focus:border-primary transition-colors"
              />
              <button className="w-full bg-primary text-on-primary font-data-header py-sm rounded hover:bg-primary/90 transition-colors">
                Check Status
              </button>
           </div>

           <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <h3 className="font-data-header font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">help</span>
                Legal Aid
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">Need help understanding a document? Our AI can explain it for you.</p>
              <button className="w-full border border-outline text-on-surface font-data-header py-sm rounded hover:bg-surface-variant transition-colors">
                Contact Support
              </button>
           </div>
        </div>
      </main>
    </div>
  );
}
