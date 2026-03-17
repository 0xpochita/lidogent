import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, optimism, unichain, soneium } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Lido Agent Treasury",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  chains: [mainnet, optimism, unichain, soneium],
  ssr: true,
});
