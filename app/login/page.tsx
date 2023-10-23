"use client";

import { Button, Image as NextImage, Input } from "@nextui-org/react";
import Image from "next/image";

import Wallpaper from "../../public/login-wallpaper.png";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const login = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      if (data.user) {
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <main className="flex">
      <div className="p-16 flex flex-col justify-between">
        <Link href={"/"}>
          <NextImage
            src={"/raiden-new-png.png"}
            alt="Raiden Logo"
            className="h-24 w-auto"
            isBlurred
          />
        </Link>

        <div>
          <div>
            <h1 className="text-xl font-semibold">Login into your account</h1>

            <h3 className="text-sm mt-2">
              I am assuming that you already have an account. But, if you
              don&apos;t, you can create one by clicking{" "}
              <Link href={"/signup"} className="font-bold">
                here
              </Link>
              .
            </h3>
          </div>

          <div className="py-16 flex justify-center">
            <div className="space-y-8">
              <Input
                placeholder="Email"
                className="w-96"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="w-96"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                className={`bg-black text-white py-2 px-8 rounded-lg transition-all duration-150 hover:bg-zinc-800 flex gap-x-4`}
                onClick={login}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </div>

          <h3 className="text-zinc-600 text-sm">
            After submitting the login form, a verification code will be sent to
            your email for security purposes.
          </h3>
        </div>

        <span className="text-black">raiden.app</span>
      </div>

      <div className="absolute py-2 px-4 bg-black/40 backdrop-blur-xl text-white bottom-0 right-0 rounded-lg">
        an ancient egyptian civilization praising the sun god 4k --ar 16:9
      </div>

      <Image
        src={Wallpaper}
        alt="Login background"
        className="h-screen object-cover"
      />
    </main>
  );
}
