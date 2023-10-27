"use client";

import { useEffect, useState } from "react";
import { Toast } from "../../contexts/toastContext";
import { User, createClient } from "@supabase/supabase-js";
import CategoryBox, { Category } from "../../../components/CategoryBox";
import { welcomeUser } from "../../utils/welcomeUser";
import { Chip } from "@nextui-org/react";
import { PanelLeftOpen, PlusIcon } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { toast } from "sonner";
import Filters from "./components/filters";

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

export default function Dashboard({ params }: DashboardProps) {
  const [user, setUser] = useState<User>();
  const [welcomed, setWelcomed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getUser().then((loggedUser) => {
      if (!loggedUser.data.user) return (window.location.href = "/login");

      setUser(loggedUser.data.user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from("workspaces")
        .select("*")
        .eq("owner", user.id)
        .then((workspaceRes) => {
          if (!workspaceRes.data?.length) return;

          const targetWorkspace = () => {
            if (!workspaceRes.data?.length) return {} as Workspace;

            if (params.id)
              return workspaceRes.data?.filter(
                (w) => w.id === Number(params.id)
              )[0];

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

                console.log(
                  res.data?.filter((c) => c.workspace_id === Number(params.id))
                );

                if (params.id)
                  return res.data?.filter(
                    (c) => c.workspace_id === Number(params.id)
                  );

                return res.data;
              };

              if (
                !filteredCategories().length &&
                !workspaceRes.data?.length &&
                user &&
                !welcomed
              ) {
                welcomeUser(user, welcomed, setCategories, setWelcomed).then(
                  (welcomedData) => {
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

                      return welcomedData?.createdWorkspace
                        .data[0] as Workspace;
                    };

                    setCategories((prev) => [...prev, categories()]);

                    setWorkspace(workspace());
                  }
                );
              }

              console.log(
                !filteredCategories().length && workspaceRes.data?.length
              );

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
                });
            });

          setLoading(false);
        });
    }
  }, [params.id, user]);

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

  const editWorkspaceTitle = (e: any) => {
    e.preventDefault();

    alert("a");

    supabase
      .from("workspaces")
      .update({ name: newWorkspaceTitle })
      .eq("id", workspace?.id)
      .select("*")
      .then((res) => {
        console.log({ res });

        if (!res.data || !res.data.length) return;

        const actualWorkspace = workspace ?? ({} as Workspace);

        setWorkspace({ ...actualWorkspace, name: res.data[0].name });

        setEditingTitle(false);

        toast.success(`Workspace title updated to ${res.data[0].name}`);
      });
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

            <div className="fixed w-screen flex gap-x-2 items-center mb-8 justify-between">
              <div className="flex gap-x-2 items-center">
                {editingTitle ? (
                  <form onSubmit={editWorkspaceTitle}>
                    <input
                      type="text"
                      className="bg-transparent outline-none text-3xl text-black"
                      placeholder={workspace?.name}
                      value={newWorkspaceTitle}
                      onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                    />
                  </form>
                ) : (
                  <div className="flex items-center">
                    <div className="flex gap-x-4 items-center">
                      <h1
                        className="text-3xl text-black font-bold"
                        onClick={() => setEditingTitle(true)}
                      >
                        {workspace?.name}
                      </h1>
                    </div>
                  </div>
                )}

                <div>
                  {!loading ? (
                    <Chip color="primary" variant="shadow">
                      {workspace?.tier}
                    </Chip>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <Filters />
            </div>

            <div className="h-full mt-32">
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
      </div>
    </div>
  );
}
