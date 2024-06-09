'use client'

import { XnodeUnitsOPENVestingContract } from '@/contracts/XnodeUnitsOPENVesting'
import { getXuNfts, useXuNfts } from '@/utils/nft'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { formatUnits, zeroAddress } from 'viem'
import { useAccount, useReadContract, useWalletClient, useWriteContract } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ClaimCard() {
  const { open, close } = useWeb3Modal()

  const account  = useAccount()

  const { address, isConnecting, isDisconnected, isConnected } = account
  const { data: XuNFTs } = useXuNfts(address)
  const { data, isError, isLoading } = useReadContract({
    address: XnodeUnitsOPENVestingContract.address,
    abi: XnodeUnitsOPENVestingContract.abi,
    functionName: 'releasable',
    args: [XuNFTs?.at(0) ?? BigInt(0)],
  })

  const {data: walletClient} = useWalletClient()

  const hasXuNFT = XuNFTs !== undefined && XuNFTs.length > 0

  const onClick = () => {
    if(!account.address) return () => open()
    if(!isConnected) return () => open()
    if(!hasXuNFT) return () => alert('No XuNFT found')
         return () =>  walletClient.writeContract({
        address: XnodeUnitsOPENVestingContract.address,
        abi: XnodeUnitsOPENVestingContract.abi,
        functionName: 'release',
        args: [XuNFTs?.at(0) ?? BigInt(0)],
        }).catch((error) => {
            console.error('Failed to release', error)
            })
  }

  return (
    <Card className="max-w-[250px] p-2 px-3">
      <CardHeader className="space-y-4">
        <div className="w-full px-2">
          <p className="w-full rounded-lg border bg-slate-50 px-3 py-1.5 text-center text-lg shadow-inner">
            {!isConnected
              ? '-'
              : data !== undefined
                ? formatUnits(data, 18)
                : 'loading..'}
          </p>
        </div>
        <p className="text-center text-sm">Your validator rewards</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 text-center text-sm">
          <p className="truncate font-semibold text-green-500 underline">
            {isLoading ? 'loading...' : address}
          </p>
          <p>
            {!hasXuNFT
              ? 'No XuNFT found'
              : 'Success! Your wallet has a valid Validator'}
          </p>
        </div>
        <Button
          size="xl"
          className="w-full"
          onClick={}
          disabled={!hasXuNFT}
        >
          {isConnecting ? 'Connecting...' : isConnected ? 'Stake' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  )
}
