"use client";

import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { User, createClient } from "@supabase/supabase-js";
import {
  Cog,
  LogOut,
  Mail,
  Merge,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { Workspace } from "../../app/dashboard/[id]/page";
import Profile from "@/components/Profile";
import SettingsModal from "./components/SettingsModal";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

interface SidebarProps {
  workspaceId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  workspaceId,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [user, setUser] = useState<User>();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getUser().then((loggedUser) => {
      if (loggedUser.data.user) {
        setUser(loggedUser.data.user);

        supabase
          .from("workspaces")
          .select("*")
          .eq("owner", loggedUser.data.user?.id)
          .then((workspaceRes) => {
            if (!workspaceRes.data?.length) return;

            const targetWorkspace = () => {
              if (workspaceId)
                return workspaceRes.data?.filter(
                  (w) => w.id === Number(workspaceId)
                )[0];

              return workspaceRes.data[0];
            };

            setWorkspaces(workspaceRes.data);
            setWorkspace(targetWorkspace());

            setLoading(false);
          });
      }
    });
  }, []);

  const navigateToWorkspace = (id: string) => {
    window.location.href = `/dashboard/${id}`;
    setWorkspace(workspaces.filter((w) => w.id === id)[0]);
  };

  const logout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/";
  };

  const closeSidebar = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className={`aside h-screen fixed bg-zinc-100 p-4 flex flex-col justify-between z-50 ${
        isClosing ? "animate-out slide-out-to-left" : ""
      } ${isOpen ? "animate-in slide-in-from-left" : "hidden"}`}
    >
      <div>
        <div className="mb-4">
          {loading ? (
            <div className="h-10 w-10 rounded-full bg-zinc-200 animate-pulse" />
          ) : (
            <div className="flex w-full justify-between items-center">
              <Profile />

              <PanelLeftClose
                className="text-zinc-300 transition-all duration-150 hover:text-zinc-500 cursor-pointer"
                onClick={closeSidebar}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-2 w-48 px-4 rounded-lg bg-zinc-200 border border-zinc-200 transition-all ease-linear hover:bg-zinc-100 cursor-pointer animate-pulse h-9" />
        ) : (
          <div className="py-2 w-48 px-4 rounded-lg bg-zinc-50 border border-zinc-200 transition-all duration-150 ease-linear hover:bg-zinc-100 cursor-pointer">
            <Dropdown className="rounded-md">
              <DropdownTrigger>
                <div className="flex gap-x-2 items-center">
                  <PanelLeft className="h-4 w-4" />

                  <h3 className="text-sm text-black">{workspace?.name}</h3>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Workspace selector">
                {workspaces.map((item, index) => (
                  <DropdownItem
                    key={index}
                    value={item.id}
                    onClick={() => navigateToWorkspace(item.id ?? "")}
                  >
                    {item.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 pl-4 mt-4">
            <div className="h-5 w-36 bg-zinc-200 animate-pulse rounded-lg" />

            <div className="h-5 w-36 bg-zinc-200 animate-pulse rounded-lg" />
          </div>
        ) : (
          <div className="space-y-2 pl-4 mt-4">
            <SettingsModal />

            <Link
              className="flex gap-x-2 items-center text-sm text-zinc-500 transition-all duration-150 ease-linear hover:text-zinc-700 pt-1"
              href={"#"}
            >
              <Merge className="h-4 w-4" />
              Upgrade
            </Link>

            <Link
              className="flex gap-x-2 items-center text-sm text-zinc-500 transition-all duration-150 ease-linear hover:text-zinc-700 pt-2"
              href={"#"}
            >
              <Mail className="h-4 w-4" />
              Invite
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <></>
      ) : (
        <div className="space-y-4">
          <h3 className="text-zinc-500 text-xs">{user?.email}</h3>

          <Button
            className="flex items-center gap-x-2 p-2 text-zinc-500 text-sm transition-all duration-150 ease-linear hover:text-zinc-700 bg-white shadow-inner shadow-zinc-50 w-full"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      )}
    </div>
  );
}
