import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. interactions will fail.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
