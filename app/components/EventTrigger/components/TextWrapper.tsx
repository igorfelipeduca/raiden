"use client";

import { Toast } from "@/app/contexts/toastContext";
import { createClient } from "@supabase/supabase-js";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast as sonnerToast } from "sonner";

interface TextWrapperProps {
  toast: Toast;
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function TextWrapper({ toast }: TextWrapperProps) {
  const [elementClicked, setElementClicked] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>("");
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const formSubimt = (e: React.FormEvent<HTMLFormElement>) => {
    setIsUpdated(false);

    e.preventDefault();

    if (!newText) return;
    setIsUpdated(true);
    setElementClicked(false);

    supabase
      .from("toasts")
      .update({ text: newText })
      .eq("id", toast.id)
      .then(() => {
        sonnerToast(`✅ Event text updated to "${newText}"`);
      });
  };

  if (elementClicked) {
    return (
      <form onSubmit={formSubimt}>
        <input
          type="text"
          className="bg-transparent outline-none text-zinc-500 "
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={toast.text}
        />
      </form>
    );
  }

  return (
    <h3
      className="bg-transparent outline-none text-black w-full truncate"
      onClick={() => setElementClicked(true)}
    >
      {isUpdated ? newText : toast.text}
    </h3>
  );
}
