import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Falls back to a placeholder URL when not configured, so the client can be
// constructed during build/prerender. Calls will fail gracefully and callers
// fall back to static data (see src/lib/hooks/*).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
