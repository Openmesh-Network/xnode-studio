'use client'

import AccountContextProvider from '@/contexts/AccountContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import { cookieStorage, createStorage, State, WagmiProvider } from 'wagmi'
import { polygon } from 'wagmi/chains'

const queryClient = new QueryClient()

const chain =
  process.env.NEXT_PUBLIC_WALLET_ENVIRONMENT === 'Polygon'
    ? polygon
    : // : polygonMumbai
      polygon

const chains = [chain] as const

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  themeVariables: {
    '--w3m-accent': '#000000',
  },
})

export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode
  initialState?: State
}) {
  return (
    <>
      <AccountContextProvider>
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
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
  )
}

// Get projectId at https://cloud.walletconnect.com
