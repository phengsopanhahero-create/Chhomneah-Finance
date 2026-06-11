import { NextRequest, NextResponse } from "next/server";

import { generateChatResponse, DEFAULT_DATA_SOURCE, type ChatDataSource } from "@/lib/chatbot/responder";
import { createServiceClient } from "@/lib/supabase/server";
import { FALLBACK_LOAN_PRODUCTS } from "@/lib/data/loanProducts";
import { FALLBACK_SERVICE_LOCATIONS } from "@/lib/data/serviceLocations";
import { FALLBACK_EDUCATION_TOPICS } from "@/lib/data/education";

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

/**
 * In-app chat endpoint, e.g. for a chat widget inside the Telegram Mini App.
 * POST { message: string } -> { reply: string }
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const message = body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Missing 'message' field" }, { status: 400 });
  }

  const data = await loadDataSource();
  const reply = await generateChatResponse(message, data);

  return NextResponse.json({ reply });
}
