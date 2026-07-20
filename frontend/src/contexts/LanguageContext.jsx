import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/translations";
const LanguageContext = createContext(undefined);
const STORAGE_KEY = "preferredLanguage";
export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState("en");
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "en" || stored === "bem")
            setLanguageState(stored);
    }, []);
    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, lang);
        }
    }, []);
    const t = useCallback((key) => translations[language][key] ?? translations.en[key] ?? key, [language]);
    return (<LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>);
}
export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx)
        throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
