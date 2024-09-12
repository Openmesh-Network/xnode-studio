import { ValidatorPassContract } from '@/contracts/ValidatorPass'
import { XnodeUnitContract } from '@/contracts/XnodeUnit'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Address } from 'viem'

const alchemyPrefix = process.env.NEXT_PUBLIC_TESTNET
  ? 'eth-sepolia'
  : 'eth-mainnet'

export async function getXueNfts(account) {
  // XXX: This should be replaced with an server rewrite, so the server can do the request and keep the API key secret.
  const url = `https://${alchemyPrefix}.g.alchemy.com/nft/v3/wxMZwmicJOsN0zsmfqSN2-nc8vovL3LP/getNFTsForOwner?owner=${account.address}&contractAddresses[]=${XnodeUnitEntitlementContract.address}&withMetadata=false`
  const response = await axios
    .get(url)
    .then((res) => res.data as { ownedNfts: { tokenId: string }[] })

  return response.ownedNfts.map((nft) => BigInt(nft.tokenId)).sort()
}

// Define the function to fetch the NFTs
export async function getXuNfts(address: Address) {
  const url = `https://${alchemyPrefix}.g.alchemy.com/nft/v3/wxMZwmicJOsN0zsmfqSN2-nc8vovL3LP/getNFTsForOwner?owner=${address}&contractAddresses[]=${XnodeUnitContract.address}&withMetadata=false`
  const response = await axios
    .get(url)
    .then((res) => res.data as { ownedNfts: { tokenId: string }[] })

  return response.ownedNfts.map((nft) => BigInt(nft.tokenId)).sort()
}

// Create a custom hook to use the getXuNfts function
export const useXuNfts = (address: Address) => {
  return useQuery({
    queryKey: ['xuNfts', address],
    queryFn: () => getXuNfts(address),
    enabled: !!address,
  })
}

export async function getEVPNfts(address: Address) {
  const url = `https://${alchemyPrefix}.g.alchemy.com/nft/v3/wxMZwmicJOsN0zsmfqSN2-nc8vovL3LP/getNFTsForOwner?owner=${address}&contractAddresses[]=${ValidatorPassContract.address}&withMetadata=false`
  const response = await axios
    .get(url)
    .then((res) => res.data as { ownedNfts: { tokenId: string }[] })

  return response.ownedNfts.map((nft) => BigInt(nft.tokenId)).sort()
}

export const useEVPNfts = (address?: Address) => {
  return useQuery({
    initialData: [],
    queryKey: ['EVPNfts', address],
    queryFn: async () => {
      if (!address) {
        return []
      }

      return await getXuNfts(address)
    },
  })
}
