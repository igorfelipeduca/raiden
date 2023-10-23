"use client";

import { User, createClient } from "@supabase/supabase-js";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useNotify from "../hooks/useNotify";

export interface Toast {
  id?: string;
  type?: string;
  color?: string;
  text: string;
  timestamp?: string;
  emoji?: string;
  duration?: number;
  owner?: string;
  created_at?: string;
  silent?: string;
}

interface ToastContextType {
  toasts: Toast[];
  memoryToasts: Toast[];
  addToast: (toast: Toast, silent?: boolean) => void;
  removeToast: (id: string) => void;
  cleanToasts: () => void;
}

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let memoryToasts: Toast[] = [];

  const { create } = useNotify();

  const addToast = (toast: Toast, silent?: boolean) => {
    if (
      toasts.some((item) =>
        memoryToasts.some((item) => item.text === toast.text)
      )
    )
      return;

    const existentToast = memoryToasts.find((item) => item.text === toast.text);

    if (existentToast) return;

    const newToastId = uuidv4();

    setToasts((prevToasts) => [...prevToasts, { ...toast, id: newToastId }]);

    memoryToasts.push({ ...toast, id: newToastId });

    supabase.auth.getUser().then((loggedUser) => {
      if (loggedUser.data?.user && !silent) {
        create(`New event: ${toast.text}`, loggedUser.data.user.id).then(() => {
          console.log("Notification created");
        });
      }
    });
  };

  const removeToast = (id: string) => {
    if (!id) return;

    const toastToRemove = toasts.find((toast) => toast.id === id);

    if (!toastToRemove) return;

    const newToasts = toasts.filter((toast) => toast.id !== id);

    setToasts(newToasts);
  };

  const cleanToasts = () => {
    memoryToasts = [];
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, memoryToasts, cleanToasts }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
