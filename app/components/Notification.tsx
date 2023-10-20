import { Check, XIcon } from "lucide-react";
import { parseTimestamp } from "../utils/parseTimestamp";
import { Notification } from "./Profile";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function Notification({
  notification,
  setNotifications,
}: {
  notification: Notification;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}) {
  const [deleted, setDeleted] = useState<boolean>(false);

  const timeNow = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const markAsRead = async () => {
    await supabase.from("notifications").delete().eq("id", notification.id);

    setDeleted(true);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 700);
  };

  return (
    <div
      className={`py-2 px-4 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 flex items-center justify-between w-full ${
        deleted ? "animate-out fade-out slide-out-to-top-0" : ""
      }`}
    >
      <div className="flex gap-x-2 items-center">
        <XIcon
          className="h-4 w-4 transition-all duration-150 ease-linear hover:text-zinc-700 hover:scale-105 cursor-pointer"
          onClick={markAsRead}
        />

        <h3 className="text-sm">{notification.text}</h3>
      </div>

      <div className="text-xs text-zinc-400">{timeNow}</div>
    </div>
  );
}
