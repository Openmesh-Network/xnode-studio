import { mainnet, sepolia } from 'viem/chains'

export const chain = process.env.NEXT_PUBLIC_TESTNET ? sepolia : mainnet
