import { mainnet, sepolia } from 'wagmi/chains'

export const chain = process.env.NEXT_PUBLIC_TESTNET ? sepolia : mainnet
