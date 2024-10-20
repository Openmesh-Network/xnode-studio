'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type Provider } from '@/db/schema'
import { useXuNfts } from '@/utils/nft'
import { prefix } from '@/utils/prefix'
import { servicesCompressedForAdmin } from '@/utils/xnode'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'date-fns'
import {
  Check,
  Database,
  Dot,
  IdCard,
  MapPin,
  RotateCw,
  ServerCog,
} from 'lucide-react'
import { useAccount } from 'wagmi'

import {
  type AppStoreItem,
  type AppStorePageType,
  type ServiceData,
  type Specs,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupCard } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/Icons'
import { useTestModeContext } from '@/components/test-mode'

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
  specs?: Specs
  type: AppStorePageType
}
export default function DeploymentFlow({
  sessionToken,
  type,
  item,
  specs,
}: DeploymentFlowProps) {
  const { active: testMode } = useTestModeContext()

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

  const { data: selectedBaremetalServer } = useQuery<Provider>({
    queryKey: ['provider', config.name],
    queryFn: async () => {
      return await fetch(`/api/providers/${config.name}`, {
        method: 'GET',
      }).then((res) => res.json())
    },
    enabled: step[0] === 2 && step[1] === 'baremetal',
  })
  const baremetalConfig = useMemo(() => {
    if (!selectedBaremetalServer) return null
    let config = ''
    if (selectedBaremetalServer.cpuGHZ)
      config += `${selectedBaremetalServer.cpuGHZ}GHz `
    if (selectedBaremetalServer.cpuCores)
      config += `${selectedBaremetalServer.cpuCores}-Core `
    if (selectedBaremetalServer.cpuThreads)
      config += `(${selectedBaremetalServer.cpuThreads} threads)`
    if (selectedBaremetalServer.ram)
      config += `, ${selectedBaremetalServer.ram}GB RAM`
    if (selectedBaremetalServer.storageTotal)
      config += `, ${selectedBaremetalServer.storageTotal} GB`
    if (selectedBaremetalServer.network)
      config += `, ${selectedBaremetalServer.network} Gbps`
    return config
  }, [selectedBaremetalServer])

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
            if (!testMode) createXNodeDeployment()
            setTimeout(() => {
              setActiveDeploymentStep(2)
              setTimeout(() => {
                setActiveDeploymentStep(3)
              }, 3 * 1000)
            }, 3 * 1000)
          } catch (err) {
            onFlowOpenToggle(false)
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
      case 1:
        if (flowType === 'baremetal') {
          setDeploymentSteps(baremetalDeploymentFlow)
          setStep([2, 'baremetal'])
        }
        break
      case 2:
        if (flowType === 'baremetal') {
          setActiveDeploymentStep(2)
        }
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

    const deployedXNode = deployedXNodes?.find(
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

  function onFlowOpenToggle(newVal: boolean) {
    if (newVal === true) {
      setFlowOpen(newVal)
      return
    }
    setFlowOpen(newVal)
    setStep([0, undefined])
    setActiveDeploymentStep(1)
    setFlowType(undefined)
  }

  return (
    <AlertDialog open={flowOpen} onOpenChange={onFlowOpenToggle}>
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
            {step[0] === 2 && step[1] === 'baremetal'
              ? 'Check configuration'
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
            {step[0] === 2 && step[1] === 'baremetal'
              ? `Check your deployment configuration for your ${type === 'templates' ? 'template' : 'use case'}.`
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
                    Xnode DVM{' '}
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
                <h3 className="text-xl font-semibold">Xnode DVM</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Activate a powerful VPS with Xnode DVM. Use it as a
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
                earn $OPEN rewards.
              </p>
            </RadioGroupCard>
          </RadioGroup>
        ) : null}
        {(step[0] === 1 && step[1] === 'xnode-current') ||
        (step[0] > 1 && step[1] === 'baremetal') ? (
          <div className="isolate mt-2 flex justify-center">
            <div className="flex min-w-44 flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border-2 border-primary transition-colors',
                  activeDeploymentStep > 1
                    ? 'bg-primary'
                    : 'border-primary/25 bg-background'
                )}
              >
                {step[1] === 'xnode-current' && activeDeploymentStep === 1 ? (
                  <RotateCw className="size-5 animate-spin text-primary" />
                ) : null}
                {step[1] === 'baremetal' && activeDeploymentStep === 1 ? (
                  <span className="size-3 animate-pulse rounded-full bg-primary" />
                ) : null}
                {activeDeploymentStep > 1 ? (
                  <Check className="size-6 text-background" />
                ) : null}
              </div>
              <p>{deploymentSteps?.[0]}</p>
            </div>
            <div
              className={cn(
                '-z-10 -mx-20 mt-5 h-0.5 w-56',
                activeDeploymentStep >= 2 ? 'bg-primary' : 'bg-primary/25'
              )}
            />
            <div className="flex min-w-44 flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border-2 border-primary transition-colors',
                  activeDeploymentStep > 2
                    ? 'bg-primary'
                    : 'border-primary/25 bg-background'
                )}
              >
                {step[1] === 'xnode-current' && activeDeploymentStep === 2 ? (
                  <RotateCw className="size-5 animate-spin text-primary" />
                ) : null}
                {step[1] === 'baremetal' && activeDeploymentStep === 2 ? (
                  <span className="size-3 animate-pulse rounded-full bg-primary" />
                ) : null}
                {activeDeploymentStep > 2 ? (
                  <Check className="size-6 text-background" />
                ) : null}
              </div>
              <p>{deploymentSteps?.[1]}</p>
            </div>
            <div
              className={cn(
                '-z-10 -mx-20 mt-5 h-0.5 w-56',
                activeDeploymentStep === 3 ? 'bg-primary' : 'bg-primary/25'
              )}
            />
            <div className="flex min-w-44 flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border-2 border-primary/25 bg-background transition-colors'
                )}
              >
                {activeDeploymentStep === 3 ? (
                  <RotateCw className="size-5 animate-spin text-primary" />
                ) : null}
              </div>
              <p>{deploymentSteps?.[2]}</p>
            </div>
          </div>
        ) : null}
        {step[0] === 1 && step[1] === 'xnode-current' ? (
          <div>
            {activeDeploymentStep === 1 ? (
              <div className="mb-4 mt-8">
                <p className="rounded border bg-muted-foreground px-3 py-1.5 font-mono text-muted">
                  <span className="opacity-75">
                    [{format(new Date(), 'HH:mm:ss')}]
                  </span>{' '}
                  Transferring all the deployment information to your Xnode
                  server...
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
                    src={`${prefix}/images/xnode-card/silvercard-front.webp`}
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
                  Contacting Xnode server to start off your deployment
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
                  Your deployment is now running. This process might take some
                  time to finish.
                </p>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Estimated time
                </p>
                <p className="text-center text-3xl font-bold">
                  {deployedXNodes?.find(
                    (xNode) => xNode.deploymentAuth === selectedXNode
                  )
                    ? '1 Minute'
                    : '10 Minutes'}{' '}
                </p>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  To check back on the status, navigate to your deployments
                  page.
                </p>
              </>
            ) : null}
          </div>
        ) : null}
        {step[0] === 1 && step[1] === 'baremetal' ? (
          <DeploymentProvider specs={specs} onSelect={handleNextStep} />
        ) : null}
        {step[0] === 2 &&
        step[1] === 'baremetal' &&
        activeDeploymentStep === 1 ? (
          <div className="mt-4">
            <div className="flex items-center gap-6">
              <p>{config.provider}</p>
              <h4 className="text-2xl font-bold">{config.name}</h4>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {config.location}
            </div>
            <div className="mt-2">
              {selectedBaremetalServer ? (
                <p className="text-muted-foreground">{baremetalConfig}</p>
              ) : (
                <Skeleton className="h-7 w-48" />
              )}
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="flex size-5 items-center justify-center rounded-full bg-green-600">
                  <Check className="size-3.5 text-background" />
                </div>
                <p>No license</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex size-5 items-center justify-center rounded-full bg-green-600">
                  <Check className="size-3.5 text-background" />
                </div>
                <p>Connect to all our apps</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex size-5 items-center justify-center rounded-full bg-green-600">
                  <Check className="size-3.5 text-background" />
                </div>
                <p>No hidden setup fees</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="text-sm font-medium">Estimated monthly price</p>
              {selectedBaremetalServer ? (
                <>
                  <p className="mt-1 text-5xl font-bold text-primary">
                    $
                    {selectedBaremetalServer.priceSale ??
                      selectedBaremetalServer.priceMonth}
                    <span className="text-2xl">/mo</span>
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    or ~{selectedBaremetalServer.priceHour}/hour
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className="mt-1 h-12 w-20" />
                  <Skeleton className="mt-0.5 h-5 w-16" />
                </>
              )}
            </div>
            <div className="flex justify-end">
              <p className="-mb-4 min-w-40 text-center text-primary">
                $200 Cashback
              </p>
            </div>
          </div>
        ) : null}
        {step[0] === 2 &&
        step[1] === 'baremetal' &&
        activeDeploymentStep === 2 ? (
          <div className="mt-4">
            <h4 className="text-2xl font-bold">Setup your server</h4>
            <p className="text-muted-foreground">
              To setup your baremetal server, you first need to connect to the
              provider through an API key.
            </p>
            <p className="mt-2">
              {config.name}
              {selectedBaremetalServer
                ? ` | $${selectedBaremetalServer.priceSale ?? selectedBaremetalServer.priceMonth}/mo`
                : null}
            </p>
            <div
              className={cn(
                'mt-2 flex flex-col rounded border p-4',
                // TODO: Reactivate once we allow for baremetal deployments
                'pointer-events-none border-destructive opacity-50'
              )}
            >
              {/* TODO: Reactivate once we allow for baremetal deployments */}
              <p className="mb-4 font-semibold uppercase text-destructive">
                coming soon
              </p>
              <p className="text-lg font-semibold">{config.provider}</p>
              <div className="mt-2 space-y-0.5">
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" name="apiKey" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Don&apos;t have an API key yet?{' '}
                <Link href="#" className="underline underline-offset-2">
                  Get one here.
                </Link>
              </p>
            </div>
          </div>
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
            {step[0] >= 1 ? 'Close' : null}
          </AlertDialogCancel>
          {step[0] === 0 ? (
            <Button
              disabled={flowType === undefined}
              size="lg"
              className="h-10 min-w-40"
              onClick={handleNextStep}
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
            <Link
              href={`/xnode?uuid=${deployedXNodes?.find(({ deploymentAuth }) => deploymentAuth === selectedXNode)?.id}`}
            >
              <Button size="lg" className="h-10 min-w-40">
                Go to Deployment
              </Button>
            </Link>
          ) : null}
          {step[0] === 2 && step[1] === 'baremetal' ? (
            <Button
              size="lg"
              className="h-10 min-w-40"
              onClick={handleNextStep}
              // TODO: Reactivate once we allow for baremetal deployments
              disabled={activeDeploymentStep === 2}
            >
              {activeDeploymentStep === 1 ? 'Deploy' : null}
              {activeDeploymentStep === 2 ? 'Connect' : null}
            </Button>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
