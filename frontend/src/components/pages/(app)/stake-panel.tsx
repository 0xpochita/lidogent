"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlineBolt, HiOutlineCube, HiOutlineChevronRight, HiOutlineInformationCircle, HiOutlineXMark, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import { parseEther, formatEther } from "viem";
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import {
  LIDO_STETH_ADDRESS,
  WSTETH_ADDRESS,
  AGENT_TREASURY_ADDRESS,
  erc20Abi,
  agentTreasuryConfig,
} from "@/config/contracts";
import { useStETHBalance, useApproveStETH, useDepositStETH } from "@/hooks/use-treasury";
import { useStEthPerToken } from "@/hooks/use-lido";

type Mode = "stake" | "wrap";

const LIDO_SUBMIT_ABI = [
  {
    type: "function",
    name: "submit",
    inputs: [{ name: "_referral", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable",
  },
] as const;

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border-main bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-main">Stake & Wrap</h3>
          <button type="button" onClick={onClose} className="cursor-pointer text-text-secondary transition-colors hover:text-text-main">
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border-main p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                <HiOutlineBolt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">Stake ETH</p>
                <p className="text-xs text-text-secondary">Calls Lido submit() directly on mainnet</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-brand">1.</span>
                <span>Send ETH to Lido contract (0xae7a...)</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-brand">2.</span>
                <span>Receive</span>
                <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={12} height={12} />
                <span>stETH 1:1</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-brand">3.</span>
                <span>stETH earns ~3.5% APY automatically</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border-main p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                <HiOutlineCube className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">Wrap & Lock</p>
                <p className="text-xs text-text-secondary">Calls AgentTreasury depositStETH() on mainnet</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-brand">1.</span>
                <span>Approve stETH to Treasury contract</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-brand">2.</span>
                <span>Treasury wraps to</span>
                <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={12} height={12} className="rounded-full" />
                <span>wstETH and locks as principal</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-brand">3.</span>
                <span>Yield accrues from wstETH value growth</span>
              </li>
            </ul>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-[11px] text-text-secondary"
          >
            All transactions interact directly with Lido and AgentTreasury on Ethereum Mainnet.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StakeForm() {
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { writeContract, isPending, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const stETHAmount = amount ? (Number.parseFloat(amount) * 0.9998).toFixed(6) : "0.000000";
  const isLoading = isPending || isConfirming;

  const handleStake = () => {
    if (!amount || Number.parseFloat(amount) <= 0) return;
    writeContract(
      {
        address: LIDO_STETH_ADDRESS,
        abi: LIDO_SUBMIT_ABI,
        functionName: "submit",
        args: ["0x0000000000000000000000000000000000000000"],
        value: parseEther(amount),
      },
      {
        onSuccess: () => toast.success("Staking transaction submitted"),
        onError: (err) => toast.error(err.message.split("\n")[0]),
      },
    );
  };

  const handleMax = () => {
    if (ethBalance) {
      const max = Number.parseFloat(formatEther(ethBalance.value)) - 0.01;
      if (max > 0) setAmount(max.toFixed(6));
    }
  };

  return (
    <>
      <div className="mt-5 rounded-xl bg-main-bg p-4">
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            disabled={isLoading}
            className="w-full bg-transparent text-3xl font-semibold text-text-main placeholder:text-text-secondary/40 focus:outline-none disabled:opacity-50"
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
            <span>{ethBalance ? Number.parseFloat(formatEther(ethBalance.value)).toFixed(8) : "0.00000000"}</span>
            <button type="button" onClick={handleMax} className="cursor-pointer font-semibold text-brand hover:text-brand-hover">
              MAX
            </button>
          </div>
        </div>
      </div>

      <div className="my-3 flex items-center justify-between px-2">
        <span className="text-xs text-text-secondary">1 ETH = 1.0000 stETH (via Lido)</span>
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
          <a href="https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-1 text-brand hover:text-brand-hover">
            Lido: 0xae7a...fE84 <HiOutlineArrowTopRightOnSquare className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="mt-4 space-y-2 px-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Contract</span>
          <a href="https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-1 font-mono text-brand hover:text-brand-hover">
            0xae7a...fE84 <HiOutlineArrowTopRightOnSquare className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Reward fee</span>
          <span className="text-text-main">10%</span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={!isConnected || !amount || Number.parseFloat(amount) <= 0 || isLoading}
          onClick={handleStake}
          className="w-full cursor-pointer rounded-xl bg-brand py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {!isConnected ? "Connect Wallet" : isLoading ? "Confirming..." : isSuccess ? "Staked" : "Stake ETH"}
        </button>
      </div>
    </>
  );
}

function WrapForm() {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"input" | "approving" | "depositing">("input");
  const { address, isConnected } = useAccount();
  const { balance: stETHBalance } = useStETHBalance();
  const { data: rateData } = useStEthPerToken();

  const { writeContract: writeApprove, isPending: approving, data: approveTxHash } = useWriteContract();
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash });

  const { writeContract: writeDeposit, isPending: depositing, data: depositTxHash } = useWriteContract();
  const { isLoading: depositConfirming, isSuccess: depositConfirmed } = useWaitForTransactionReceipt({ hash: depositTxHash });

  const rate = rateData ? Number(formatEther(rateData)) : 1.1494;
  const wstETHAmount = amount ? (Number.parseFloat(amount) / rate).toFixed(6) : "0.000000";
  const isLoading = approving || depositing || depositConfirming;

  const handleWrap = () => {
    if (!amount || Number.parseFloat(amount) <= 0) return;
    const parsedAmount = parseEther(amount);

    setStep("approving");
    writeApprove(
      {
        address: LIDO_STETH_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [AGENT_TREASURY_ADDRESS, parsedAmount],
      },
      {
        onSuccess: () => {
          toast.success("Approval confirmed. Depositing...");
          setStep("depositing");
          writeDeposit(
            {
              ...agentTreasuryConfig,
              functionName: "depositStETH",
              args: [parsedAmount],
            },
            {
              onSuccess: () => toast.success("Deposit submitted. wstETH locked in treasury."),
              onError: (err) => {
                toast.error(err.message.split("\n")[0]);
                setStep("input");
              },
            },
          );
        },
        onError: (err) => {
          toast.error(err.message.split("\n")[0]);
          setStep("input");
        },
      },
    );
  };

  const handleMax = () => {
    if (stETHBalance.data) {
      setAmount(formatEther(stETHBalance.data as bigint));
    }
  };

  const buttonLabel = () => {
    if (!isConnected) return "Connect Wallet";
    if (step === "approving" || approving) return "Approving stETH...";
    if (step === "depositing" || depositing || depositConfirming) return "Locking in Treasury...";
    if (depositConfirmed) return "Locked in Treasury";
    return "Wrap & Lock in Treasury";
  };

  return (
    <>
      <div className="mt-5 rounded-xl bg-main-bg p-4">
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            disabled={isLoading}
            className="w-full bg-transparent text-3xl font-semibold text-text-main placeholder:text-text-secondary/40 focus:outline-none disabled:opacity-50"
          />
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5">
            <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={16} height={16} />
            <span className="text-sm font-semibold text-text-main">stETH</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span>~$ 0.00</span>
          <div className="flex items-center gap-2">
            <span>{stETHBalance.data ? Number.parseFloat(formatEther(stETHBalance.data as bigint)).toFixed(8) : "0.00000000"}</span>
            <button type="button" onClick={handleMax} className="cursor-pointer font-semibold text-brand hover:text-brand-hover">
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
          <span className="text-text-main">1 stETH = ~{(1 / rate).toFixed(4)} wstETH</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Treasury contract</span>
          <a href="https://etherscan.io/address/0xf5b4B061c2A28dfF834b1C1648E0D05120529c81" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-1 font-mono text-brand hover:text-brand-hover">
            0xf5b4...9c81 <HiOutlineArrowTopRightOnSquare className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Steps</span>
          <span className="text-text-main">1. Approve stETH  2. Deposit & lock</span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={!isConnected || !amount || Number.parseFloat(amount) <= 0 || isLoading}
          onClick={handleWrap}
          className="w-full cursor-pointer rounded-xl bg-brand py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {buttonLabel()}
        </button>
      </div>
    </>
  );
}

export function StakePanel() {
  const [mode, setMode] = useState<Mode>("stake");
  const [showInfo, setShowInfo] = useState(false);

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
          <button type="button" onClick={() => setShowInfo(true)} className="cursor-pointer text-text-secondary transition-colors hover:text-brand">
            <HiOutlineInformationCircle className="h-5 w-5" />
          </button>
        </div>

        {mode === "stake" ? <StakeForm /> : <WrapForm />}
      </div>

      <div className="rounded-2xl border border-border-main bg-surface">
        <div className="flex items-center gap-2 border-b border-border-main px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light">
            {mode === "stake" ? (
              <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={20} height={20} />
            ) : (
              <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={20} height={20} className="rounded-full" />
            )}
          </div>
          <div className="-ml-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" className="h-3 w-3 text-text-main">
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
            </svg>
          </div>
          <span className="ml-1 text-lg font-semibold text-text-main">
            {mode === "stake" ? "ETH / stETH" : "stETH / wstETH"}
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
                  <a href="https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-0.5 font-mono text-[10px] text-brand hover:text-brand-hover">
                    0xae7a...fE84 <HiOutlineArrowTopRightOnSquare className="h-2.5 w-2.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">2</span>
                    <span className="text-sm text-text-main">Receive stETH</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-secondary">~3.5% APY</span>
                    <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={14} height={14} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">1</span>
                    <span className="text-sm text-text-main">Approve stETH</span>
                  </div>
                  <a href="https://etherscan.io/address/0xf5b4B061c2A28dfF834b1C1648E0D05120529c81" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-0.5 font-mono text-[10px] text-brand hover:text-brand-hover">
                    0xf5b4...9c81 <HiOutlineArrowTopRightOnSquare className="h-2.5 w-2.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">2</span>
                    <span className="text-sm text-text-main">Wrap to wstETH & lock</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={14} height={14} className="rounded-full" />
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

      <AnimatePresence>
        {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      </AnimatePresence>
    </div>
  );
}
