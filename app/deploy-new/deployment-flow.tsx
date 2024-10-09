'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useXuNfts } from '@/utils/nft'
import {
  Check,
  Database,
  IdCard,
  RotateCcw,
  RotateCw,
  ServerCog,
} from 'lucide-react'
import { useAccount } from 'wagmi'

import { AppStoreItem, type AppStorePageType } from '@/types/dataProvider'
import { cn, formatXNodeName } from '@/lib/utils'
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
type DeploymentStep =
  | 'Choose Provider'
  | 'Deployment Overview'
  | 'Link Account'
  | 'Running Deployment'
  | 'Contacting Xnode'
type DeploymentFlow = [DeploymentStep, DeploymentStep, DeploymentStep]

const xnodeDeploymentFlow: DeploymentFlow = [
  'Deployment Overview',
  'Contacting Xnode',
  'Running Deployment',
]
const baremetalDeploymentFlow: DeploymentFlow = [
  'Deployment Overview',
  'Link Account',
  'Running Deployment',
]
const evpDeploymentFlow: DeploymentFlow = [
  'Choose Provider',
  'Link Account',
  'Running Deployment',
]

type DeploymentFlowProps = {
  item: AppStoreItem
  type: AppStorePageType
}
export default function DeploymentFlow({ type, item }: DeploymentFlowProps) {
  const router = useRouter()
  const { address } = useAccount()
  const { data: xNodes } = useXuNfts(address)
  const [selectedXNode] = useSelectedXNode()

  const [flowType, setFlowType] = useState<FlowType | undefined>()

  const [step, setStep] = useState<[Step, FlowType | undefined]>([0, undefined])
  const [activeDeploymentStep, setActiveDeploymentStep] = useState<1 | 2 | 3>(1)
  const [deploymentSteps, setDeploymentSteps] =
    useState<DeploymentFlow | null>()

  function handleNextStep() {
    switch (step[0]) {
      case 0:
        if (flowType === 'xnode-current') {
          setDeploymentSteps(xnodeDeploymentFlow)
          setStep([1, 'xnode-current'])
          setTimeout(() => {
            setActiveDeploymentStep(2)
            setTimeout(() => {
              setActiveDeploymentStep(3)
            }, 3000)
          }, 10000)
        }
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
      <AlertDialogContent className="max-w-screen-md transition-all">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {step[0] === 0 ? 'Choose your deployment server' : null}
            {step[0] === 1 && step[1] === 'xnode-current'
              ? 'Deploying...'
              : null}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {step[0] === 0
              ? 'Decide where you want to deploy your OpenMesh Node'
              : null}
            {step[0] === 1 && step[1] === 'xnode-current'
              ? `We're currently deploying your pre-configured ${type === 'templates' ? 'template' : 'use case'}.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {step[0] === 0 ? (
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
                    XnodeO One{' '}
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
                Validator Pass purchased during the sale. Run Web3 validator
                nodes like Chainlink and Avalanche, validate the network, and
                earn $OPEN rewards. Visit [insert URL] to purchase.
              </p>
            </RadioGroupCard>
          </RadioGroup>
        ) : null}
        {step[0] === 1 && step[1] === 'xnode-current' ? (
          <div>
            <div className="isolate mt-4 flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full border-2 border-primary transition-colors',
                    activeDeploymentStep > 1
                      ? 'bg-primary'
                      : 'border-primary/25 bg-background'
                  )}
                >
                  {activeDeploymentStep === 1 ? (
                    <RotateCw className="size-5 animate-spin text-primary" />
                  ) : null}
                  {activeDeploymentStep > 1 ? (
                    <Check className="size-6 text-background" />
                  ) : null}
                </div>
                <p>{deploymentSteps[0]}</p>
              </div>
              <div
                className={cn(
                  '-z-10 -mx-16 mt-5 h-0.5 w-48',
                  activeDeploymentStep >= 2 ? 'bg-primary' : 'bg-primary/25'
                )}
              />
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full border-2 border-primary transition-colors',
                    activeDeploymentStep > 2
                      ? 'bg-primary'
                      : 'border-primary/25 bg-background'
                  )}
                >
                  {activeDeploymentStep === 2 ? (
                    <RotateCw className="size-5 animate-spin text-primary" />
                  ) : null}
                  {activeDeploymentStep > 2 ? (
                    <Check className="size-6 text-background" />
                  ) : null}
                </div>
                <p>{deploymentSteps[1]}</p>
              </div>
              <div
                className={cn(
                  '-z-10 -mx-16 mt-5 h-0.5 w-48',
                  activeDeploymentStep === 3 ? 'bg-primary' : 'bg-primary/25'
                )}
              />
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full border-2 border-primary/25 bg-background transition-colors'
                  )}
                >
                  {activeDeploymentStep === 3 ? (
                    <RotateCw className="size-5 animate-spin text-primary" />
                  ) : null}
                </div>
                <p>{deploymentSteps[2]}</p>
              </div>
            </div>
            {activeDeploymentStep === 1 ? (
              <div className="mb-4 mt-8 flex flex-col items-center">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="line-clamp-2 max-w-prose text-center text-sm text-muted-foreground">
                  {item.desc}
                </p>
                {item.serviceNames ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.serviceNames.map((service) => (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {service}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex items-center gap-3">
                  <Image
                    src="/images/xnode-card/silvercard-front.webp"
                    alt="Xnode Card"
                    width={96}
                    height={64}
                    className="mt-2 object-contain"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your selected Xnode
                    </p>
                    <p className="text-xl font-bold">
                      {formatXNodeName(selectedXNode)}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {activeDeploymentStep === 2 ? (
              <p className="mb-4 mt-8 text-center text-muted-foreground">
                We are currently contacting our Xnode servers to start your
                deployment...
              </p>
            ) : null}
          </div>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 min-w-28">
            {step[0] === 0 ? 'Cancel' : null}
            {step[0] === 1 ? 'Close' : null}
          </AlertDialogCancel>
          {step[0] === 0 ? (
            <Button
              disabled={flowType === undefined}
              size="lg"
              className="h-10 min-w-40"
              onClick={() => handleNextStep()}
            >
              {flowType === 'xnode-current' || flowType === undefined
                ? 'Deploy'
                : null}
              {flowType === 'xnode-new' ? 'Claim Xnode One' : null}
              {flowType === 'baremetal' ? 'Select Provider' : null}
            </Button>
          ) : null}
          {step[0] === 1 &&
          step[1] === 'xnode-current' &&
          activeDeploymentStep === 3 ? (
            <Link href={`/deployments/${selectedXNode}`}>
              <Button size="lg" className="h-10 min-w-40">
                Zum Deployment
              </Button>
            </Link>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
