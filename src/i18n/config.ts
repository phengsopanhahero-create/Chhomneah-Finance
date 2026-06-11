import en from "./locales/en.json";
import km from "./locales/km.json";

export const defaultNS = "translation";
export const fallbackLng = "en";
export const supportedLngs = ["en", "km"] as const;
export type SupportedLanguage = (typeof supportedLngs)[number];

export const resources = {
  en: { translation: en },
  km: { translation: km },
} as const;

export const LANGUAGE_STORAGE_KEY = "rfh-language";
