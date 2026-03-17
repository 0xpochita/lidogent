"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border-main px-8 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
          <span className="text-sm font-bold text-white">L</span>
        </div>
        <h1 className="text-lg font-semibold text-text-main">
          Lido Agent Treasury
        </h1>
      </div>
      <ConnectButton />
    </header>
  );
}
