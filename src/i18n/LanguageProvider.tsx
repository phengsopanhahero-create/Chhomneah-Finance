"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "./client";
import {
  fallbackLng,
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguage,
} from "./config";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    () => (i18next.language as SupportedLanguage) || fallbackLng
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if ((stored === "en" || stored === "km") && stored !== i18next.language) {
      i18next.changeLanguage(stored);
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    i18next.changeLanguage(lang);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
