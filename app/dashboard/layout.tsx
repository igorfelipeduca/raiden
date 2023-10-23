import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { ToastProvider } from "../contexts/toastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raiden",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>

        <Toaster />
      </body>
    </html>
  );
}