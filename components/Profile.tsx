"use client";

import { Avatar, Badge, Button } from "@nextui-org/react";
import { User, createClient } from "@supabase/supabase-js";
import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Notification from "./Notification";

export interface Notification {
  id?: string;
  text: string;
  owner: string;
}

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function Profile() {
  const [user, setUser] = useState<User>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getUser().then((loggedUser) => {
      if (loggedUser.data.user) {
        setUser(loggedUser.data.user);
      }

      supabase
        .from("notifications")
        .select("*")
        .eq("owner", loggedUser.data.user?.id)
        .then((res) => {
          if (!res.data?.length) return;

          setNotifications(res.data);
        });
    });
  }, []);

  const onOpen = () => {
    supabase
      .from("notifications")
      .select("*")
      .eq("owner", user?.id)
      .then((res) => {
        if (!res.data?.length) return;

        setNotifications(res.data);
      });
  };

  const markAllAsRead = async () => {
    setLoading(true);

    for (const notification of notifications) {
      await supabase.from("notifications").delete().eq("id", notification.id);
    }

    setNotifications([]);
    setLoading(false);
  };

  if (notifications.length) {
    return (
      <Popover>
        <Badge content={notifications.length} color="primary">
          <PopoverTrigger asChild onClick={onOpen}>
            <Avatar
              radius="full"
              size="md"
              src={
                "https://images.unsplash.com/photo-1697197850355-c70e8ea18394?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              className="cursor-pointer"
            />
          </PopoverTrigger>
        </Badge>

        <PopoverContent className="w-[25rem]">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Here are listed all of the notifications you have received.
              </p>

              <div className="space-y-2">
                {notifications.map((item, index) => (
                  <Notification
                    notification={item}
                    key={index}
                    setNotifications={setNotifications}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              className="bg-black rounde-lg text-white text-sm"
              onPress={markAllAsRead}
              disabled={loading}
            >
              {loading ? (
                "Loading..."
              ) : (
                <div className="flex gap-x-2">
                  <CheckCheck className="h-4 w-4" /> Mark all as read
                </div>
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild onClick={onOpen}>
        <Avatar
          radius="full"
          size="md"
          src={
            "https://images.unsplash.com/photo-1697197850355-c70e8ea18394?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          className="cursor-pointer"
        />
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Here are listed all of the notifications you have received.
            </p>

            <div className="space-y-2 w-full">
              {notifications.map((item, index) => (
                <Notification
                  notification={item}
                  key={index}
                  setNotifications={setNotifications}
                  size={"sm"}
                />
              ))}
            </div>
          </div>
        </div>

        {notifications.length ? (
          <div className="mt-4">
            <Button
              className="bg-black rounde-lg text-white text-sm"
              onPress={markAllAsRead}
            >
              <CheckCheck className="h-4 w-4" /> Mark all as read
            </Button>
          </div>
        ) : (
          <div className="p-4 text-center">
            <span className="text-zinc-400 text-xs">
              Wait until I notify you something. You have 0 notifications.
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
