'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useXuNfts } from '@/utils/nft'
import { Database, IdCard, ServerCog } from 'lucide-react'
import { useAccount } from 'wagmi'

import useSelectedXNode from '@/hooks/useSelectedXNode'
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

type Step = 0 | 1 | 2
type FlowType = 'xnode-current' | 'xnode-new' | 'baremetal' | 'evp'

export default function DeploymentFlow() {
  const router = useRouter()
  const { address } = useAccount()
  const { data: xNodes } = useXuNfts(address)
  const [selectedXNode] = useSelectedXNode()

  const [flowType, setFlowType] = useState<FlowType | undefined>()

  const [step, setStep] = useState<[Step, FlowType | undefined]>([0, undefined])

  function handleNextStep() {
    switch (step[0]) {
      case 0:
        if (flowType === 'xnode-current') setStep([1, 'xnode-current'])
        if (flowType === 'xnode-new') router.push('/claim')
        break
    }
  }

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
          {xNodes?.length ? (
            <RadioGroupCard
              value="xnode-current"
              className="rounded border bg-transparent px-6 py-4 text-start transition-colors disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-inherit enabled:data-[state=unchecked]:hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <IdCard className="size-8 text-primary" strokeWidth={1.25} />
                <h3 className="text-xl font-semibold">
                  XNodeO One{' '}
                  {selectedXNode ? (
                    <span className="ml-1 font-mono text-base font-medium text-muted-foreground">
                      ({selectedXNode.slice(0, 12)}…)
                    </span>
                  ) : null}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                You have an existing Xnode attached to with your wallet
              </p>
            </RadioGroupCard>
          ) : null}
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
          {step[0] == 0 ? (
            <Button
              disabled={flowType === undefined}
              size="lg"
              className="h-10 min-w-40"
              onClick={() => handleNextStep()}
            >
              {flowType === 'xnode-current' || flowType === undefined
                ? 'Deploy'
                : null}
              {flowType === 'xnode-new' ? 'Claim XNode One' : null}
              {flowType === 'baremetal' ? 'Select Provider' : null}
            </Button>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
