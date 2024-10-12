import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prefix } from '@/utils/prefix'
import { AppWindow, Cpu, HardDrive, MemoryStick } from 'lucide-react'
import { z } from 'zod'

import {
  getSpecsByTemplate,
  serviceByName,
  ServiceData,
  usecaseById,
  type AppStoreItem,
  type AppStorePageType,
  type Specs,
} from '@/types/dataProvider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { DeploymentContextProvider } from './deployment-context'
import DeploymentFlow from './deployment-flow'

type DeployPageProps = {
  searchParams: {
    templateId?: string
    useCaseId?: string
  }
}

export default function DeployPage({ searchParams }: DeployPageProps) {
  const sessionCookie = cookies().get('userSessionToken')
  if (!sessionCookie) redirect('/login')

  const templateId = z.string().optional().parse(searchParams.templateId)
  const useCaseId = z.string().optional().parse(searchParams.useCaseId)

  function getData() {
    if (!templateId && !useCaseId) redirect('/app-store')
    let data: AppStoreItem | undefined
    let specs: Specs | undefined
    let type: AppStorePageType | undefined
    let services: ServiceData[] | undefined
    if (useCaseId) {
      const useCase = usecaseById(useCaseId)
      if (useCase === undefined || useCase.implemented === false)
        redirect('/app-store')
      data = useCase
      specs = getSpecsByTemplate(useCase)
      services = useCase.serviceNames
        .map((service) => serviceByName(service))
        .filter((s) => s !== undefined)
      type = 'use-cases'
    }
    if (templateId) {
      const service = serviceByName(templateId)
      if (service === undefined || service.implemented === false)
        redirect('/app-store')
      data = { ...service, id: service.nixName }
      specs = service.specs
      services = [service]
      type = 'templates'
    }

    return { data, services, specs, type }
  }
  const { data, services, specs, type } = getData()

  if (data === undefined || type === undefined || services === undefined)
    redirect('/app-store')

  return (
    <DeploymentContextProvider
      initialData={{ name: data.name, description: data.desc, services }}
    >
      <div className="container my-8">
        <div className="flex items-center gap-2 text-muted-foreground/75">
          <Link href="/app-store">App Store</Link>
          <span>/</span>
          <span className="text-primary/75">{data.name}</span>
        </div>
        <section className="mt-8 flex justify-between gap-12">
          <div className="flex flex-1 flex-col rounded border p-6">
            <div className="flex flex-1 items-start gap-3">
              {data.logo && data.logo !== '' ? (
                <img
                  src={
                    data.logo.startsWith('https://')
                      ? data.logo
                      : `${prefix}${data.logo}`
                  }
                  alt={`${data.name} logo`}
                  width={48}
                  height={48}
                />
              ) : (
                <AppWindow
                  className="size-12 text-muted-foreground"
                  strokeWidth={1.5}
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-primary">{data.name}</h2>
                <p className="mt-2 line-clamp-2 max-w-prose text-muted-foreground">
                  {data.desc}
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <DeploymentFlow
                sessionToken={sessionCookie.value}
                item={data}
                type={type}
                specs={specs}
              />
              <Button
                disabled
                size="lg"
                className="h-10 min-w-40"
                variant="outlinePrimary"
              >
                Edit
              </Button>
            </div>
          </div>
          <div className="rounded border px-12 py-6">
            <h2>Minimum Requirements</h2>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <Cpu className="size-6 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">CPU</p>
                  <p className="font-mono leading-none">-</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MemoryStick className="size-6 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">RAM</p>
                  <p className="font-mono leading-none">
                    ~{Math.round((specs?.ram ?? 0) / 1024)} GB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <HardDrive className="size-6 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Storage</p>
                  <p className="font-mono leading-none">
                    ~{Math.round((specs?.storage ?? 0) / 1024)} GB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-12 rounded border p-6">
          <Tabs defaultValue="overview">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent hover:border-muted data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                disabled
                value="requirements"
                className="rounded-none border-b-2 border-transparent hover:border-muted data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Requirements
              </TabsTrigger>
              <TabsTrigger
                disabled
                value="documentation"
                className="rounded-none border-b-2 border-transparent hover:border-muted data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Documentation
              </TabsTrigger>
              <TabsTrigger
                disabled
                value="support"
                className="rounded-none border-b-2 border-transparent hover:border-muted data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Support
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-muted-foreground">
              {data.desc}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </DeploymentContextProvider>
  )
}
