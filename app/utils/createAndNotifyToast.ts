import { createClient } from "@supabase/supabase-js";

export interface Payload {
  category_id: string;
  text: string;
  emoji?: string;
  workspace: string;
  type?: string;
}

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export const createAndNotifyToast = async (payload: Payload) => {
  payload.type = payload.type ?? "api";

  const createdToast = await supabase.from("toasts").insert(payload);

  const targetCategory = await supabase
    .from("categories")
    .select("*")
    .eq("id", payload.category_id);

  if (!targetCategory.data?.length) throw new Error("Category not found");

  const categoryOwner = await supabase
    .from("users")
    .select("*")
    .eq("id", targetCategory.data[0].owner);

  if (!categoryOwner.data?.length) throw new Error("Category owner not found");

  const createdNotification = await supabase.from("notifications").insert({
    text: `New event in ${targetCategory.data[0].name}: ${payload.text}`,
    owner: categoryOwner.data[0].id,
  });

  return { createdToast, createdNotification };
};
