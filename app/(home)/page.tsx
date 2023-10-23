"use client";

import Image from "next/image";
import LayoutPreview from "../../components/LayoutPreview";
import RaidenLogo from "../../app/assets/raiden-new-png.png";

export default function Home() {
  return (
    <main className="py-16">
      <div className="flex pb-8 justify-center">
        <Image
          src={RaidenLogo}
          alt="Raiden"
          className="h-64 w-64 dark:invert"
        />
      </div>

      <div className="flex justify-center">
        <h1 className="text-2xl lg:text-4xl font-bold">
          Keep track of your events
        </h1>
      </div>

      <div className="flex justify-center">
        <h3 className="text-lg lg:text-lg text-zinc-700 mt-2 dark:text-zinc-400">
          a new way to be updated about EVERYTHING 🔮
        </h3>
      </div>

      <div className="mt-16">
        <LayoutPreview />
      </div>
    </main>
  );
}
