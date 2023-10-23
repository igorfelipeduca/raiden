import {
  Payload,
  createAndNotifyToast,
} from "@/app/utils/createAndNotifyToast";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export async function POST(req: NextRequest, res: NextResponse) {
  const body = (await req.json()) as Payload;

  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return new Response("No API key provided", { status: 401 });
  }

  const databaseKey = await supabase.from("keys").select("*").eq("key", apiKey);

  const isApiKeyValid = databaseKey.data?.length;

  if (!isApiKeyValid) {
    return new Response("Invalid API key", { status: 401 });
  }

  console.log({ body });

  const { createdToast, createdNotification } = await createAndNotifyToast(
    body
  );

  return new Response(JSON.stringify({ createdToast, createdNotification }), {
    status: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
