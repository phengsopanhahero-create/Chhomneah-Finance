/**
 * Registry of financial institutions operating in Cambodia.
 *
 * This is reference/seed data used to drive the scraper scripts
 * (scripts/scrape-locations.ts and scripts/scrape-loan-products.ts).
 * It intentionally does NOT include branch addresses or loan rates -
 * those are fetched live from Google Places and official websites.
 */

export type InstitutionType = "bank" | "mfi" | "digital_wallet" | "insurance";

export interface Institution {
  /** Stable slug, used as a key when matching scraped results back to this entry. */
  slug: string;
  name: string;
  name_km: string;
  type: InstitutionType;
  /** Official website, used as the seed URL for product/rate scraping. */
  website: string;
  /** Search query used against the Google Places API to find branches/agents. */
  placesQuery: string;
  hotline?: string;
}

export const INSTITUTIONS: Institution[] = [
  // ---- Commercial Banks ----
  {
    slug: "acleda-bank",
    name: "ACLEDA Bank",
    name_km: "ធនាគារ ឯស៊ីលីដា",
    type: "bank",
    website: "https://www.acledabank.com.kh",
    placesQuery: "ACLEDA Bank branch Cambodia",
    hotline: "023 998 777",
  },
  {
    slug: "aba-bank",
    name: "ABA Bank",
    name_km: "ធនាគារ ABA",
    type: "bank",
    website: "https://www.ababank.com",
    placesQuery: "ABA Bank branch Cambodia",
    hotline: "023 225 333",
  },
  {
    slug: "canadia-bank",
    name: "Canadia Bank",
    name_km: "ធនាគារ កាណាឌីយ៉ា",
    type: "bank",
    website: "https://www.canadiabank.com.kh",
    placesQuery: "Canadia Bank branch Cambodia",
    hotline: "023 868 222",
  },
  {
    slug: "cambodia-public-bank",
    name: "Cambodia Public Bank (CAMPU)",
    name_km: "ធនាគារ ភឹប្លិក នៃកម្ពុជា",
    type: "bank",
    website: "https://www.campubank.com.kh",
    placesQuery: "Cambodia Public Bank CAMPU branch",
    hotline: "023 426 388",
  },
  {
    slug: "vattanac-bank",
    name: "Vattanac Bank",
    name_km: "ធនាគារ វឌ្ឍនៈ",
    type: "bank",
    website: "https://www.vattanacbank.com",
    placesQuery: "Vattanac Bank branch Cambodia",
    hotline: "023 999 100",
  },
  {
    slug: "phillip-bank",
    name: "Phillip Bank",
    name_km: "ធនាគារ ហ្វីលីព",
    type: "bank",
    website: "https://www.phillipbank.com.kh",
    placesQuery: "Phillip Bank branch Cambodia",
    hotline: "023 999 000",
  },
  {
    slug: "prince-bank",
    name: "Prince Bank",
    name_km: "ធនាគារ ព្រីនស៍",
    type: "bank",
    website: "https://www.princebank.com.kh",
    placesQuery: "Prince Bank branch Cambodia",
    hotline: "023 999 555",
  },
  {
    slug: "chip-mong-bank",
    name: "Chip Mong Commercial Bank",
    name_km: "ធនាគារពាណិជ្ជ ឈិបម៉ុង",
    type: "bank",
    website: "https://www.chipmongbank.com",
    placesQuery: "Chip Mong Bank branch Cambodia",
  },
  {
    slug: "rhb-bank",
    name: "RHB Bank Cambodia",
    name_km: "ធនាគារ RHB",
    type: "bank",
    website: "https://www.rhbgroup.com.kh",
    placesQuery: "RHB Bank Cambodia branch",
  },
  {
    slug: "foreign-trade-bank",
    name: "Foreign Trade Bank of Cambodia (FTB)",
    name_km: "ធនាគារពាណិជ្ជកម្មក្រៅប្រទេស នៃកម្ពុជា",
    type: "bank",
    website: "https://www.ftbbank.com",
    placesQuery: "Foreign Trade Bank FTB Cambodia branch",
  },

  // ---- Microfinance Institutions (MFI) ----
  {
    slug: "amk-microfinance",
    name: "AMK Microfinance",
    name_km: "គ្រឹះស្ថានមីក្រូហិរញ្ញវត្ថុ អេធម្គេ",
    type: "mfi",
    website: "https://www.amkbank.com.kh",
    placesQuery: "AMK Microfinance office Cambodia",
    hotline: "053 952 555",
  },
  {
    slug: "prasac-mfi",
    name: "PRASAC Microfinance",
    name_km: "គ្រឹះស្ថានមីក្រូហិរញ្ញវត្ថុ ប្រាសាក់",
    type: "mfi",
    website: "https://www.prasac.com.kh",
    placesQuery: "PRASAC Microfinance branch Cambodia",
    hotline: "023 999 911",
  },
  {
    slug: "hattha-bank",
    name: "Hattha Bank (formerly Hattha Kaksekar Limited)",
    name_km: "ធនាគារ ហត្ថា",
    type: "mfi",
    website: "https://www.hatthabank.com",
    placesQuery: "Hattha Bank branch Cambodia",
  },
  {
    slug: "lolc-cambodia",
    name: "LOLC (Cambodia)",
    name_km: "អិលអូអិលស៊ី ខេមបូឌា",
    type: "mfi",
    website: "https://www.lolc.com.kh",
    placesQuery: "LOLC Cambodia branch",
  },
  {
    slug: "sathapana-bank",
    name: "Sathapana Bank",
    name_km: "ធនាគារ សថាបនា",
    type: "mfi",
    website: "https://www.sathapana.com.kh",
    placesQuery: "Sathapana Bank branch Cambodia",
    hotline: "062 961 222",
  },
  {
    slug: "first-finance",
    name: "First Finance",
    name_km: "ហ្វឹស ហ្វាយនែន",
    type: "mfi",
    website: "https://www.firstfinance.com.kh",
    placesQuery: "First Finance Cambodia branch",
  },
  {
    slug: "amret",
    name: "AMRET Microfinance",
    name_km: "គ្រឹះស្ថានមីក្រូហិរញ្ញវត្ថុ អំរិត",
    type: "mfi",
    website: "https://www.amret.com.kh",
    placesQuery: "AMRET Microfinance branch Cambodia",
  },
  {
    slug: "kredit-mfi",
    name: "KREDIT Microfinance Institution",
    name_km: "គ្រឹះស្ថានមីក្រូហិរញ្ញវត្ថុ ក្រេឌីត",
    type: "mfi",
    website: "https://www.kredit.com.kh",
    placesQuery: "KREDIT Microfinance Cambodia branch",
  },

  // ---- Digital Wallets / Mobile Money ----
  {
    slug: "wing-bank",
    name: "Wing Bank",
    name_km: "វីង ប៊ែង",
    type: "digital_wallet",
    website: "https://www.wingbank.com.kh",
    placesQuery: "Wing Bank agent Cambodia",
    hotline: "1554",
  },
  {
    slug: "truemoney",
    name: "TrueMoney Cambodia",
    name_km: "ទ្រូម៉ាន់នី",
    type: "digital_wallet",
    website: "https://truemoney.com.kh",
    placesQuery: "TrueMoney agent Cambodia",
    hotline: "1800 18 1212",
  },
  {
    slug: "pi-pay",
    name: "Pi Pay",
    name_km: "ផៃប៉េ",
    type: "digital_wallet",
    website: "https://www.pipay.com",
    placesQuery: "Pi Pay agent Cambodia",
  },
  {
    slug: "emoney-cambodia",
    name: "eMoney (E-Money Cambodia)",
    name_km: "អុីម៉ាន់និ",
    type: "digital_wallet",
    website: "https://www.emoney.com.kh",
    placesQuery: "eMoney Cambodia agent",
  },
  {
    slug: "bakong",
    name: "Bakong (National Bank of Cambodia)",
    name_km: "បាគង",
    type: "digital_wallet",
    website: "https://bakong.nbc.org.kh",
    placesQuery: "Bakong wallet agent Cambodia",
  },

  // ---- Insurance ----
  {
    slug: "forte-insurance",
    name: "Forte Insurance",
    name_km: "ហ្វតេ អ៊ីនសួរេន",
    type: "insurance",
    website: "https://www.forteinsurance.com",
    placesQuery: "Forte Insurance branch Cambodia",
  },
  {
    slug: "manulife-cambodia",
    name: "Manulife Cambodia",
    name_km: "ម៉ានូឡាយហ្វ៍ ខេមបូឌា",
    type: "insurance",
    website: "https://www.manulife.com.kh",
    placesQuery: "Manulife Cambodia branch",
  },
  {
    slug: "prudential-cambodia",
    name: "Prudential Cambodia",
    name_km: "ប្រូដិន់សល កម្ពុជា",
    type: "insurance",
    website: "https://www.prudential.com.kh",
    placesQuery: "Prudential Cambodia branch",
  },
  {
    slug: "infinity-insurance",
    name: "Infinity General Insurance",
    name_km: "អុិនហ្វីនីធី ប្រូព័រធី",
    type: "insurance",
    website: "https://www.infinitygeneralinsurance.com",
    placesQuery: "Infinity General Insurance Cambodia branch",
  },
];

export function getInstitutionsByType(type: InstitutionType): Institution[] {
  return INSTITUTIONS.filter((i) => i.type === type);
}
