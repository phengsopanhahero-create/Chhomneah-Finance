/**
 * Maps a loan product's provider_name to a downloaded logo file in
 * public/logos/ (see scripts/scrape-logos.ts). Providers without a
 * downloaded logo are omitted, so the UI can hide the badge entirely.
 */
export const PROVIDER_LOGOS: Record<string, string> = {
  "ABA Bank": "/logos/aba-bank.png",
  "ACLEDA Bank": "/logos/acleda-bank.png",
  "Canadia Bank": "/logos/canadia-bank.png",
  "Cambodia Public Bank (CAMPU)": "/logos/cambodia-public-bank.jpg",
  "Vattanac Bank": "/logos/vattanac-bank.jpg",
  "Phillip Bank": "/logos/phillip-bank.svg",
  "Chip Mong Commercial Bank": "/logos/chip-mong-bank.png",
  "RHB Bank Cambodia": "/logos/rhb-bank.webp",
  "Foreign Trade Bank of Cambodia (FTB)": "/logos/foreign-trade-bank.jpg",
  "AMK Microfinance": "/logos/amk-microfinance.svg",
  "Hattha Bank": "/logos/hattha-bank.png",
  "LOLC (Cambodia)": "/logos/lolc-cambodia.png",
  "First Finance": "/logos/first-finance.webp",
  "AMRET Microfinance": "/logos/amret.png",
  "Pi Pay": "/logos/pi-pay.webp",
  "Forte Insurance": "/logos/forte-insurance.png",
  "Manulife Cambodia": "/logos/manulife-cambodia.svg",
  "Prudential Cambodia": "/logos/prudential-cambodia.png",
};

export function getProviderLogo(providerName: string): string | null {
  return PROVIDER_LOGOS[providerName] ?? null;
}
