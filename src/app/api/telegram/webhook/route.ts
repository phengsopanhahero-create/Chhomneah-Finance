import { NextRequest, NextResponse } from "next/server";

import { generateChatResponse, DEFAULT_DATA_SOURCE, type ChatDataSource } from "@/lib/chatbot/responder";
import { createServiceClient } from "@/lib/supabase/server";
import { FALLBACK_LOAN_PRODUCTS } from "@/lib/data/loanProducts";
import { FALLBACK_SERVICE_LOCATIONS } from "@/lib/data/serviceLocations";
import { FALLBACK_EDUCATION_TOPICS } from "@/lib/data/education";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
}

async function loadDataSource(): Promise<ChatDataSource> {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabase) return DEFAULT_DATA_SOURCE;

  try {
    const supabase = createServiceClient();
    const [loansRes, locationsRes, topicsRes] = await Promise.all([
      supabase.from("loan_products").select("*"),
      supabase.from("service_locations").select("*"),
      supabase.from("education_topics").select("*").order("sort_order"),
    ]);

    return {
      loanProducts:
        loansRes.data && loansRes.data.length > 0 ? loansRes.data : FALLBACK_LOAN_PRODUCTS,
      serviceLocations:
        locationsRes.data && locationsRes.data.length > 0
          ? locationsRes.data
          : FALLBACK_SERVICE_LOCATIONS,
      educationTopics:
        topicsRes.data && topicsRes.data.length > 0
          ? topicsRes.data
          : FALLBACK_EDUCATION_TOPICS,
    };
  } catch (err) {
    console.error("Failed to load data from Supabase, using fallback data:", err);
    return DEFAULT_DATA_SOURCE;
  }
}

async function sendMessage(chatId: number, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

/**
 * Telegram webhook endpoint. Configure with:
 * https://api.telegram.org/bot<TOKEN>/setWebhook?url=<your-domain>/api/telegram/webhook
 */
export async function POST(request: NextRequest) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 });
  }

  // Optional shared-secret check, set via setWebhook's secret_token param.
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update: TelegramUpdate = await request.json();
  const message = update.message;

  if (!message?.text) {
    return NextResponse.json({ ok: true });
  }

  try {
    const data = await loadDataSource();
    const reply = await generateChatResponse(message.text, data);
    await sendMessage(message.chat.id, reply);
  } catch (err) {
    console.error("Error handling Telegram update:", err);
    await sendMessage(
      message.chat.id,
      "Sorry, something went wrong. Please try again later. / សូមអភ័យទោស មានបញ្ហាបច្ចេកទេស សូមព្យាយាមម្តងទៀត។"
    );
  }

  return NextResponse.json({ ok: true });
}
