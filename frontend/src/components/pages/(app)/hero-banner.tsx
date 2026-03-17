"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PiPlantFill } from "react-icons/pi";
import { useTreasuryStore } from "@/stores/treasury-store";

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

function YieldProgress({ rate }: { rate: number }) {
  const percentage = Math.min(rate * 100, 100);

  return (
    <div className="mt-2 w-full">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>Yield accumulation</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/20">
        <div
          className="h-1.5 rounded-full bg-white transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function LiveYield() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const micro = (tick * 0.000001).toFixed(6);

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white">
        ~3.5% APY
      </span>
      <div className="flex items-center gap-1.5">
        <PiPlantFill className="h-3.5 w-3.5 text-green-400" />
        <span className="font-mono text-[10px] text-white/60">+{micro} stETH</span>
      </div>
    </div>
  );
}

export function HeroBanner() {
  const treasury = useTreasuryStore((s) => s.treasury);

  const principal = treasury?.principalStETH ?? "0";
  const yield_ = treasury?.availableYield ?? "0";
  const spent = treasury?.totalSpent ?? "0";

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <Image
          src="/Assets/Images/Background/lidogent-bg.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand/50 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 px-8 py-10">
        <p className="text-sm font-medium text-white/80">Treasury Overview</p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5 text-white/60"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-white/60">Locked Principal</p>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xl font-semibold text-white">
              {formatETH(principal)} stETH
              <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={20} height={20} />
            </p>
            <p className="mt-0.5 text-xs text-white/50">
              Inaccessible to agent
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/15 px-5 py-4 backdrop-blur-md">
            <p className="text-xs text-white/60">Spendable Yield</p>
            <p className="mt-2 flex items-center gap-1.5 text-xl font-semibold text-white">
              {formatETH(yield_)} stETH
              <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={20} height={20} />
            </p>
            <LiveYield />
            <YieldProgress rate={treasury?.yieldRate ?? 0} />
          </div>

          <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-md">
            <p className="text-xs text-white/60">Total Spent</p>
            <p className="mt-2 flex items-center gap-1.5 text-xl font-semibold text-white">
              {formatETH(spent)} stETH
              <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={20} height={20} />
            </p>
            <p className="mt-0.5 text-xs text-white/50">From yield balance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
