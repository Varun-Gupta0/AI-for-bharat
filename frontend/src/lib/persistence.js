/**
 * Persistence Helper for NyayaLens
 * Handles localStorage fallback when backend is unavailable or for offline use.
 */

const STORAGE_KEY = "nyayalens_verified_cases";

export const getLocalCases = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to read from localStorage", e);
        return [];
    }
};

export const saveLocalCase = (caseData) => {
    try {
        const cases = getLocalCases();
        // Check if case already exists to avoid duplicates
        const index = cases.findIndex(c => c.file_id === caseData.file_id);
        if (index > -1) {
            cases[index] = caseData;
        } else {
            cases.push(caseData);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
        console.error("Failed to save to localStorage", e);
    }
};

export const syncCases = (backendCases) => {
    try {
        // Simple merge: backend takes priority
        const localCases = getLocalCases();
        const merged = [...backendCases];
        
        localCases.forEach(lc => {
            if (!merged.find(bc => bc.file_id === lc.file_id)) {
                merged.push(lc);
            }
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
    } catch (e) {
        console.error("Failed to sync cases", e);
        return backendCases;
    }
};
