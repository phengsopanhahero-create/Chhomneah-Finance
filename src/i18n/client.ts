"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import {
  defaultNS,
  fallbackLng,
  LANGUAGE_STORAGE_KEY,
  resources,
} from "./config";

function getInitialLanguage(): string {
  if (typeof window === "undefined") return fallbackLng;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "km") return stored;
  return fallbackLng;
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng,
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18next;
