"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function Auth() {
  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      if (user) {
        if (!user.data.user) return;

        supabase.from("users").upsert({
          id: user.data.user.id,
          email: user.data.user.email,
          username: user.data.user.user_metadata.full_name,
        });

        window.location.href = "/dashboard";
      }
    });
  }, []);

  return (
    <div className="flex h-screen justify-center items-center">
      <h1 className="text-black text-2xl font-bold">
        You will be redirected shortly... 👀
      </h1>
    </div>
  );
}
