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

  const targetCategory = await supabase
    .from("categories")
    .select("*")
    .eq("id", payload.category_id);

  console.log({ targetCategory });

  if (!targetCategory.data?.length) throw new Error("Category not found");

  console.log({ targetCategory: targetCategory.data[0] });

  const categoryOwner = await supabase
    .from("users")
    .select("*")
    .eq("id", targetCategory.data[0].owner);

  console.log({ categoryOwner: categoryOwner.data });

  if (!categoryOwner.data?.length) throw new Error("Category owner not found");

  const createdToast = await supabase
    .from("toasts")
    .insert({ ...payload, owner: categoryOwner.data[0].id })
    .select("*");

  const createdNotification = await supabase
    .from("notifications")
    .insert({
      text: `New event in ${targetCategory.data[0].name}: ${payload.text}`,
      owner: categoryOwner.data[0].id,
    })
    .select("*");

  console.log({
    createdToast: createdToast.data,
    createdNotification: createdNotification.data,
  });

  return { createdToast, createdNotification };
};
