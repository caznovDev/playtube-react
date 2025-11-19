import React from "react";

export default function Navbar({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-800 bg-darknav/95 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-800 md:hidden"
          onClick={onMenuToggle}
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-base font-semibold">PlayTube</span>
        </div>
      </div>

      <div className="hidden w-full max-w-xs md:block">
        <input
          className="w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
          placeholder="Pesquisar"
        />
      </div>
    </header>
  );
}
