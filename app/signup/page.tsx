"use client";

import { Button, Image as NextImage, Input } from "@nextui-org/react";
import Image from "next/image";

import Wallpaper from "../../public/signup-wallpaper.png";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      toast("📥 Please check your inbox");

      console.log({ data });
    }
  };

  return (
    <main className="flex">
      <div className="p-16 flex flex-col justify-between">
        <Link href={"/"}>
          <NextImage
            src={"/raiden-black-png.png"}
            alt="Hiso Logo"
            className="h-16 w-auto"
            isBlurred
          />
        </Link>

        <div>
          <div>
            <h1 className="text-xl font-semibold">Create your account</h1>

            <h3 className="text-sm mt-2">
              After creating your account, you will be submitted to a{" "}
              <span className="font-bold">free</span> account, so some features
              can be locked.
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
                onClick={signup}
              >
                {loading ? "Loading..." : "Create account"}
              </Button>
            </div>
          </div>

          <h3 className="text-zinc-600 text-sm">
            After submitting the signup form, a verification code will be sent
            to your email for security purposes.
          </h3>
        </div>

        <span className="text-black">raiden.app</span>
      </div>

      <div className="absolute py-2 px-4 bg-black/40 backdrop-blur-xl text-white bottom-0 right-0 rounded-lg">
        giant eye sculpture in Tenochtitlan wallpaper 4k --ar 16:9
      </div>

      <Image
        src={Wallpaper}
        alt="Login background"
        className="h-screen object-cover"
      />
    </main>
  );
}
