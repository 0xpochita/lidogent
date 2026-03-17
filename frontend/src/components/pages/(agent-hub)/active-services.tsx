"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SERVICE_LOGOS: Record<string, string> = {
  perplexity: "/Assets/Images/Logo/perplexity-logo.png",
  openai: "/Assets/Images/Logo/chatgpt-logo.webp",
  claude: "/Assets/Images/Logo/claude-logo.png",
  gemini: "/Assets/Images/Logo/gemini-logo.jpeg",
  chatgpt: "/Assets/Images/Logo/chatgpt-logo.webp",
};

const AVAILABLE_SERVICES = [
  { id: "claude", name: "Claude API", logo: "/Assets/Images/Logo/claude-logo.png", description: "Anthropic language model" },
  { id: "chatgpt", name: "ChatGPT API", logo: "/Assets/Images/Logo/chatgpt-logo.webp", description: "OpenAI language model" },
  { id: "gemini", name: "Gemini API", logo: "/Assets/Images/Logo/gemini-logo.jpg", description: "Google language model" },
  { id: "perplexity-new", name: "Perplexity API", logo: "/Assets/Images/Logo/perplexity-logo.png", description: "AI-powered search" },
];

const SERVICES = [
  { id: "perplexity", name: "Perplexity API", category: "Research", budget: "0.0500", spent: "0.0120", status: "active" as const, lastUsed: "2h ago" },
  { id: "openai", name: "OpenAI API", category: "Research", budget: "0.0300", spent: "0.0085", status: "active" as const, lastUsed: "5h ago" },
  { id: "claude", name: "Claude API", category: "Research", budget: "0.0800", spent: "0.0320", status: "active" as const, lastUsed: "1h ago" },
  { id: "gemini", name: "Gemini API", category: "Research", budget: "0.0200", spent: "0.0035", status: "active" as const, lastUsed: "12h ago" },
  { id: "chatgpt", name: "ChatGPT API", category: "Research", budget: "0.0400", spent: "0.0000", status: "pending" as const, lastUsed: "N/A" },
];

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

function ServiceLogo({ id, name }: { id: string; name: string }) {
  const logo = SERVICE_LOGOS[id];
  if (logo) {
    return (
      <Image src={logo} alt={name} width={32} height={32} className="rounded-lg object-cover" />
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light">
      <span className="text-xs font-bold text-brand">{name.charAt(0)}</span>
    </div>
  );
}

function AddServiceModal({ onClose }: { onClose: () => void }) {
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
          <h3 className="text-lg font-semibold text-text-main">Add Service</h3>
          <button type="button" onClick={onClose} className="cursor-pointer text-text-secondary transition-colors hover:text-text-main">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-text-secondary">Select an AI service to whitelist for agent payments</p>

        <div className="mt-5 space-y-2">
          {AVAILABLE_SERVICES.map((service, i) => (
            <motion.button
              key={service.id}
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-border-main p-4 text-left transition-colors hover:border-brand hover:bg-brand-light"
            >
              <Image src={service.logo} alt={service.name} width={40} height={40} className="rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-main">{service.name}</p>
                <p className="text-xs text-text-secondary">{service.description}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-text-secondary">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="mt-4 rounded-xl border border-dashed border-border-main p-4"
        >
          <p className="text-center text-xs text-text-secondary">Or enter a custom recipient address</p>
          <input
            type="text"
            placeholder="0x..."
            className="mt-2 w-full rounded-lg border border-border-main bg-main-bg px-3 py-2 font-mono text-sm text-text-main placeholder:text-text-secondary/50 focus:border-brand focus:outline-none"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function ActiveServices() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-main">Active Services</h2>
          <p className="mt-1 text-sm text-text-secondary">Tools and APIs your agent pays for</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="cursor-pointer rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Add Service
        </button>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-border-main">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-main bg-main-bg">
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Service</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Category</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Usage</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary">Last Used</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">Action</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s) => {
              const pct = Number.parseFloat(s.budget) > 0 ? (Number.parseFloat(s.spent) / Number.parseFloat(s.budget)) * 100 : 0;
              const isPending = s.status === "pending";
              return (
                <tr key={s.id} className={`border-b border-border-main last:border-b-0 ${isPending ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <ServiceLogo id={s.id} name={s.name} />
                      <span className="font-medium text-text-main">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-text-secondary">{s.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-[10px] text-text-secondary">
                        <span>{formatETH(s.spent)}</span>
                        <span>{formatETH(s.budget)}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-border-main">
                        <div className={`h-1.5 rounded-full ${pct > 80 ? "bg-amber-500" : "bg-brand"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{s.lastUsed}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className={`cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                        isPending
                          ? "border-brand bg-brand-light text-brand hover:bg-brand hover:text-white"
                          : "border-border-main text-text-secondary hover:border-red-300 hover:text-red-500"
                      }`}
                    >
                      {isPending ? "Approve" : "Revoke"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && <AddServiceModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
