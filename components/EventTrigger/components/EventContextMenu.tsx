"use client";

import { Toast } from "@/app/contexts/toastContext";
import useNotify from "@/app/hooks/useNotify";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

interface EventContextMenuProps {
  children: React.ReactNode;
  event: Toast;
  setToasts?: React.Dispatch<React.SetStateAction<Toast[]>>;
  className?: string;
  isStatic?: boolean;
}

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function EventContextMenu({
  children,
  event,
  className,
  setToasts,
  isStatic,
}: EventContextMenuProps) {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { create } = useNotify();

  const triggerNotification = () => {
    create(`Event: ${event.text}`, event.owner ?? "");
  };

  const deleteEvent = () => {
    setDeleteLoading(true);

    supabase
      .from("toasts")
      .delete()
      .eq("id", event.id)
      .then((res) => {
        if (res.error) {
          create(`Error deleting event ${event.text}`, event.owner ?? "");
          return;
        }

        create(`Event deleted: ${event.text}`, event.owner ?? "");
        if (!isStatic && setToasts)
          setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== event.id)
          );

        setDeleteLoading(false);
      });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={triggerNotification}>
          Trigger notification
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Quick actions</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Edit</ContextMenuItem>
            <ContextMenuItem onClick={deleteEvent}>
              {deleteLoading ? "Loading..." : "Delete"}
            </ContextMenuItem>
            <ContextMenuItem>Transfer</ContextMenuItem>

            <ContextMenuSeparator />
            <ContextMenuItem>Needing help?</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
