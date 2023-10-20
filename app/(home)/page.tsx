"use client";

import LayoutPreview from "../components/LayoutPreview";
import { Image } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="py-16">
      <div className="flex pb-8 justify-center">
        <Image
          src="/raiden-black-png.png"
          alt="Raiden"
          className="h-32 w-32"
          isBlurred
        />
      </div>

      <div className="flex justify-center">
        <h1 className="text-2xl lg:text-4xl font-bold">
          Keep track of your events
        </h1>
      </div>

      <div className="flex justify-center">
        <h3 className="text-lg lg:text-lg text-zinc-700 mt-2">
          a new way to be updated about EVERYTHING 🔮
        </h3>
      </div>

      <div className="mt-16">
        <LayoutPreview />
      </div>
    </main>
  );
}
