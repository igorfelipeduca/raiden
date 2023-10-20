import { User, createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Category } from "../components/CategoryBox";
import { SetStateAction } from "react";
import { Toast } from "../contexts/toastContext";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export const welcomeUser = async (
  targetUser: User,
  welcomed: boolean,
  setCategories: React.Dispatch<SetStateAction<Category[]>>,
  setWelcomed: React.Dispatch<SetStateAction<boolean>>,
  setToasts: React.Dispatch<SetStateAction<Toast[]>>
) => {
  if (welcomed) return;

  const existentWorkspaces = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner", targetUser?.id)
    .eq("name", "Personal");

  const existentCategories = await supabase
    .from("categories")
    .select("*")
    .eq("owner", targetUser?.id)
    .eq("name", "General");

  const existentToasts = await supabase
    .from("toasts")
    .select("*")
    .eq("owner", targetUser?.id)
    .eq("text", "Hello, world!");

  if (
    existentCategories.data?.length ||
    existentToasts.data?.length ||
    existentWorkspaces.data?.length
  )
    return;

  const createdWorkspace = await supabase
    .from("workspaces")
    .insert({
      name: "Personal",
      owner: targetUser?.id,
      tier: "free",
    })
    .select("*");

  if (!createdWorkspace.data) return;

  const createdCategory = await supabase
    .from("categories")
    .upsert({
      owner: targetUser?.id,
      name: "General",
      workspace_id: createdWorkspace.data?.[0].id,
    })
    .select("*");

  const createdToast = await supabase
    .from("toasts")
    .insert({
      text: "Hello, world!",
      emoji: "👋",
      type: "success",
      category_id: createdCategory.data?.[0].id,
      owner: targetUser?.id,
    })
    .select("*");

  if (createdToast.data) {
    toast.success("Welcome to Raiden! 🎉");

    if (!createdCategory.data || !createdToast.data) return;

    const newCategory = await supabase
      .from("categories")
      .select("*")
      .eq("id", createdCategory.data[0].id)
      .single();

    if (!newCategory.data) return;
    setCategories((categories) => [...categories, newCategory.data]);

    const newToast = await supabase
      .from("toasts")
      .select("*")
      .eq("id", createdToast.data[0].id)
      .single();

    if (!newToast.data) return;
    setToasts((toasts) => [...toasts, newToast.data]);

    setWelcomed(true);
  }

  return {
    createdWorkspace,
    createdCategory,
    createdToast,
  };
};
