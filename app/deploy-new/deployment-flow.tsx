'use client'

import { useState } from 'react'
import { formatAddress } from '@/utils/functions'
import { Database, IdCard, ServerCog } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupCard } from '@/components/ui/radio-group'

type FlowType = 'xnode-current' | 'xnode-new' | 'baremetal' | 'evp'

export default function DeploymentFlow() {
  const [flowType, setFlowType] = useState<FlowType | undefined>()

  const [step, setStep] = useState(0)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="h-10 min-w-40">
          Deploy
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-screen-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Choose your deployment server</AlertDialogTitle>
          <AlertDialogDescription>
            Decide where you want to deploy your OpenMesh Node
          </AlertDialogDescription>
        </AlertDialogHeader>
        <RadioGroup
          value={flowType ?? ''}
          onValueChange={(type: FlowType) => setFlowType(type)}
          className="flex flex-col gap-4"
        >
          <RadioGroupCard
            disabled
            value="xnode-current"
            className="rounded border bg-transparent px-6 py-4 text-start transition-colors disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-inherit enabled:data-[state=unchecked]:hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <IdCard className="size-8 text-primary" strokeWidth={1.25} />
              <h3 className="text-xl font-semibold">
                XNodeO One{' '}
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  ({formatAddress('0xF0dF6d08604B94F3942bb2C8aA579e67DE9f8d13')}
                  )
                </span>
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              You have an existing Xnode attached to with your wallet
            </p>
          </RadioGroupCard>
          <RadioGroupCard
            value="xnode-new"
            className="rounded border bg-transparent px-6 py-4 text-start transition-colors disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-inherit enabled:data-[state=unchecked]:hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <IdCard className="size-8 text-primary" strokeWidth={1.25} />
              <h3 className="text-xl font-semibold">XNodeO One</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Activate a powerful VPS with Xnode One. Use it as a
              high-performance virtual computer to deploy apps like Ollama and
              Microsoft Visual Studio. No KYC required.
            </p>
          </RadioGroupCard>
          <RadioGroupCard
            value="baremetal"
            className="rounded border bg-transparent px-6 py-4 text-start transition-colors disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-inherit enabled:data-[state=unchecked]:hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <ServerCog className="size-8 text-primary" strokeWidth={1.25} />
              <h3 className="text-xl font-semibold">Baremetal</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Activate a powerful baremetal server with XnodeOS. Use it as a
              dedicated high-performance machine and manage it through Xnode
              Studio.
            </p>
          </RadioGroupCard>
          <RadioGroupCard
            disabled
            value="evp"
            className="rounded border bg-transparent px-6 py-4 text-start transition-colors disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-inherit enabled:data-[state=unchecked]:hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Database className="size-8 text-primary" strokeWidth={1.25} />
              <h3 className="text-xl font-semibold">
                OpenMesh Early Validator
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Activate a powerful baremetal server with your Early Node
              Validator Pass purchased during the sale. Run Web3 validator nodes
              like Chainlink and Avalanche, validate the network, and earn $OPEN
              rewards. Visit [insert URL] to purchase.
            </p>
          </RadioGroupCard>
        </RadioGroup>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 min-w-28">
            Cancel
          </AlertDialogCancel>
          {step === 0 ? (
            <Button
              disabled={flowType === undefined}
              size="lg"
              className="h-10 min-w-40"
            >
              Deploy
            </Button>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
