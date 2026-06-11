"use client";

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 bg-primary text-primary-foreground">
      <div className="khmer-border-motif" />
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="lang-km text-base font-bold">{t("app.name")}</p>
        <p className="mt-2 max-w-2xl text-primary-foreground/80">
          {t("footer.about_text")}
        </p>
        <p className="mt-4 text-primary-foreground/70">
          &copy; {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
