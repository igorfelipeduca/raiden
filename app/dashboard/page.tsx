"use client";

import { useEffect, useState } from "react";
import { Toast } from "../contexts/toastContext";
import { User, createClient } from "@supabase/supabase-js";
import CategoryBox, { Category } from "../components/CategoryBox";
import { welcomeUser } from "../utils/welcomeUser";
import { Chip } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

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

export default function Dashboard() {
  const [user, setUser] = useState<User>();
  const [welcomed, setWelcomed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardId, setDashboardId] = useState<number>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDashboardId(Number(window.location.href.split("?dashboard=")[1]));

      supabase.auth.getUser().then((loggedUser) => {
        if (loggedUser.data.user) {
          setUser(loggedUser.data.user);

          console.log({ user: loggedUser.data.user });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from("workspaces")
        .select("*")
        .eq("owner", user.id)
        .then((workspaceRes) => {
          console.log({ workspaceRes });

          const targetWorkspace = () => {
            if (!workspaceRes.data?.length) return {} as Workspace;

            if (dashboardId)
              return workspaceRes.data?.filter((w) => w.id === dashboardId)[0];

            return workspaceRes.data[0];
          };

          console.log({ target: targetWorkspace() });

          supabase
            .from("categories")
            .select("*")
            .eq("owner", user.id)
            .then((res) => {
              console.log({ res });

              const filteredCategories = () => {
                if (!res.data || !res.data.length) return [];

                if (dashboardId)
                  return res.data?.filter(
                    (c) => c.workspace_id === dashboardId
                  );

                return res.data;
              };

              if (
                !filteredCategories().length &&
                !workspaceRes.data?.length &&
                user &&
                !welcomed
              ) {
                welcomeUser(
                  user,
                  welcomed,
                  setCategories,
                  setWelcomed,
                  setToasts
                ).then((welcomedData) => {
                  const categories = () => {
                    if (!welcomedData?.createdCategory.data)
                      return {} as Category;

                    return welcomedData?.createdCategory.data[0] as Category;
                  };

                  const toasts = () => {
                    if (!welcomedData?.createdToast.data) return {} as Toast;

                    return welcomedData?.createdToast.data[0] as Toast;
                  };

                  const workspace = () => {
                    if (!welcomedData?.createdWorkspace.data)
                      return {} as Workspace;

                    return welcomedData?.createdWorkspace.data[0] as Workspace;
                  };

                  setCategories((prev) => [...prev, categories()]);
                  setToasts((prev) => [...prev, toasts()]);

                  setWorkspace(workspace());
                });
              }

              if (!filteredCategories().length && workspaceRes.data?.length) {
                supabase
                  .from("categories")
                  .insert({
                    name: "General",
                    owner: user.id,
                    workspace_id: targetWorkspace().id ?? "",
                  })
                  .then((createdCategory) => {
                    if (!createdCategory.data) return;

                    const parsedCategory = createdCategory.data[0];

                    setCategories((prev) => [...prev, parsedCategory]);
                  });
              }

              setWorkspace(targetWorkspace());
              setCategories(filteredCategories());

              const targetCategory = () => {
                if (!filteredCategories().length) return {} as Category;

                return filteredCategories()[0];
              };

              supabase
                .from("toasts")
                .select("*")
                .eq("category_id", targetCategory().id ?? "")
                .then((res) => {
                  const filteredToasts = () => {
                    if (!res.data?.length) return [];

                    return res.data;
                  };

                  console.log({
                    filteredToasts: filteredToasts(),
                    toastData: res.data,
                  });

                  setToasts(filteredToasts());
                });

              if (loading) {
                setLoading(false);
              }
            });
        });
    }
  }, [dashboardId, user]);

  const createCategory = () => {
    supabase
      .from("categories")
      .insert({
        name: "New category",
        owner: user?.id,
        workspace_id: workspace?.id,
      })
      .select("*")
      .then((res) => {
        if (!res.data || !res.data.length) return;

        setCategories((prev) => [...prev, res.data[0]]);
      });
  };

  const fetchCategoryToasts = () => {
    supabase
      .from("toasts")
      .select("*")
      .eq("category_id", categories[0].id)
      .then((res) => {
        if (!res.data || !res.data.length) return;

        setToasts(res.data);
      });
  };

  return (
    <div className="h-screen">
      <div className="px-16 pt-10 pb-16 h-full">
        <div className="flex gap-x-2 items-center mb-8">
          <h1 className="text-3xl text-black font-bold">{workspace?.name}</h1>

          {!loading ? (
            <Chip color="primary" variant="shadow">
              {workspace?.tier}
            </Chip>
          ) : (
            <></>
          )}
        </div>

        <div className="h-full">
          {loading ? (
            <div className="flex gap-x-4 h-full">
              {Array(3)
                .fill(Math.random())
                .map((_, index) => (
                  <div
                    className="rounded-xl bg-inherit border border-dashed border-zinc-200 shadow-md p-4 w-[35rem] h-full animate-pulse"
                    key={index}
                  />
                ))}
            </div>
          ) : (
            <div className="flex gap-x-4">
              {categories.map((category, index) => (
                <CategoryBox
                  categories={categories}
                  setCategories={setCategories}
                  category={category}
                  key={index}
                />
              ))}

              <div
                className="h-16 w-16 p-4 rounded-xl border border-dashed border-zinc-200 flex justify-center items-center text-zinc-200  transition-all duration-150 ease-linear hover:border-zinc-500 hover:text-zinc-500 cursor-pointer"
                onClick={createCategory}
              >
                <PlusIcon />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
