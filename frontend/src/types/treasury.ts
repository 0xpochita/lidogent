export interface TreasuryData {
  principalWstETH: string;
  principalStETH: string;
  availableYield: string;
  totalSpent: string;
  agentAddress: string;
  ownerAddress: string;
  isPaused: boolean;
}

export interface Permission {
  type: "whitelist" | "transaction-cap" | "time-window";
  label: string;
  value: string;
  enabled: boolean;
}

export interface SpendRecord {
  id: string;
  to: string;
  amount: string;
  timestamp: number;
  txHash: string;
}
