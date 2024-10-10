'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useXuNfts } from '@/utils/nft'
import { servicesCompressedForAdmin } from '@/utils/xnode'
import axios from 'axios'
import { format } from 'date-fns'
import { Check, Database, IdCard, RotateCw, ServerCog } from 'lucide-react'
import { useAccount } from 'wagmi'

import {
  AppStoreItem,
  ServiceData,
  Specs,
  type AppStorePageType,
} from '@/types/dataProvider'
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
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/Icons'

import { useXnodes } from '../dashboard/health-data'
import DeploymentProvider from '../deploy/deployment-provider'
import { useDeploymentContext } from './deployment-context'

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
  sessionToken: string
  item: AppStoreItem
  specs: Specs
  type: AppStorePageType
}
export default function DeploymentFlow({
  sessionToken,
  type,
  item,
  specs,
}: DeploymentFlowProps) {
  const router = useRouter()
  const { address } = useAccount()
  const { data: allXNodeNfts } = useXuNfts(address)
  const [selectedXNode] = useSelectedXNode()
  const { data: deployedXNodes } = useXnodes(sessionToken)

  const [flowOpen, setFlowOpen] = useState(false)

  const [flowType, setFlowType] = useState<FlowType | undefined>()

  const [step, setStep] = useState<[Step, FlowType | undefined]>([0, undefined])
  const [activeDeploymentStep, setActiveDeploymentStep] = useState<1 | 2 | 3>(1)
  const [deploymentSteps, setDeploymentSteps] =
    useState<DeploymentFlow | null>()

  const { config } = useDeploymentContext()

  function handlePreviousStep() {
    switch (step[0]) {
      case 1:
        if (flowType === 'baremetal') setStep([0, undefined])
    }
  }

  function handleNextStep() {
    switch (step[0]) {
      case 0:
        if (flowType === 'xnode-current') {
          setDeploymentSteps(xnodeDeploymentFlow)
          setStep([1, 'xnode-current'])
          try {
            createXNodeDeployment()
            setTimeout(() => {
              setActiveDeploymentStep(2)
              setTimeout(() => {
                setActiveDeploymentStep(3)
                setTimeout(() => {
                  router.push('/deployments')
                }, 30 * 1000)
              }, 3 * 1000)
            }, 10 * 1000)
          } catch (err) {
            console.log(err)

            setFlowOpen(false)
            toast({
              title: 'Failed to deploy the Xnode',
              description: 'Please try to redeploy or contact us.',
              variant: 'destructive',
            })
          }
        }
        if (flowType === 'baremetal') {
          setStep([1, 'baremetal'])
        }
        if (flowType === 'xnode-new') router.push('/claim')
        break
    }
  }

  async function createXNodeDeployment() {
    if (!selectedXNode) {
      toast({
        title: "Couldn't find a Xnode to deploy to",
        variant: 'destructive',
      })
      throw new Error("Couldn't find a Xnode to deploy to")
    }

    const deployedXNode = deployedXNodes.find(
      (xNode) => xNode.deploymentAuth === selectedXNode
    )

    if (deployedXNode) {
      const deployedServices = JSON.parse(
        Buffer.from(deployedXNode.services, 'base64').toString('utf-8')
      )['services'] as ServiceData[]
      const newServiceMap = new Map<ServiceData['nixName'], ServiceData>()
      deployedServices.forEach((service) =>
        newServiceMap.set(service.nixName, service)
      )
      config.services.forEach((service) =>
        newServiceMap.set(service.nixName, service)
      )
      await axios({
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/pushXnodeServices`,
        method: 'post',
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': sessionToken,
          'Content-Type': 'application/json',
        },
        data: {
          id: deployedXNode.id,
          services: Buffer.from(
            JSON.stringify({
              services: servicesCompressedForAdmin(
                Array.from(newServiceMap.values())
              ),
              'users.users': [],
            })
          ).toString('base64'),
        },
      })
    } else {
      await axios({
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/createXnode`,
        method: 'post',
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': sessionToken,
          'Content-Type': 'application/json',
        },
        data: {
          ...config,
          isUnit: true,
          location: 'NYC1',
          provider: 'Unit',
          deploymentAuth: selectedXNode,
          services: Buffer.from(
            JSON.stringify({
              services: servicesCompressedForAdmin(config.services),
              'users.users': [],
            })
          ).toString('base64'),
        },
      })
    }
  }

  return (
    <AlertDialog open={flowOpen} onOpenChange={setFlowOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="h-10 min-w-40">
          Deploy
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(
          'max-w-screen-md transition-all',
          step[0] === 1 && step[1] === 'baremetal' && 'max-w-screen-2xl'
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            {step[0] === 0 ? 'Choose your deployment server' : null}
            {step[0] === 1 && step[1] === 'xnode-current'
              ? 'Deploying...'
              : null}
            {step[0] === 1 && step[1] === 'baremetal'
              ? 'Select a provider'
              : null}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {step[0] === 0
              ? 'Decide where you want to deploy your OpenMesh Node'
              : null}
            {step[0] === 1 && step[1] === 'xnode-current'
              ? `We're currently deploying your pre-configured ${type === 'templates' ? 'template' : 'use case'}.`
              : null}
            {step[0] === 1 && step[1] === 'baremetal'
              ? `Chose a baremetal provider to deploy your ${type === 'templates' ? 'template' : 'use case'} to.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {step[0] === 0 ? (
          <RadioGroup
            value={flowType ?? ''}
            onValueChange={(type: FlowType) => setFlowType(type)}
            className="flex flex-col gap-4"
          >
            {allXNodeNfts?.length ? (
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
                  You have an existing Xnode selected that is attached to your
                  wallet
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
              <div className="mb-4 mt-8">
                <p className="rounded border bg-muted-foreground px-3 py-1.5 font-mono text-muted">
                  <span className="opacity-75">
                    [{format(new Date(), 'HH:mm:ss')}]
                  </span>{' '}
                  Transfering all the deployment information to our Xnode
                  servers...
                </p>
                <h2 className="mt-4 text-lg font-semibold">{item.name}</h2>
                {item.serviceNames ? (
                  <div className="mt-1 flex flex-wrap gap-2">
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
                    {selectedXNode ? (
                      <p className="text-xl font-bold">
                        {formatXNodeName(selectedXNode)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
            {activeDeploymentStep === 2 ? (
              <div className="mb-4 mt-8">
                <p className="rounded border bg-muted-foreground px-3 py-1.5 font-mono text-muted">
                  <span className="opacity-75">
                    [{format(new Date(), 'HH:mm:ss')}]
                  </span>{' '}
                  Contacting Xnode servers to start off your deployment
                  process...
                </p>
              </div>
            ) : null}
            {activeDeploymentStep === 3 ? (
              <>
                <div className="mt-8 flex flex-col items-center">
                  <div className="relative">
                    <Check className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-background" />
                    <Icons.PrettyCheck className="size-32 text-primary" />
                  </div>
                  <p className="text-xl font-bold text-primary">Success</p>
                </div>
                <p className="my-4 rounded border bg-muted-foreground px-3 py-1.5 font-mono text-muted">
                  <span className="opacity-75">
                    [{format(new Date(), 'HH:mm:ss')}]
                  </span>{' '}
                  Your deployment is now running on our servers. This process
                  might take some time to finish.
                </p>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Estimated time
                </p>
                <p className="text-center text-3xl font-bold">10 Minutes</p>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  To check back on the status, navigate to your deployments
                  page.
                  <br />
                  Otherwise we will automatically redirect you to deployments
                  page after{' '}
                  <strong className="font-semibold">30 seconds</strong>
                </p>
              </>
            ) : null}
          </div>
        ) : null}
        {step[0] === 1 && step[1] === 'baremetal' ? (
          <DeploymentProvider specs={specs} />
        ) : null}
        <AlertDialogFooter className={cn()}>
          {step[0] === 1 && step[1] === 'baremetal' ? (
            <Button
              size="lg"
              variant="outline"
              className="h-10 min-w-28"
              onClick={() => handlePreviousStep()}
            >
              Back
            </Button>
          ) : null}
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
                Go to Deployment
              </Button>
            </Link>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
