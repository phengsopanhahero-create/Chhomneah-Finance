"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-full border-2 border-secondary bg-white p-1 text-sm font-bold">
      <button
        type="button"
        onClick={() => setLanguage("km")}
        aria-pressed={language === "km"}
        className={cn(
          "rounded-full px-3 py-1 transition-colors lang-km",
          language === "km"
            ? "bg-primary text-primary-foreground"
            : "text-primary/70 hover:text-primary"
        )}
      >
        ខ្មែរ
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={cn(
          "rounded-full px-3 py-1 transition-colors",
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-primary/70 hover:text-primary"
        )}
      >
        EN
      </button>
    </div>
  );
}
