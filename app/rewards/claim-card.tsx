'use client'

import { useState } from 'react'
import { XnodeUnitsOPENVestingContract } from '@/contracts/XnodeUnitsOPENVesting'
import { useXuNfts } from '@/utils/nft'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { RefreshCcw } from 'lucide-react'
import { BaseError, ContractFunctionRevertedError, formatUnits } from 'viem'
import { sepolia } from 'viem/chains'
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from 'wagmi'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

export function ClaimCard() {
  const { open } = useWeb3Modal()

  const account = useAccount()
  const { address, isConnecting, isDisconnected, isConnected } = account

  const {
    data: XuNFTs,
    isFetching: isFetchingXuNFTs,
    refetch: refetchXuNFTs,
  } = useXuNfts(address)
  const {
    data,
    isError,
    isFetching: isFetchingReleasable,
    refetch: refetchReleasable,
  } = useReadContract({
    address: XnodeUnitsOPENVestingContract.address,
    abi: XnodeUnitsOPENVestingContract.abi,
    functionName: 'releasable',
    args: [XuNFTs?.at(0) ?? BigInt(0)],
  })

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { toast } = useToast()

  const hasXuNFT = XuNFTs !== undefined && XuNFTs.length > 0

  const [submitting, setSubmitting] = useState<boolean>(false)
  const onClick = async () => {
    if (!account.address) return open()
    if (!isConnected) return open()
    if (!hasXuNFT) return alert('No XuNFT found')
    if (submitting) {
      toast({
        title: 'Please wait',
        description: 'The past submission is still running.',
        variant: 'destructive',
      })
      return
    }
    const submit = async () => {
      let { dismiss } = toast({
        title: 'Generating transaction',
        description: 'Please sign the transaction in your wallet...',
      })
      if (!publicClient || !walletClient?.account) {
        dismiss()
        toast({
          title: 'Claim failed',
          description: `${publicClient ? 'Wallet' : 'Public'}Client is undefined.`,
          variant: 'destructive',
        })
        return
      }
      const chain = sepolia
      const transactionRequest = await publicClient
        .simulateContract({
          account: walletClient.account,
          abi: XnodeUnitsOPENVestingContract.abi,
          address: XnodeUnitsOPENVestingContract.address,
          functionName: 'release',
          args: [XuNFTs?.at(0) ?? BigInt(0)],
          // chain,
        })
        .catch((err) => {
          console.error(err)
          if (err instanceof BaseError) {
            let errorName = err.shortMessage ?? 'Simulation failed.'
            const revertError = err.walk(
              (err) => err instanceof ContractFunctionRevertedError
            )
            if (revertError instanceof ContractFunctionRevertedError) {
              errorName += ` -> ${revertError.data?.errorName}` ?? ''
            }
            return errorName
          }
          return 'Simulation failed.'
        })
      if (typeof transactionRequest === 'string') {
        return alert(transactionRequest)
      }
      const transactionHash = await walletClient
        .writeContract(transactionRequest.request)
        .catch((err) => {
          console.error(err)
          return undefined
        })
      if (!transactionHash) {
        dismiss()
        toast({
          title: 'Claim failed',
          description: 'Transaction rejected.',
          variant: 'destructive',
        })
        return
      }

      dismiss()
      dismiss = toast({
        duration: 120_000, // 2 minutes
        title: 'Claim transaction submitted',
        description: 'Waiting until confirmed on the blockchain...',
        action: (
          <ToastAction
            altText="View on explorer"
            onClick={() => {
              window.open(
                `${chain.blockExplorers.default.url}/tx/${transactionHash}`,
                '_blank'
              )
            }}
          >
            View on explorer
          </ToastAction>
        ),
      }).dismiss

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      })

      dismiss()
      dismiss = toast({
        title: 'Success!',
        description: 'Rewards claimed',
        variant: 'success',
      }).dismiss

      await refetchReleasable()
    }

    await submit().catch(console.error)
    setSubmitting(false)
  }

  return (
    <Card className="max-w-xs p-2 px-3">
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
        <p className="text-center text-sm">Your Xnode rewards</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 text-center text-sm">
          <p className="truncate font-semibold text-green-500 underline">
            {!address ? 'Not connected.' : address}
          </p>
          <p>
            {!hasXuNFT
              ? 'This wallet does not hold a Xnode Unit NFT. Did you activate your Xnode Unit Entitlement NFT?'
              : 'Success! Your wallet has a valid Xnode Unit NFT!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="xl"
            className="w-full"
            onClick={() => onClick().catch(console.error)}
            disabled={!hasXuNFT}
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Claim' : 'Connect'}
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
