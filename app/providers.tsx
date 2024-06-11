'use client'

import AccountContextProvider from '@/contexts/AccountContext'
import { chain } from '@/utils/chain'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import { cookieStorage, createStorage, State, WagmiProvider } from 'wagmi'

import { Toaster } from '@/components/ui/toaster'
import ScreenProvider from '@/components/screen-provider'

const chains = [chain] as const
const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Xnode',
  description:
    'Your Gateway to Building Personalized Data Ecosystems in minutes, instead of weeks.',
  url: 'https://www.openmesh.network/xnode',
  icons: ['https://www.openmesh.network/xnode/openmesh-blue.png'],
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
  themeMode: 'light',
  themeVariables: {
    '--w3m-border-radius-master': '0px',
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
    <AccountContextProvider>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" enableSystem={false}>
            <ScreenProvider>
              {children}
              <ToastContainer />
              <Toaster />
            </ScreenProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AccountContextProvider>
  )
}
