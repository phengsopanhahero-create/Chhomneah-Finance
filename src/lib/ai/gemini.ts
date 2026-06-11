import type { ChatDataSource, ChatLanguage } from "@/lib/chatbot/responder";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildSystemPrompt(data: ChatDataSource, lang: ChatLanguage): string {
  const loanSummary = data.loanProducts
    .map(
      (p) =>
        `- ${p.provider_name} (${p.product_name}): ${p.interest_rate_min}-${p.interest_rate_max}% / year, ` +
        `${p.term_min_months}-${p.term_max_months} months, $${p.min_amount}-$${p.max_amount}`
    )
    .join("\n");

  const locationSummary = data.serviceLocations
    .map((l) => `- ${l.name} (${l.service_type}): ${l.address}`)
    .join("\n");

  const educationSummary = data.educationTopics
    .map((t) => `- ${t.title_en}: ${t.summary_en}`)
    .join("\n");

  const languageInstruction =
    lang === "km"
      ? "The user is writing in Khmer. Reply in Khmer (with simple, friendly wording)."
      : "The user is writing in English. Reply in English.";

  return (
    "You are a friendly financial literacy assistant for the 'Rural Finance Hub Cambodia' app, " +
    "helping rural Cambodians understand loans, savings, and digital payments.\n\n" +
    "Use the following reference data when relevant, but you may also answer general " +
    "financial-literacy questions that aren't directly covered by it:\n\n" +
    `Loan products:\n${loanSummary}\n\n` +
    `Service locations:\n${locationSummary}\n\n` +
    `Education topics:\n${educationSummary}\n\n` +
    "Keep answers short (2-5 sentences), practical, and easy to understand for someone with " +
    "limited financial background. Do not give specific legal, tax, or investment advice; " +
    "recommend the user visit a bank or MFI branch for account-specific help.\n\n" +
    languageInstruction
  );
}

/**
 * Calls the Gemini API to generate a free-form chat response.
 * Returns null if the API key is missing or the request fails, so callers
 * can fall back to the rule-based responder.
 */
export async function generateAiResponse(
  message: string,
  data: ChatDataSource,
  lang: ChatLanguage
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt(data, lang) }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 400,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      return null;
    }

    const json = await response.json();
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.trim() || null;
  } catch (err) {
    console.error("Gemini API request failed:", err);
    return null;
  }
}
