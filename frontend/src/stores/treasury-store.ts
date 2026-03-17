import { create } from "zustand";
import type {
  TreasuryData,
  Permission,
  SpendRecord,
} from "@/types/treasury";

type Status = "idle" | "loading" | "success" | "error";

interface TreasuryState {
  treasury: TreasuryData | null;
  permissions: Permission[];
  spendHistory: SpendRecord[];
  status: Status;
  error: string | null;
  setTreasury: (data: TreasuryData) => void;
  setPermissions: (permissions: Permission[]) => void;
  setSpendHistory: (records: SpendRecord[]) => void;
  setStatus: (status: Status) => void;
  setError: (error: string | null) => void;
}

export const useTreasuryStore = create<TreasuryState>((set) => ({
  treasury: null,
  permissions: [],
  spendHistory: [],
  status: "idle",
  error: null,
  setTreasury: (data) => set({ treasury: data, status: "success" }),
  setPermissions: (permissions) => set({ permissions }),
  setSpendHistory: (records) => set({ spendHistory: records }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: "error" }),
}));
