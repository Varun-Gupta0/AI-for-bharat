"use client";

import { useRouter } from 'next/navigation';

export default function RoleSelect() {
  const router = useRouter();

  const handleRoleSelection = (role) => {
    localStorage.setItem("role", role);
    if (role === "judge") {
      router.push("/");
    } else {
      router.push("/citizen");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-surface text-on-background px-4 py-12">
      <div className="w-full max-w-[500px] bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <span className="material-symbols-outlined text-primary text-[56px] mb-2" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
          <h1 className="font-headline-serif text-5xl font-bold tracking-tighter text-primary">NyayaLens</h1>
          <p className="font-data-body text-on-surface-variant max-w-[300px] mx-auto mt-2 leading-tight">Legal Intelligence & Decision Support</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleRoleSelection("judge")}
            className="w-full group flex items-center justify-between p-5 bg-primary-container text-on-primary rounded-xl hover:bg-primary transition-all duration-300 ease-in-out shadow-md border border-primary-container"
          >
            <div className="flex items-center gap-5 text-left">
              <div className="bg-white/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-3xl text-white">gavel</span>
              </div>
              <div>
                <p className="font-data-header font-bold text-xl leading-tight text-white">Continue as Judge</p>
                <p className="font-data-body text-sm text-primary-fixed opacity-90 text-white mt-1">Extract case insights & review documents</p>
              </div>
            </div>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-white">chevron_right</span>
          </button>

          <button 
            onClick={() => handleRoleSelection("citizen")}
            className="w-full group flex items-center justify-between p-5 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-variant transition-all duration-300 ease-in-out shadow-sm"
          >
            <div className="flex items-center gap-5 text-left">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-3xl text-secondary">person</span>
              </div>
              <div>
                <p className="font-data-header font-bold text-xl leading-tight text-on-background">Continue as Citizen</p>
                <p className="font-data-body text-sm text-on-surface-variant opacity-90 mt-1">View simplified case explanations</p>
              </div>
            </div>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-on-surface-variant">chevron_right</span>
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant text-center">
          <p className="font-caption text-xs text-on-surface-variant leading-relaxed px-4">
            By continuing, you agree to the terms of the Legal Intelligence System and our processing guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
