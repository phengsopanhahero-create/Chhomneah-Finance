import { calculateMonthlyPayment, formatCurrencyUSD } from "@/lib/finance";
import { generateAiResponse } from "@/lib/ai/gemini";
import { FALLBACK_LOAN_PRODUCTS } from "@/lib/data/loanProducts";
import { FALLBACK_SERVICE_LOCATIONS } from "@/lib/data/serviceLocations";
import { FALLBACK_EDUCATION_TOPICS } from "@/lib/data/education";
import type {
  EducationTopicRow,
  LoanProductRow,
  ServiceLocationRow,
} from "@/types/database";

export type ChatLanguage = "km" | "en";

export interface ChatDataSource {
  loanProducts: LoanProductRow[];
  serviceLocations: ServiceLocationRow[];
  educationTopics: EducationTopicRow[];
}

export const DEFAULT_DATA_SOURCE: ChatDataSource = {
  loanProducts: FALLBACK_LOAN_PRODUCTS,
  serviceLocations: FALLBACK_SERVICE_LOCATIONS,
  educationTopics: FALLBACK_EDUCATION_TOPICS,
};

const PROVIDER_KEYWORDS: Record<string, string[]> = {
  "ACLEDA Bank": ["acleda"],
  "ABA Bank": ["aba"],
  "Wing Bank": ["wing"],
  "AMK Microfinance": ["amk"],
  "PRASAC MFI": ["prasac"],
  "Sathapana Bank": ["sathapana"],
  TrueMoney: ["truemoney", "true money"],
};

const SERVICE_TYPE_KEYWORDS: Record<ServiceLocationRow["service_type"], string[]> = {
  bank: ["bank", "ធនាគារ"],
  mfi: ["mfi", "microfinance", "មីក្រូហិរញ្ញវត្ថុ"],
  wing: ["wing"],
  truemoney: ["truemoney", "true money"],
  digital_wallet: ["digital wallet", "mobile money", "កាបូបឌីជីថល"],
  insurance: ["insurance", "ធានារ៉ាប់រង"],
};

const EDUCATION_KEYWORDS: Record<string, string[]> = {
  "interest-rates": ["interest", "rate", "ការប្រាក់", "អត្រា"],
  "loan-risks": ["risk", "borrow", "ហានិភ័យ", "ខ្ចី"],
  savings: ["saving", "save", "សន្សំ"],
  "digital-payments": ["wing", "truemoney", "mobile money", "digital payment", "ទូទាត់", "លុយចល័ត"],
};

function detectLanguage(text: string): ChatLanguage {
  return /[ក-៿]/.test(text) ? "km" : "en";
}

function includesAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function formatLoanProduct(product: LoanProductRow, lang: ChatLanguage): string {
  const name = lang === "km" && product.product_name_km
    ? product.product_name_km
    : product.product_name;

  const sampleAmount = Math.min(Math.max(product.min_amount, 500), product.max_amount);
  const payment = calculateMonthlyPayment(
    sampleAmount,
    product.interest_rate_max,
    product.term_max_months
  );

  if (lang === "km") {
    return (
      `🏦 ${product.provider_name} — ${name}\n` +
      `• អត្រាការប្រាក់: ${product.interest_rate_min}–${product.interest_rate_max}% / ឆ្នាំ\n` +
      `• រយៈពេល: ${product.term_min_months}–${product.term_max_months} ខែ\n` +
      `• ចំនួនទឹកប្រាក់: ${formatCurrencyUSD(product.min_amount)} – ${formatCurrencyUSD(product.max_amount)}\n` +
      `• ការបង់ប្រចាំខែប៉ាន់ស្មាន (${formatCurrencyUSD(sampleAmount)}, ${product.term_max_months} ខែ): ${formatCurrencyUSD(payment)}`
    );
  }

  return (
    `🏦 ${product.provider_name} — ${name}\n` +
    `• Interest rate: ${product.interest_rate_min}–${product.interest_rate_max}% / year\n` +
    `• Term: ${product.term_min_months}–${product.term_max_months} months\n` +
    `• Amount range: ${formatCurrencyUSD(product.min_amount)} – ${formatCurrencyUSD(product.max_amount)}\n` +
    `• Est. monthly payment (${formatCurrencyUSD(sampleAmount)}, ${product.term_max_months} mo): ${formatCurrencyUSD(payment)}`
  );
}

function formatServiceLocation(location: ServiceLocationRow, lang: ChatLanguage): string {
  const name = lang === "km" && location.name_km ? location.name_km : location.name;
  const address = lang === "km" && location.address_km ? location.address_km : location.address;

  if (lang === "km") {
    return (
      `📍 ${name}\n` +
      `• អាសយដ្ឋាន: ${address}\n` +
      (location.hours ? `• ម៉ោងបើក: ${location.hours}\n` : "") +
      (location.phone ? `• ទូរស័ព្ទ: ${location.phone}` : "")
    );
  }

  return (
    `📍 ${name}\n` +
    `• Address: ${address}\n` +
    (location.hours ? `• Hours: ${location.hours}\n` : "") +
    (location.phone ? `• Phone: ${location.phone}` : "")
  );
}

function formatEducationTopic(topic: EducationTopicRow, lang: ChatLanguage): string {
  const title = lang === "km" ? topic.title_km : topic.title_en;
  const summary = lang === "km" ? topic.summary_km : topic.summary_en;
  const content = lang === "km" ? topic.content_km : topic.content_en;

  return `📘 ${title}\n${summary}\n\n${content}`;
}

function welcomeMessage(lang: ChatLanguage): string {
  if (lang === "km") {
    return (
      "សួស្តី! ខ្ញុំជាជំនួយការ ហាបហ្វាយណែនស៍ហិរញ្ញវត្ថុជនបទកម្ពុជា។\n\n" +
      "អ្នកអាចសួរខ្ញុំអំពី៖\n" +
      "• កម្ចីពីធនាគារ ឬ MFI (ឧ. \"អត្រាការប្រាក់ ACLEDA\")\n" +
      "• សេវាកម្មនៅជិតអ្នក (ឧ. \"ភ្នាក់ងារ Wing នៅឯណា\")\n" +
      "• គន្លឹះហិរញ្ញវត្ថុ (ឧ. \"អត្រាការប្រាក់\", \"ការសន្សំ\")\n\n" +
      "សូមវាយសំណួររបស់អ្នក!"
    );
  }

  return (
    "Hello! I'm the Rural Finance Hub Cambodia assistant.\n\n" +
    "You can ask me about:\n" +
    "• Loans from banks or MFIs (e.g. \"ACLEDA interest rate\")\n" +
    "• Nearby services (e.g. \"where is a Wing agent\")\n" +
    "• Financial tips (e.g. \"interest rates\", \"savings\")\n\n" +
    "Type your question to get started!"
  );
}

function fallbackMessage(lang: ChatLanguage): string {
  if (lang === "km") {
    return (
      "សូមទោស ខ្ញុំមិនយល់សំណួររបស់អ្នកទេ។ សូមសាកល្បងសួរអំពីកម្ចី (ឧ. \"ABA\"), " +
      "សេវាកម្ម (ឧ. \"ធនាគារ\", \"Wing\"), ឬប្រធានបទអប់រំ (ឧ. \"ការសន្សំ\")។"
    );
  }

  return (
    "Sorry, I didn't understand that. Try asking about a loan provider (e.g. \"ABA\"), " +
    "a service type (e.g. \"bank\", \"Wing\"), or an education topic (e.g. \"savings\")."
  );
}

/**
 * Rule-based chatbot reply for a given user message, or null if no rule matches.
 * Pure function so it can be reused by the Telegram webhook and any API route.
 */
export function matchRuleBasedResponse(
  message: string,
  data: ChatDataSource = DEFAULT_DATA_SOURCE
): string | null {
  const trimmed = message.trim();
  const lang = detectLanguage(trimmed);

  if (/^(start|help|hi|hello|សួស្តី|ជំនួយ)$/i.test(trimmed)) {
    return welcomeMessage(lang);
  }

  // 1. Loan provider match
  for (const [providerName, keywords] of Object.entries(PROVIDER_KEYWORDS)) {
    if (includesAny(trimmed, keywords)) {
      const products = data.loanProducts.filter(
        (p) => p.provider_name === providerName
      );
      if (products.length > 0) {
        const header =
          lang === "km"
            ? `លទ្ធផលកម្ចីសម្រាប់ ${providerName}:\n\n`
            : `Loan products for ${providerName}:\n\n`;
        return (
          header +
          products.map((p) => formatLoanProduct(p, lang)).join("\n\n")
        );
      }
    }
  }

  // 2. Loan / general keyword match
  if (includesAny(trimmed, ["loan", "interest rate", "កម្ចី", "ការប្រាក់"])) {
    const top = data.loanProducts.slice(0, 3);
    const header =
      lang === "km"
        ? "នេះជាផលិតផលកម្ចីពេញនិយមមួយចំនួន:\n\n"
        : "Here are some popular loan products:\n\n";
    return header + top.map((p) => formatLoanProduct(p, lang)).join("\n\n");
  }

  // 3. Service type match
  for (const [serviceType, keywords] of Object.entries(SERVICE_TYPE_KEYWORDS) as [
    ServiceLocationRow["service_type"],
    string[]
  ][]) {
    if (includesAny(trimmed, keywords)) {
      const locations = data.serviceLocations
        .filter((l) => l.service_type === serviceType)
        .slice(0, 3);
      if (locations.length > 0) {
        const header =
          lang === "km"
            ? "នេះជាសេវាកម្មដែលអ្នកកំពុងស្វែងរក:\n\n"
            : "Here are matching services:\n\n";
        return (
          header +
          locations.map((l) => formatServiceLocation(l, lang)).join("\n\n")
        );
      }
    }
  }

  // 4. "near me" / general service keyword
  if (includesAny(trimmed, ["near", "agent", "branch", "office", "ជិត", "សេវា", "ភ្នាក់ងារ", "សាខា"])) {
    const locations = data.serviceLocations.slice(0, 3);
    const header =
      lang === "km"
        ? "នេះជាសេវាកម្មហិរញ្ញវត្ថុមួយចំនួន:\n\n"
        : "Here are some financial services:\n\n";
    return header + locations.map((l) => formatServiceLocation(l, lang)).join("\n\n");
  }

  // 5. Education topic match
  for (const [slug, keywords] of Object.entries(EDUCATION_KEYWORDS)) {
    if (includesAny(trimmed, keywords)) {
      const topic = data.educationTopics.find((t) => t.slug === slug);
      if (topic) {
        return formatEducationTopic(topic, lang);
      }
    }
  }

  return null;
}

/**
 * Generate a chatbot reply for a given user message.
 * Tries fast rule-based matching first, then falls back to the AI model
 * (Gemini) for free-form questions, and finally a static fallback message.
 */
export async function generateChatResponse(
  message: string,
  data: ChatDataSource = DEFAULT_DATA_SOURCE
): Promise<string> {
  const trimmed = message.trim();
  const lang = detectLanguage(trimmed);

  const ruleBasedReply = matchRuleBasedResponse(trimmed, data);
  if (ruleBasedReply) return ruleBasedReply;

  const aiReply = await generateAiResponse(trimmed, data, lang);
  if (aiReply) return aiReply;

  return fallbackMessage(lang);
}
