"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlineBolt, HiOutlineCube, HiOutlineChevronRight } from "react-icons/hi2";

type Mode = "stake" | "wrap";

function StakeForm() {
  const [amount, setAmount] = useState("");
  const stETHAmount = amount ? (Number.parseFloat(amount) * 0.9998).toFixed(6) : "0.000000";

  return (
    <>
      <div className="mt-5 rounded-xl bg-main-bg p-4">
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-3xl font-semibold text-text-main placeholder:text-text-secondary/40 focus:outline-none"
          />
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" className="h-4 w-4 text-text-main">
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
            </svg>
            <span className="text-sm font-semibold text-text-main">ETH</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span>~$ 0.00</span>
          <div className="flex items-center gap-2">
            <span>0.00000000</span>
            <button type="button" className="cursor-pointer font-semibold text-brand hover:text-brand-hover">
              MAX
            </button>
          </div>
        </div>
      </div>

      <div className="my-3 flex items-center justify-between px-2">
        <span className="text-xs text-text-secondary">1 ETH <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" className="inline h-2.5 w-2.5"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" /></svg> = 1.0000 stETH <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={11} height={11} className="inline" /></span>
        <button type="button" className="cursor-pointer text-text-secondary transition-colors hover:text-text-main">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8.6 9.02a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0v-8.59l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 0 0 .04 1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="rounded-xl bg-main-bg p-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-semibold text-text-main">{stETHAmount}</span>
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5">
            <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={16} height={16} />
            <span className="text-sm font-semibold text-text-main">stETH</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span>~$ 0.00</span>
          <span>0.00000000</span>
        </div>
      </div>

      <div className="mt-4 space-y-2 px-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Exchange rate</span>
          <span className="text-text-main">1 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" className="inline h-2.5 w-2.5"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" /></svg> ETH = 1.0000 <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={11} height={11} className="inline" /> stETH</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Max transaction cost</span>
          <span className="text-text-main">~$ 0.50</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Reward fee</span>
          <span className="text-text-main">10%</span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={!amount || Number.parseFloat(amount) <= 0}
          className="w-full cursor-pointer rounded-xl bg-brand py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Stake ETH
        </button>
      </div>
    </>
  );
}

function WrapForm() {
  const [amount, setAmount] = useState("");
  const wstETHAmount = amount ? (Number.parseFloat(amount) * 0.8695).toFixed(6) : "0.000000";

  return (
    <>
      <div className="mt-5 rounded-xl bg-main-bg p-4">
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-3xl font-semibold text-text-main placeholder:text-text-secondary/40 focus:outline-none"
          />
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5">
            <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={16} height={16} />
            <span className="text-sm font-semibold text-text-main">stETH</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span>~$ 0.00</span>
          <div className="flex items-center gap-2">
            <span>0.00000000</span>
            <button type="button" className="cursor-pointer font-semibold text-brand hover:text-brand-hover">
              MAX
            </button>
          </div>
        </div>
      </div>

      <div className="my-3 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={12} height={12} />
          <span>stETH</span>
          <HiOutlineChevronRight className="h-3 w-3" />
          <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={12} height={12} className="rounded-full" />
          <span>wstETH</span>
          <HiOutlineChevronRight className="h-3 w-3" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
          </svg>
          <span>Treasury</span>
        </div>
      </div>

      <div className="rounded-xl bg-main-bg p-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-semibold text-text-main">{wstETHAmount}</span>
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5">
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={16} height={16} className="rounded-full" />
            <span className="text-sm font-semibold text-text-main">wstETH</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span>~$ 0.00</span>
          <span>Locked as principal in treasury</span>
        </div>
      </div>

      <div className="mt-4 space-y-2 px-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Exchange rate</span>
          <span className="text-text-main">1 stETH = ~0.8695 wstETH</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Max transaction cost</span>
          <span className="text-text-main">~$ 0.10</span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={!amount || Number.parseFloat(amount) <= 0}
          className="w-full cursor-pointer rounded-xl bg-brand py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Wrap & Lock in Treasury
        </button>
      </div>
    </>
  );
}

export function StakePanel() {
  const [mode, setMode] = useState<Mode>("stake");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-2xl border border-border-main bg-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex rounded-xl bg-main-bg p-1">
            <button
              type="button"
              onClick={() => setMode("stake")}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                mode === "stake"
                  ? "bg-brand text-white"
                  : "text-text-secondary hover:text-text-main"
              }`}
            >
              <HiOutlineBolt className="h-4 w-4" />
              Stake
            </button>
            <button
              type="button"
              onClick={() => setMode("wrap")}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                mode === "wrap"
                  ? "bg-brand text-white"
                  : "text-text-secondary hover:text-text-main"
              }`}
            >
              <HiOutlineCube className="h-4 w-4" />
              Wrap
            </button>
          </div>
          <button type="button" className="cursor-pointer text-text-secondary transition-colors hover:text-text-main">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.993 6.993 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {mode === "stake" ? <StakeForm /> : <WrapForm />}
      </div>

      <div className="rounded-2xl border border-border-main bg-surface">
        <div className="flex items-center gap-2 border-b border-border-main px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light">
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={20} height={20} className="rounded-full" />
          </div>
          <div className="-ml-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" className="h-3 w-3 text-text-main">
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
            </svg>
          </div>
          <span className="ml-1 text-lg font-semibold text-text-main">
            {mode === "stake" ? "ETH / wstETH" : "stETH / wstETH"}
          </span>
        </div>

        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src="/Assets/Images/Background/lidogent-bg.webp"
            alt="Lidogent"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand/1 backdrop-blur-xs" />
          <div className="absolute inset-0 bg-brand/10" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-xs font-medium text-gray-600 backdrop-blur-sm">
              Powered by Lido Finance
              <Image src="/Assets/Images/Logo/lido-dao-ldo-logo.svg" alt="Lido" width={16} height={16} />
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-base font-semibold text-text-main">
            {mode === "stake" ? "How Staking Works" : "How Wrapping Works"}
          </h3>
          <div className="mt-4 space-y-3">
            {mode === "stake" ? (
              <>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">1</span>
                    <span className="text-sm text-text-main">Stake ETH via Lido</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-secondary">Receive stETH</span>
                    <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={14} height={14} />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">2</span>
                    <span className="text-sm text-text-main">Auto-wrap to wstETH</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-secondary">Non-rebasing</span>
                    <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={14} height={14} className="rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">3</span>
                    <span className="text-sm text-text-main">Lock in Treasury</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-brand">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-brand">Principal locked</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">1</span>
                    <span className="text-sm text-text-main">Wrap stETH to wstETH</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-secondary">Non-rebasing</span>
                    <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={14} height={14} className="rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">2</span>
                    <span className="text-sm text-text-main">Lock in Treasury</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-brand">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-brand">Principal locked</span>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center justify-center">
              <div className="rounded-full border border-border-main bg-surface px-4 py-2">
                <div className="flex items-center gap-2">
                  <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={14} height={14} className="rounded-full" />
                  <span className="text-xs font-medium text-text-main">Lido Staking</span>
                </div>
                <p className="mt-0.5 text-center text-[10px] text-text-secondary">~3.5% APY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
