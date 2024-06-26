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

interface KeyValidationPayload {
  apiKey: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body = (await req.json()) as KeyValidationPayload;

  const { apiKey } = body;

  const databaseKey = await supabase.from("keys").select("*").eq("key", apiKey);

  const isApiKeyValid = databaseKey.data?.length;

  if (!isApiKeyValid) {
    return new Response("Invalid API key", { status: 401 });
  }

  return NextResponse.json({ message: "Valid API Key" }, { status: 200 });
}
