/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use client";

import AccountContextProvider from "@/contexts/AccountContext";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import {
  createConfig,
  createStorage,
  cookieStorage,
  State,
  WagmiProvider,
  cookieToInitialState,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const chains = [mainnet, sepolia] as const;

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const metadata = {
  name: "Xnode",
  description: "Your Gateway to Building Personalized Data Ecosystems in minutes, instead of weeks.",
  url: "https://www.openmesh.network/xnode",
  icons: ["https://www.openmesh.network/xnode/openmesh-blue.png"],
};

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

// const initialState = cookieToInitialState(config, headers().get('cookie'))

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}) {
  return (
    <>
      <AccountContextProvider>
        <WagmiProvider config={config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="dark"
            >
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </AccountContextProvider>

      <ToastContainer />
    </>
  );
}

// Get projectId at https://cloud.walletconnect.com
