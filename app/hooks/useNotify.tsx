"use client";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function useNotify() {
  const markAsRead = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
  };

  const create = async (text: string, userId: string) => {
    await supabase.from("notifications").insert({
      text: text,
      owner: userId,
      created_at: new Date().toISOString(),
    });
  };

  return { markAsRead, create };
}
