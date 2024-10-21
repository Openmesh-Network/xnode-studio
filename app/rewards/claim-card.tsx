'use client'

import { useState } from 'react'
import { XnodeUnitsOPENVestingContract } from '@/contracts/XnodeUnitsOPENVesting'
import { chain } from '@/utils/chain'
import { useXuNfts } from '@/utils/nft'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { RefreshCcw } from 'lucide-react'
import { formatUnits, parseUnits, zeroAddress } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

import { cn } from '@/lib/utils'
import { usePerformTransaction } from '@/hooks/usePerformTransaction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useDemoModeContext } from '@/components/demo-mode'

export function ClaimCard() {
  const { open } = useWeb3Modal()

  const account = useAccount()

  const { address, isConnecting, isConnected } = account
  const {
    data: XuNFTs,
    isFetching: isFetchingXuNFTs,
    refetch: refetchXuNFTs,
  } = useXuNfts(address)
  const {
    data: tokensReleasable,
    error,
    isFetching: isFetchingReleasable,
    refetch: refetchReleasable,
  } = useReadContract({
    address: XnodeUnitsOPENVestingContract.address,
    abi: XnodeUnitsOPENVestingContract.abi,
    functionName: 'releasable',
    args: [XuNFTs?.at(0) ?? BigInt(0)],
  })
  const { performingTransaction, performTransaction, loggers } =
    usePerformTransaction({ chainId: chain.id })

  const hasXuNFT = XuNFTs !== undefined && XuNFTs?.length !== 0

  const onClick = async () => {
    if (demoMode) {
      loggers?.onSuccess({
        title: 'Success!',
        description: 'Claim performed successfully.',
      })
      setDemoReleasable(BigInt(0))
      return
    }

    await performTransaction({
      transactionName: 'Claim',
      transaction: async () => {
        if (!account.address) {
          open()
          return undefined
        }
        if (!isConnected) {
          open()
          return undefined
        }
        if (!hasXuNFT) {
          loggers?.onError?.({
            title: 'Error',
            description: 'No XuNFT found.',
          })
          return undefined
        }

        return {
          abi: XnodeUnitsOPENVestingContract.abi,
          address: XnodeUnitsOPENVestingContract.address,
          functionName: 'release',
          args: [XuNFTs?.[0] ?? BigInt(0)],
        }
      },
      onConfirmed: (receipt) => {
        refetchReleasable().catch(console.error)
      },
    })
  }

  const { demoMode } = useDemoModeContext()
  const [demoReleasable, setDemoReleasable] = useState<bigint>(
    parseUnits('123.456789', 18)
  )

  return (
    <Card className="max-w-xs p-2 px-3">
      <CardHeader className="space-y-4">
        <div className="w-full px-2">
          <span className="flex flex-row">
            <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
              {error?.shortMessage}
            </p>
          </span>
          <p className="w-full rounded-lg border bg-slate-50 px-3 py-1.5 text-center text-lg shadow-inner">
            {demoMode
              ? formatUnits(demoReleasable, 18)
              : !isConnected || !hasXuNFT
                ? '-'
                : tokensReleasable !== undefined
                  ? formatUnits(tokensReleasable, 18)
                  : 'loading..'}
          </p>
        </div>
        <p className="text-center text-sm">Your Xnode rewards</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 text-center text-sm">
          <p className="truncate font-semibold text-green-500 underline">
            {demoMode ? zeroAddress : !address ? 'Not connected.' : address}
          </p>
          <p>
            {!hasXuNFT && !demoMode
              ? 'This wallet does not hold an Xnode Unit NFT. Did you activate your Xnode Unit Entitlement NFT?'
              : 'Success! Your wallet has a valid Xnode Unit NFT!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="xl"
            className="w-full"
            onClick={() => onClick().catch(console.error)}
            disabled={
              (isConnected && !hasXuNFT && !demoMode) || performingTransaction
            }
          >
            {isConnecting
              ? 'Connecting...'
              : isConnected || demoMode
                ? 'Claim'
                : 'Connect'}
          </Button>
          <Button
            onClick={() => {
              Promise.all([refetchXuNFTs(), refetchReleasable()]).catch(
                console.error
              )
            }}
            size="icon"
            className="size-12 shrink-0"
            variant="outline"
            disabled={isFetchingXuNFTs || isFetchingReleasable}
          >
            <RefreshCcw
              className={cn(
                'size-4',
                (isFetchingXuNFTs || isFetchingReleasable) && 'animate-spin'
              )}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
