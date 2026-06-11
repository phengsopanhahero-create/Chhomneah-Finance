"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/loans", key: "nav.loans" },
  { href: "/finder", key: "nav.finder" },
  { href: "/education", key: "nav.education" },
  { href: "/chatbot", key: "nav.chatbot" },
] as const;

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="khmer-border-motif" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
            <Image
              src="/logos/image_mylogo.png"
              alt={t("app.name")}
              fill
              className="object-contain"
            />
          </span>
          <span className="text-base font-extrabold leading-tight text-primary lang-km sm:text-lg">
            {t("app.name")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary/20"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            className="rounded-md p-2 text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-secondary bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3 text-base font-semibold transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary/20"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
      )}

      <div className="khmer-border-motif-thin" />
    </header>
  );
}
