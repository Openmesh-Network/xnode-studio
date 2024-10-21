'use client'

import { useState } from 'react'
import Link from 'next/link'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { chain } from '@/utils/chain'
import { useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { type Address } from 'viem'

import { cn } from '@/lib/utils'
import { usePerformTransaction } from '@/hooks/usePerformTransaction'
import useSelectedXNode from '@/hooks/useSelectedXNode'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { useDemoModeContext } from '../demo-mode'
import { Icons } from '../Icons'

type ActivateXNodeDialogProps = {
  address?: Address
  open: boolean
  onOpenChange: (val: boolean) => void
  entitlementNft?: bigint
}
export default function ActivateXNodeDialog({
  address,
  open,
  onOpenChange,
  entitlementNft,
}: ActivateXNodeDialogProps) {
  const [success, setSuccess] = useState(false)

  const queryClient = useQueryClient()
  const [, selectXNode] = useSelectedXNode()
  const { performTransaction, loggers } = usePerformTransaction({
    chainId: chain.id,
  })
  async function activateXNode() {
    if (demoMode) {
      loggers?.onSuccess?.({
        title: 'Success!',
        description: 'Activate performed successfully.',
      })
      setSuccess(true)
      return
    }

    await performTransaction({
      transactionName: 'Activate',
      transaction: async () => {
        if (entitlementNft === undefined) {
          loggers.onError &&
            loggers.onError({
              title: 'No NFT selected',
              description: 'Please select which NFT you want to activate.',
            })
          return undefined
        }

        return {
          abi: XnodeUnitEntitlementContract.abi,
          address: XnodeUnitEntitlementContract.address,
          functionName: 'activate',
          args: [entitlementNft],
        }
      },
      onConfirmed: () => {
        setSuccess(true)
        entitlementNft && selectXNode(entitlementNft.toString())
        queryClient.invalidateQueries({ queryKey: [address] })
      },
    })
  }

  const { demoMode } = useDemoModeContext()

  return (
    <AlertDialog open={open || success === true} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {success ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <Icons.PrettyCheck className="size-32 text-primary" />
              <Check className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-background" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-primary">Success</h3>
            <p className="text-center text-sm text-muted-foreground">
              You successfully activated your Xnode.
            </p>
          </div>
        ) : (
          <AlertDialogHeader>
            <AlertDialogTitle>
              You are about to activate your Xnode
            </AlertDialogTitle>
            <AlertDialogDescription>
              Doing this will trigger the 12 month countdown after which your
              VPS will no longer work. You can transfer your entitlement NFT as
              well as your Xnode NFT at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
        )}
        <AlertDialogFooter className={cn(success && 'flex-col')}>
          <AlertDialogCancel
            className={cn('h-10 min-w-28', success && 'grow')}
            onClick={() => setSuccess(false)}
          >
            {success ? 'Close' : 'Cancel'}
          </AlertDialogCancel>
          {success ? (
            <AlertDialogAction
              className="h-10 grow"
              asChild
              onClick={() => setSuccess(false)}
            >
              <Link href="/app-store">Start Deploying</Link>
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              className="h-10 min-w-40"
              onClick={async () => await activateXNode()}
            >
              Activate
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
