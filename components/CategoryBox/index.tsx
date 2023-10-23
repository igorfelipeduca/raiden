import React, { SetStateAction, useEffect, useState } from "react";
import { Toast } from "../../app/contexts/toastContext";
import { parseTimestamp } from "../../app/utils/parseTimestamp";
import EventToast from "../EventTrigger";
import { User, createClient } from "@supabase/supabase-js";
import TriggerEvent from "../../app/dashboard/[id]/components/triggerEvent";
import { Check, Trash2, ZapIcon } from "lucide-react";
import useNotify from "../../app/hooks/useNotify";
import { toast } from "sonner";
import IntegrateCategory from "./components/IntegrateCategory";

export interface Category {
  id: string;
  name: string;
  owner: string;
  workspace_id: string;
}

interface CategoryBoxProps {
  category: Category;
  categories: Category[];
  setCategories: React.Dispatch<SetStateAction<Category[]>>;
}

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function CategoryBox({
  category,
  categories,
  setCategories,
}: CategoryBoxProps) {
  const [user, setUser] = useState<User>();
  const { create } = useNotify();
  const [isCategoryChanged, setIsCategoryChanged] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then((dataUser) => {
      if (dataUser.data.user) setUser(dataUser.data.user);

      supabase
        .from("toasts")
        .select("*")
        .eq("owner", dataUser.data.user?.id)
        .eq("category_id", Number(category.id))
        .then((res) => {
          if (!res.data?.length) return;

          setToasts(res.data);
        });
    });
  }, []);

  const updateCategory = (id: string, category: Category) => {
    const parsedCategories = () => {
      const newCategories = [...categories];

      const index = newCategories.findIndex((category) => category.id === id);

      newCategories[index] = category;

      if (JSON.stringify(newCategories) !== JSON.stringify(categories))
        setIsCategoryChanged(true);

      return newCategories;
    };

    setCategories(parsedCategories());
  };

  const deleteCategory = async () => {
    const categoryToasts = await supabase
      .from("toasts")
      .select("*")
      .eq("category_id", category.id);

    console.log({ categoryToasts });

    if (!categoryToasts.data || !categoryToasts.data.length) return;

    for (const toast of categoryToasts.data) {
      await supabase.from("toasts").delete().eq("id", toast.id);
    }

    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      console.log({ error });
    }

    if (data) {
      create(`Category ${category.name} deleted`, user?.id ?? "");
      setCategories(categories.filter((c) => c.id !== category.id));

      toast.success(`✨ Category ${category.name} deleted`);
      toast.success(`🧹 ${categoryToasts.data.length} toasts deleted`);
    }
  };

  const uploadChanges = async () => {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: category.name })
      .eq("id", category.id);

    if (error) {
      console.log({ error });
    } else {
      setIsCategoryChanged(false);

      toast.success(`✨ Category ${category.name} updated`);
    }
  };

  return (
    <div className="rounded-xl bg-inherit border border-zinc-200 shadow-md px-4 py-8 flex min-w-[35rem] flex-col justify-between">
      <div>
        <div className="flex justify-between">
          <input
            className="font-medium bg-white p-0 text-md outline-none w-full"
            value={category.name}
            onChange={(e) => {
              updateCategory(category.id, {
                ...category,
                name: e.target.value,
              });
            }}
          />

          <div className="flex gap-x-2">
            {isCategoryChanged ? (
              <Check
                className="h-4 w-4 transition-all duration-150 ease-linear hover:text-blue-500 cursor-pointer"
                onClick={uploadChanges}
              />
            ) : (
              <></>
            )}

            <IntegrateCategory
              owner={user ? user.id : ""}
              category={category}
              workspaceId={category.workspace_id}
            />

            <Trash2
              className="h-4 w-4 transition-all duration-150 ease-linear hover:text-red-500 cursor-pointer"
              onClick={deleteCategory}
            />
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {toasts.map((toast, index) => (
            <EventToast
              key={index}
              toast={{
                ...toast,
                timestamp: parseTimestamp(toast.created_at ?? ""),
              }}
              toasts={toasts}
              setToasts={setToasts}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <TriggerEvent
          ownerId={user?.id ?? ""}
          categoryId={category.id}
          boardToasts={toasts}
          setBoardToasts={setToasts}
        />
      </div>
    </div>
  );
}
