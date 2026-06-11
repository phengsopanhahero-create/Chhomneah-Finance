/**
 * Rural Finance Hub Cambodia - Telegram Bot
 *
 * Run with: npm run bot
 *
 * Requires TELEGRAM_BOT_TOKEN, and optionally NEXT_PUBLIC_SUPABASE_URL +
 * NEXT_PUBLIC_SUPABASE_ANON_KEY for live data (falls back to static data
 * bundled in src/lib/data when Supabase is not configured).
 */
import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { createClient } from "@supabase/supabase-js";

import { generateChatResponse, DEFAULT_DATA_SOURCE, type ChatDataSource } from "../src/lib/chatbot/responder";
import { FALLBACK_LOAN_PRODUCTS } from "../src/lib/data/loanProducts";
import { FALLBACK_SERVICE_LOCATIONS } from "../src/lib/data/serviceLocations";
import { FALLBACK_EDUCATION_TOPICS } from "../src/lib/data/education";
import type { Database } from "../src/types/database";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is not set. Please add it to your .env file.");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

let cachedData: ChatDataSource = DEFAULT_DATA_SOURCE;
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function loadData(): Promise<ChatDataSource> {
  const now = Date.now();
  if (now - cacheLoadedAt < CACHE_TTL_MS) {
    return cachedData;
  }

  if (!supabase) {
    cachedData = DEFAULT_DATA_SOURCE;
    cacheLoadedAt = now;
    return cachedData;
  }

  try {
    const [loansRes, locationsRes, topicsRes] = await Promise.all([
      supabase.from("loan_products").select("*"),
      supabase.from("service_locations").select("*"),
      supabase.from("education_topics").select("*").order("sort_order"),
    ]);

    cachedData = {
      loanProducts:
        loansRes.data && loansRes.data.length > 0
          ? loansRes.data
          : FALLBACK_LOAN_PRODUCTS,
      serviceLocations:
        locationsRes.data && locationsRes.data.length > 0
          ? locationsRes.data
          : FALLBACK_SERVICE_LOCATIONS,
      educationTopics:
        topicsRes.data && topicsRes.data.length > 0
          ? topicsRes.data
          : FALLBACK_EDUCATION_TOPICS,
    };
    cacheLoadedAt = now;
  } catch (err) {
    console.error("Failed to load data from Supabase, using fallback data:", err);
    cachedData = DEFAULT_DATA_SOURCE;
    cacheLoadedAt = now;
  }

  return cachedData;
}

const bot = new TelegramBot(token, { polling: true });

console.log("Rural Finance Hub Cambodia Telegram bot is running...");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const data = await loadData();
    const reply = generateChatResponse(text, data);
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error("Error handling message:", err);
    await bot.sendMessage(
      chatId,
      "Sorry, something went wrong. Please try again later. / សូមអភ័យទោស មានបញ្ហាបច្ចេកទេស សូមព្យាយាមម្តងទៀត។"
    );
  }
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});
