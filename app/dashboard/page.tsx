"use client";

import { User, createClient } from "@supabase/supabase-js";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import NotificationElement from "../../components/Notification";
import { Notification } from "../../components/Profile";
import { PanelLeft, PanelLeftOpen } from "lucide-react";

export interface Workspace {
  id?: string;
  name: string;
  owner: string;
  tier: string;
}

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

interface DashboardProps {
  params: {
    id: string;
  };
}

export interface RaidenUser {
  email: string;
  name: string;
  id: string;
}

export default function Dashboard({ params }: DashboardProps) {
  const [user, setUser] = useState<RaidenUser>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getUser().then((databaseUser) => {
      console.log({ databaseUser });

      if (!databaseUser.data?.user) return;

      supabase
        .from("users")
        .select("*")
        .eq("id", databaseUser.data.user.id)
        .then((res) => {
          if (!res.data?.length) return;

          setUser(res.data[0]);

          console.log(res.data[0]);

          supabase
            .from("notifications")
            .select("*")
            .eq("owner", res.data[0]?.id)
            .then((notificationRes) => {
              console.log(notificationRes.data);

              if (!notificationRes.data?.length) return;

              setNotifications(notificationRes.data);
            });

          supabase
            .from("workspaces")
            .select("*")
            .eq("owner", res.data[0]?.id)
            .then((workspaceRes) => {
              console.log(workspaceRes.data);

              if (!workspaceRes.data?.length) return;

              setWorkspaces(workspaceRes.data);

              setLoading(false);
            });
        });
    });
  }, []);

  const navigateToWorkspace = (id: string) => {
    window.location.href = `/dashboard/${id}`;
  };

  return (
    <div className="flex">
      <Sidebar
        workspaceId={params.id}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div
        className={`${
          isSidebarOpen ? "pl-48" : ""
        } transition-all duration-150 ease-linear`}
      >
        <div className="h-screen">
          <div className="px-16 pt-10 pb-16 h-full">
            {!isSidebarOpen ? (
              <PanelLeftOpen
                className="mb-8 text-zinc-300 hover:text-zinc-500 transition-all duration-150 ease-linear cursor-pointer"
                onClick={() => setIsSidebarOpen(true)}
              />
            ) : (
              <></>
            )}

            <div className="h-full" hidden={loading}>
              <h1 className="text-3xl font-semibold">Hey, {user?.name} 👋</h1>

              <div className="mt-2">
                <h3>What are we gonna do today?</h3>
              </div>

              <div className="mt-16">
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="border border-zinc-200 rounded-lg shadow-sm py-4 px-6">
                    <h3>Recent notifications</h3>

                    <div className="mt-4 space-y-2 w-full">
                      {notifications.length ? (
                        <>
                          {notifications?.map((notification, index) => (
                            <NotificationElement
                              notification={notification}
                              setNotifications={setNotifications}
                              key={index}
                            />
                          ))}
                        </>
                      ) : (
                        <span className="text-zinc-500">
                          Things are a little slow over here... You have 0
                          notifications
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border border-zinc-200 rounded-lg shadow-sm py-4 px-6 w-64">
                    <h3>Your workspaces</h3>

                    <div className="mt-4">
                      {workspaces.length ? (
                        <>
                          {workspaces?.map((workspace, index) => (
                            <div
                              className="border border-zinc-200 rounded-lg p-2 text-zinc-600 transition-all duration-150 cursor-pointer ease-linear hover:bg-zinc-50"
                              key={index}
                            >
                              <button
                                className="flex gap-x-2 items-center"
                                onClick={() =>
                                  navigateToWorkspace(workspace.id as string)
                                }
                              >
                                <PanelLeft className="h-4 w-4" />

                                <h3 className="text-sm">{workspace?.name}</h3>
                              </button>
                            </div>
                          ))}
                        </>
                      ) : (
                        <span className="text-zinc-500">
                          Things are a little slow over here... You have 0
                          notifications
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
