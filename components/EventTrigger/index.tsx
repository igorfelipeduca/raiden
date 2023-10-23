import { useEffect, useState } from "react";
import { Chip } from "@nextui-org/react";
import { Toast, useToast } from "../../app/contexts/toastContext";
import EventContextMenu from "./components/EventContextMenu";
import TextWrapper from "./components/TextWrapper";

export default function EventToast({
  toasts,
  toast,
  setToasts,
  isStatic,
}: {
  toasts?: Toast[];
  toast: Toast;
  setToasts?: React.Dispatch<React.SetStateAction<Toast[]>>;
  isStatic?: boolean;
}) {
  const [toastRemoved, setToastRemoved] = useState<boolean>(false);
  const { removeToast } = useToast();

  useEffect(() => {
    if (!toast.duration || toast.duration === 0 || isStatic) return;

    const timer = setTimeout(
      () => {
        setToastRemoved(true);

        setTimeout(() => {
          removeToast(toast.id ?? "");
        }, 700);
      },
      toast.duration ? toast.duration : 5000
    );

    return () => clearTimeout(timer);
  }, []);

  const timeNow = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  switch (toast?.type) {
    case "success":
      return (
        <div className="my-2">
          <EventContextMenu event={toast} setToasts={setToasts}>
            <div
              className={`py-2 px-4 rounded-xl bg-gradient-to-br from-zinc-50 via-zinc-50 to-blue-50/75 border border-zinc-200 min-w-[20rem] shadow-sm animate-in fade-in slide-in-from-top duration-700 dark:bg-zinc-800 dark:text-zinc-400 ${
                toastRemoved ? "animate-out fade-out slide-out-to-top-0" : ""
              }`}
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-x-2 items-center">
                  {toast?.emoji ?? (
                    <div className="h-2 w-2 rounded-full bg-blue-500 text-white flex justify-center items-center shadow-sm shadow-blue-500" />
                  )}

                  <TextWrapper
                    toast={toast}
                    toasts={toasts ?? []}
                    setToasts={() => {
                      setToasts;
                    }}
                  />
                </div>

                <h3 className="text-zinc-500 text-sm">
                  {toast?.timestamp ?? timeNow}
                </h3>
              </div>
            </div>
          </EventContextMenu>
        </div>
      );

    case "error":
      return (
        <div className="my-2">
          <EventContextMenu event={toast} setToasts={setToasts}>
            <div
              className={`py-2 px-4 rounded-xl bg-gradient-to-br from-zinc-50 via-zinc-50 to-red-50/75 border border-zinc-200 min-w-[20rem] shadow-sm animate-in fade-in slide-in-from-top duration-700 ${
                toastRemoved ? "animate-out fade-out slide-out-to-top-0" : ""
              }`}
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-x-2 items-center">
                  {toast?.emoji ?? (
                    <div className="h-2 w-2 rounded-full bg-red-500 text-white flex justify-center items-center shadow-sm shadow-red-500" />
                  )}

                  <TextWrapper
                    toast={toast}
                    toasts={toasts ?? []}
                    setToasts={() => {
                      setToasts;
                    }}
                  />
                </div>

                <h3 className="text-zinc-500 text-sm">
                  {toast?.timestamp ?? timeNow}
                </h3>
              </div>
            </div>
          </EventContextMenu>
        </div>
      );

    case "warning":
      return (
        <div className="my-2">
          <EventContextMenu event={toast} setToasts={setToasts}>
            <div
              className={`py-2 px-4 rounded-xl bg-gradient-to-br from-zinc-50 via-zinc-50 to-yellow-50/75 border border-zinc-200 min-w-[20rem] shadow-sm animate-in fade-in slide-in-from-top duration-700 ${
                toastRemoved ? "animate-out fade-out slide-out-to-top-0" : ""
              }`}
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-x-2 items-center">
                  {toast?.emoji ?? (
                    <div className="h-2 w-2 rounded-full bg-yellow-500 text-white flex justify-center items-center shadow-sm shadow-yellow-500" />
                  )}

                  <TextWrapper
                    toast={toast}
                    toasts={toasts ?? []}
                    setToasts={() => {
                      setToasts;
                    }}
                  />
                </div>

                <h3 className="text-zinc-500 text-sm">
                  {toast?.timestamp ?? timeNow}
                </h3>
              </div>
            </div>
          </EventContextMenu>
        </div>
      );

    case "api":
      return (
        <div className="my-2">
          <EventContextMenu event={toast} setToasts={setToasts}>
            <div
              className={`py-2 px-4 rounded-xl bg-zinc-50 border border-zinc-200 min-w-[20rem] shadow-sm animate-in fade-in slide-in-from-top duration-700 ${
                toastRemoved ? "animate-out fade-out slide-out-to-top-0" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-x-2 items-center">
                  {toast?.emoji ?? <></>}

                  <TextWrapper
                    toast={toast}
                    toasts={toasts ?? []}
                    setToasts={() => {
                      setToasts;
                    }}
                  />

                  <Chip className="rounded-lg text-xs p-px mr-2">
                    via webhook
                  </Chip>
                </div>

                <h3 className="text-zinc-500 text-sm">
                  {toast?.timestamp ?? timeNow}
                </h3>
              </div>
            </div>
          </EventContextMenu>
        </div>
      );

    default:
      return (
        <div className="my-2">
          <EventContextMenu event={toast} setToasts={setToasts}>
            <div
              className={`py-2 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 min-w-[20rem] shadow-sm animate-in fade-in slide-in-from-top duration-700 items-center ${
                toastRemoved ? "animate-out fade-out slide-out-to-top-0" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-x-2 items-center">
                  {toast?.emoji ?? <></>}

                  {isStatic ? (
                    <h3 className="bg-transparent outline-none text-black dark:text-zinc-400 w-full truncate">
                      {toast.text}
                    </h3>
                  ) : (
                    <TextWrapper
                      toast={toast}
                      toasts={toasts ?? []}
                      setToasts={() => {
                        setToasts;
                      }}
                    />
                  )}
                </div>

                <h3 className="text-zinc-500 text-sm">
                  {toast?.timestamp ?? timeNow}
                </h3>
              </div>
            </div>
          </EventContextMenu>
        </div>
      );
  }
}
