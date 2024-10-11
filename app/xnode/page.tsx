'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'

import 'react-toastify/dist/ReactToastify.css'

import Link from 'next/link'
import { servicesCompressedForAdmin } from '@/utils/xnode'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { addYears, formatDistanceToNowStrict } from 'date-fns'
import { useUser } from 'hooks/useUser'
import {
  ExternalLink,
  HelpCircle,
  MoveRight,
  Pencil,
  RefreshCcw,
  Trash2,
} from 'lucide-react'

import {
  serviceByName,
  ServiceData,
  ServiceOption,
  XnodeConfig,
} from '@/types/dataProvider'
import { opensshConfig } from '@/config/openssh'
import { cn, formatXNodeName } from '@/lib/utils'
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
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import ServiceAccess, {
  sshUserData,
} from '@/components/Deployments/serviceAccess'
import ServiceEditor from '@/components/Deployments/serviceEditor'
import Signup from '@/components/Signup'

import { Xnode } from '../../types/node'
import { HealthChartItem } from '../dashboard/health-data'

type XnodePageProps = {
  searchParams: {
    uuid: string
  }
}

type ServiceOptionInputProps = {
  value: ServiceOption['value']
  option: ServiceOption
  updateOption: (newVal: ServiceOption['value']) => void
}
function ServiceOptionInput({
  value,
  option,
  updateOption,
}: ServiceOptionInputProps) {
  return (
    <TableCell>
      {option.type === 'string' ||
      (option.type !== 'boolean' && !option.type.includes('integer')) ? (
        <Input
          value={value}
          onChange={(e) => {
            const newVal = e.target.value
            updateOption(newVal.trim())
          }}
          className="h-8 px-2.5"
        />
      ) : null}
      {option.type === 'boolean' ? (
        <Checkbox
          checked={value === 'true'}
          onCheckedChange={(checked) => {
            const newVal = checked ? 'true' : 'false'
            updateOption(newVal.trim())
          }}
        />
      ) : null}
      {option.type.includes('integer') ? (
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const newVal = e.target.value
            updateOption(newVal.trim())
          }}
          className="h-8 px-2.5"
        />
      ) : null}
    </TableCell>
  )
}

export default function XnodePage({ searchParams }: XnodePageProps) {
  const xNodeId = z.coerce.string().parse(searchParams.uuid)

  const {
    data: xNode,
    isPending,
    isFetching,
    dataUpdatedAt,
    refetch,
    error,
  } = useQuery<Xnode>({
    queryKey: ['xnodes', xNodeId],
    queryFn: async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnode`,
        {
          method: 'POST',
          headers: {
            'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
            'X-Parse-Session-Token': user.sessionToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: xNodeId,
          }),
        }
      ).then((res) => res.json())
      return {
        ...data,
        heartbeatData:
          data.heartbeatData !== null
            ? JSON.parse(data.heartbeatData as any as string)
            : null,
      }
    },
    refetchInterval: 30 * 1000,
  })
  const [lastUpdated, setLastUpdated] = useState<string>('0 seconds')

  function reloadLastUpdated(updatedAt: number) {
    if (updatedAt === 0) return
    setLastUpdated(formatDistanceToNowStrict(updatedAt))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      reloadLastUpdated(dataUpdatedAt)
    }, 2.5 * 1000)
    return () => clearInterval(interval)
  }, [dataUpdatedAt])

  const services = useMemo<XnodeConfig | null>(() => {
    if (!xNode?.services) return null
    return JSON.parse(
      Buffer.from(xNode.services, 'base64').toString('utf-8')
    ) as XnodeConfig
  }, [xNode?.services])

  const [serviceChanges, setServiceChanges] = useState<
    Map<ServiceData['nixName'], ServiceOption[]>
  >(new Map())

  const defaultOptions = useMemo(() => {
    const defaultOptions = new Map<
      `${ServiceData['nixName']}_${ServiceOption['nixName']}`,
      ServiceOption['value']
    >()
    if (!services?.services) return defaultOptions
    const defaultServices = services?.services.map((service) =>
      serviceByName(service.nixName)
    )
    function getDefaultOptions(
      serviceName: ServiceData['nixName'],
      options: ServiceOption[]
    ) {
      for (const option of options) {
        if (option.options) {
          getDefaultOptions(serviceName, option.options)
        } else {
          defaultOptions.set(`${serviceName}_${option.nixName}`, option.value)
        }
      }
    }
    for (const service of defaultServices) {
      if (!service?.options) continue
      getDefaultOptions(service.nixName, service.options)
    }
    return defaultOptions
  }, [services?.services])

  const changedOptions = useMemo(() => {
    const changes: Record<ServiceData['nixName'], ServiceOption['nixName'][]> =
      {}
    if (!services?.services) return changes

    function addChanges(
      serviceName: ServiceData['nixName'],
      options: ServiceOption[]
    ) {
      for (const option of options) {
        if (option.options) {
          addChanges(serviceName, option.options)
        } else if (
          option.value !==
          defaultOptions.get(`${serviceName}_${option.nixName}`)
        ) {
          if (!changes[serviceName]) changes[serviceName] = []
          changes[serviceName].push(option.nixName)
        }
      }
    }
    for (const service of services?.services ?? []) {
      const options = serviceChanges.get(service.nixName) ?? service.options
      addChanges(service.nixName, options)
    }
    return changes
  }, [defaultOptions, serviceChanges, services?.services])

  const [user] = useUser()
  const [userData, setUserData] = useState<ServiceData>(sshUserData('')) // Always relates to the xnode user for now.

  const [openSshKeysOpen, setOpenSshKeysOpen] = useState(false)
  const [editService, setEditService] = useState<ServiceData['nixName'] | null>(
    null
  )
  const serviceInEdit = useMemo<ServiceData | null>(() => {
    if (!editService || !services) return null
    return services.services.find((service) => service.nixName === editService)
  }, [editService, services])
  const [deleteServiceOpen, setDeleteServiceOpen] = useState<
    ServiceData['nixName'] | null
  >(null)

  const updateServices = useCallback(async () => {
    const servicesWithChanges = services.services.map((service) => {
      const changes = serviceChanges.get(service.nixName)
      if (!changes) return service
      return {
        ...service,
        options: changes,
      }
    })
    const formattedServices = servicesCompressedForAdmin(servicesWithChanges)

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/pushXnodeServices`,
      {
        method: 'POST',
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: xNodeId,
          services: Buffer.from(
            JSON.stringify({
              services: formattedServices,
              'users.users': [userData],
            })
          ).toString('base64'),
        }),
      }
    )
  }, [
    serviceChanges,
    services?.services,
    user?.sessionToken,
    userData,
    xNodeId,
  ])

  const deleteService = useCallback(async () => {
    const servicesWithChanges = services?.services.filter(
      (service) => service.nixName !== deleteServiceOpen
    )
    const formattedServices = servicesCompressedForAdmin(servicesWithChanges)

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/pushXnodeServices`,
      {
        method: 'POST',
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user?.sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: xNodeId,
          services: Buffer.from(
            JSON.stringify({
              services: formattedServices,
              'users.users': [userData],
            })
          ).toString('base64'),
        }),
      }
    )
    setDeleteServiceOpen(null)
    refetch()
  }, [
    deleteServiceOpen,
    refetch,
    services?.services,
    user?.sessionToken,
    userData,
    xNodeId,
  ])

  const addOpenSSH = useCallback(async () => {
    let servicesWithChanges = services?.services
    if (!servicesWithChanges) return
    servicesWithChanges.push(opensshConfig)
    const formattedServices = servicesCompressedForAdmin(servicesWithChanges)

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/pushXnodeServices`,
      {
        method: 'POST',
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user?.sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: xNodeId,
          services: Buffer.from(
            JSON.stringify({
              services: formattedServices,
              'users.users': [userData],
            })
          ).toString('base64'),
        }),
      }
    )
    await refetch()
  }, [refetch, services?.services, user?.sessionToken, userData, xNodeId])

  async function updateXNode() {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/allowXnodeGenerationUpdate`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'X-Parse-Session-Token': user.sessionToken,
        'Content-Type': 'application/json',
      },
      data: {
        id: xNodeId,
        generation: xNode.updateGenerationWant + 1,
      },
    }

    await axios(config)
    await refetch()
  }

  return (
    <div className="container my-12 max-w-none">
      {isPending ? (
        <div></div>
      ) : user?.sessionToken && !error ? (
        <>
          <Dialog
            open={!!editService}
            onOpenChange={() => setEditService(null)}
          >
            <DialogContent className="max-w-screen-lg">
              <DialogHeader>
                <DialogTitle>
                  {serviceInEdit?.name ?? serviceInEdit?.nixName}
                </DialogTitle>
                <DialogDescription>
                  Edit the configuration of the selected service.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[32rem] overflow-y-auto">
                {/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
                <Table className="w-full overflow-clip rounded">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8">Name</TableHead>
                      {/* <TableHead className="h-8">Description</TableHead> */}
                      <TableHead className="h-8">Value</TableHead>
                      <TableHead className="h-8 w-16">
                        <Button
                          disabled={!changedOptions[serviceInEdit?.nixName]}
                          size="sm"
                          variant="outlinePrimary"
                          className="h-7 gap-1"
                          onClick={() => {
                            setServiceChanges((prev) => {
                              const newMap = new Map(prev)
                              const existingChanges = newMap.get(
                                serviceInEdit.nixName
                              )
                              const changedServiceOptions =
                                changedOptions[serviceInEdit.nixName]

                              const updateOptionsRecursively = (
                                options: ServiceOption[]
                              ) => {
                                return options.map((opt) => {
                                  if (opt.options) {
                                    opt.options = updateOptionsRecursively(
                                      opt.options
                                    )
                                    return opt
                                  }
                                  return changedServiceOptions.includes(
                                    opt.nixName
                                  )
                                    ? {
                                        ...opt,
                                        value: defaultOptions.get(
                                          `${serviceInEdit.nixName}_${opt.nixName}`
                                        ),
                                      }
                                    : opt
                                })
                              }

                              newMap.set(
                                serviceInEdit.nixName,
                                updateOptionsRecursively(
                                  existingChanges ?? serviceInEdit.options
                                )
                              )
                              return newMap
                            })
                          }}
                        >
                          <RefreshCcw className="size-3.5" />
                          Reset
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceInEdit?.options?.map((option) => (
                      <>
                        <TableRow key={option.nixName}>
                          <TableCell
                            className={cn(option.options && 'font-bold')}
                          >
                            {option.name ?? option.nixName}
                          </TableCell>
                          {/* <TableCell>{option.desc}</TableCell> */}
                          {!option.options?.length ? (
                            <>
                              <ServiceOptionInput
                                value={
                                  serviceChanges
                                    .get(serviceInEdit.nixName)
                                    ?.find(
                                      (opt) => opt.nixName === option.nixName
                                    )?.value ?? option.value
                                }
                                option={option}
                                updateOption={(newVal) => {
                                  setServiceChanges((prev) => {
                                    const newMap = new Map(prev)
                                    const existingChanges = newMap.get(
                                      serviceInEdit.nixName
                                    )
                                    newMap.set(
                                      serviceInEdit.nixName,
                                      (
                                        existingChanges ?? serviceInEdit.options
                                      )?.map((opt) =>
                                        opt.nixName === option.nixName
                                          ? { ...opt, value: newVal }
                                          : opt
                                      )
                                    )
                                    return newMap
                                  })
                                }}
                              />
                              <TableCell>
                                <span className="flex justify-end">
                                  <Button
                                    disabled={
                                      !changedOptions[
                                        serviceInEdit.nixName
                                      ]?.includes(option.nixName)
                                    }
                                    size="iconSm"
                                    variant="outline"
                                    onClick={() => {
                                      setServiceChanges((prev) => {
                                        const newMap = new Map(prev)
                                        const existingChanges = newMap.get(
                                          serviceInEdit.nixName
                                        )
                                        newMap.set(
                                          serviceInEdit.nixName,
                                          (
                                            existingChanges ??
                                            serviceInEdit.options
                                          )?.map((opt) =>
                                            opt.nixName === option.nixName
                                              ? {
                                                  ...opt,
                                                  value: defaultOptions.get(
                                                    `${serviceInEdit.nixName}_${option.nixName}`
                                                  ),
                                                }
                                              : opt
                                          )
                                        )
                                        return newMap
                                      })
                                    }}
                                  >
                                    <RefreshCcw className="size-3.5" />
                                  </Button>
                                </span>
                              </TableCell>
                            </>
                          ) : null}
                        </TableRow>
                        {option.options?.map((subOption) => (
                          <TableRow
                            key={`${option.nixName}-${subOption.nixName}`}
                          >
                            <TableCell className="pl-4">
                              <span className="inline-flex items-center gap-1">
                                <MoveRight className="size-3.5" />
                                {subOption.name ?? subOption.nixName}
                              </span>
                            </TableCell>
                            {/* <TableCell>{subOption.desc}</TableCell> */}
                            <ServiceOptionInput
                              value={
                                serviceChanges
                                  .get(serviceInEdit.nixName)
                                  ?.find(
                                    (opt) => opt.nixName === option.nixName
                                  )
                                  ?.options?.find(
                                    (opt) => opt.nixName === subOption.nixName
                                  )?.value ?? subOption.value
                              }
                              option={subOption}
                              updateOption={(newVal) => {
                                setServiceChanges((prev) => {
                                  const newMap = new Map(prev)
                                  const existingChanges = newMap.get(
                                    serviceInEdit.nixName
                                  )
                                  newMap.set(
                                    serviceInEdit.nixName,
                                    (
                                      existingChanges ?? serviceInEdit.options
                                    )?.map((opt) =>
                                      opt.nixName === option.nixName
                                        ? {
                                            ...opt,
                                            options: opt.options?.map(
                                              (subOpt) =>
                                                subOpt.nixName ===
                                                subOption.nixName
                                                  ? { ...subOpt, value: newVal }
                                                  : subOpt
                                            ),
                                          }
                                        : opt
                                    )
                                  )
                                  return newMap
                                })
                              }}
                            />
                            <TableCell>
                              <span className="flex justify-end">
                                <Button
                                  disabled={
                                    !changedOptions[
                                      serviceInEdit.nixName
                                    ]?.includes(subOption.nixName)
                                  }
                                  size="iconSm"
                                  variant="outline"
                                  onClick={() => {
                                    setServiceChanges((prev) => {
                                      const newMap = new Map(prev)
                                      const existingChanges = newMap.get(
                                        serviceInEdit.nixName
                                      )
                                      newMap.set(
                                        serviceInEdit.nixName,
                                        (
                                          existingChanges ??
                                          serviceInEdit.options
                                        )?.map((opt) =>
                                          opt.nixName === option.nixName
                                            ? {
                                                ...opt,
                                                options: opt.options?.map(
                                                  (subOpt) =>
                                                    subOpt.nixName ===
                                                    subOption.nixName
                                                      ? {
                                                          ...subOpt,
                                                          value:
                                                            defaultOptions.get(
                                                              `${serviceInEdit.nixName}_${subOption.nixName}`
                                                            ),
                                                        }
                                                      : subOpt
                                                ),
                                              }
                                            : opt
                                        )
                                      )
                                      return newMap
                                    })
                                  }}
                                >
                                  <RefreshCcw className="size-3.5" />
                                </Button>
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setEditService(null)
                  }}
                  className="min-w-28"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    setEditService(null)
                    updateServices()
                  }}
                  className="min-w-48"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog
            open={!!deleteServiceOpen}
            onOpenChange={() => setDeleteServiceOpen(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete {deleteServiceOpen}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and you will need to reinstall
                  the service if you want to use it again.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteService()}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
          {xNode.heartbeatData?.wantUpdate &&
          xNode.updateGenerationHave == xNode.updateGenerationWant &&
          xNode.status === 'online' ? (
            <div className="fixed inset-x-0 bottom-8 z-30 flex justify-center">
              <div className="flex flex-wrap items-center justify-between gap-12 rounded border border-primary bg-[color-mix(in_srgb,hsl(var(--background)),hsl(var(--primary))_5%)] px-6 py-4 shadow-xl">
                <div>
                  <p className="text-lg font-bold">Update available</p>
                  <p className="max-w-96 text-balance text-sm text-muted-foreground">
                    There is an update available for your Xnode. Please make
                    sure to keep everything up to date, by allowing updates.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="min-w-32"
                  onClick={() => updateXNode()}
                >
                  Update
                </Button>
              </div>
            </div>
          ) : null}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-start gap-0.5 font-medium text-muted-foreground">
                {xNode.isUnit
                  ? formatXNodeName(xNode.deploymentAuth)
                  : `Xnode ${xNode.id}`}
                <HelpCircle className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p className="text-base font-semibold">Xnode NFT</p>
                <p className="break-all text-muted-foreground">
                  {xNode.deploymentAuth}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-4xl font-bold">{xNode.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={cn(
                'rounded border border-orange-500/25 bg-orange-500/10 px-2.5 py-1 text-sm font-medium capitalize text-orange-500',
                xNode.status === 'online' &&
                  'border-green-600/25 bg-green-600/10 text-green-600',
                xNode.status === 'booting' &&
                  'border-destructive/25 bg-destructive/10 text-destructive',
                xNode.status === undefined && 'bg-muted text-foreground'
              )}
            >
              {xNode.status}
            </span>
            {xNode.isUnit && (
              <div className="flex gap-1.5 rounded border px-2.5 py-1 text-sm font-medium text-muted-foreground">
                <span>Remaining Xnode Time</span>
                <div className="my-0.5">
                  <Separator orientation="vertical" />
                </div>
                <span>
                  {formatDistanceToNowStrict(addYears(xNode.unitClaimTime, 1), {
                    unit: 'day',
                  })}
                </span>
              </div>
            )}
          </div>
          <div className="mt-6 rounded border px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Resources</h2>
                <p className="text-xs text-muted-foreground">
                  Last updated {lastUpdated} ago
                </p>
              </div>
              <Button
                disabled={isFetching}
                variant="outlinePrimary"
                onClick={() => updateXNode()}
              >
                Force Update
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 px-4 py-2.5">
                <div className="text-center">
                  <p className="font-bold">CPU</p>
                  <p className="text-sm text-muted-foreground">
                    Current CPU utilization
                  </p>
                </div>
                <HealthChartItem
                  className="size-48"
                  type="cpu"
                  healthData={xNode.heartbeatData?.cpuPercent}
                />
              </div>
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 px-4 py-2.5">
                <div className="text-center">
                  <p className="font-bold">RAM</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((xNode.heartbeatData?.ramMbUsed / 1024) * 100) /
                      100}
                    GB/
                    {Math.round(
                      (xNode.heartbeatData?.ramMbTotal / 1024) * 100
                    ) / 100}
                    GB
                  </p>
                </div>
                <HealthChartItem
                  className="size-48"
                  type="ram"
                  healthData={
                    (xNode.heartbeatData?.ramMbUsed /
                      xNode.heartbeatData?.ramMbTotal) *
                    100
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 px-4 py-2.5">
                <div className="text-center">
                  <p className="font-bold">CPU</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(
                      (xNode.heartbeatData?.storageMbUsed / 1024) * 100
                    ) / 100}
                    GB/
                    {Math.round(
                      (xNode.heartbeatData?.storageMbTotal / 1024) * 100
                    ) / 100}
                    GB
                  </p>
                </div>
                <HealthChartItem
                  className="size-48"
                  type="storage"
                  healthData={
                    (xNode.heartbeatData?.storageMbUsed /
                      xNode.heartbeatData?.storageMbTotal) *
                    100
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-6 rounded border px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Apps</h2>
                <p className="text-xs text-muted-foreground">
                  See and manage all the installed apps on your Xnode.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {services?.services.some(
                  ({ nixName }) => nixName === 'openssh'
                ) ? (
                  <Dialog
                    open={openSshKeysOpen}
                    onOpenChange={setOpenSshKeysOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit OpenSSH</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit OpenSSH</DialogTitle>
                        <DialogDescription>
                          Edit the whitelisted public keys for the OpenSSH
                          server.
                        </DialogDescription>
                        {/* TODO: render openssh keys */}
                        <DialogFooter>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setOpenSshKeysOpen(false)}
                            className="min-w-28"
                          >
                            Cancel
                          </Button>
                          <Button disabled size="lg" className="min-w-48">
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    disabled={isFetching}
                    variant="outline"
                    onClick={() => addOpenSSH()}
                  >
                    Add OpenSSH
                  </Button>
                )}
                <Link href="/app-store">
                  <Button variant="outlinePrimary">Add App</Button>
                </Link>
              </div>
            </div>
            {/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
            <Table className="mt-4 w-full overflow-clip rounded">
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="h-8">
                    <span className="sr-only">Open</span>
                  </TableHead>
                  <TableHead className="h-8">Name</TableHead>
                  <TableHead className="h-8">Description</TableHead>
                  <TableHead className="h-8">Tags</TableHead>
                  <TableHead className="h-8">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.services.map((service) => {
                  const servicePort = service.options?.find(
                    (option) => option.nixName === 'port'
                  )?.value
                  return (
                    <TableRow key={service.nixName}>
                      <TableCell>
                        <Link
                          href={`http://${xNode.ipAddress}:${servicePort}`}
                          aria-disabled={!servicePort}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        >
                          <span className="sr-only">Open</span>
                          <ExternalLink className="size-4 text-muted-foreground" />
                        </Link>
                      </TableCell>
                      <TableCell className="min-w-40">
                        <span
                          title={service.name ?? service.nixName}
                          className="truncate"
                        >
                          {service.name ?? service.nixName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block max-w-96 truncate">
                          {service.desc ?? '-'}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-56">
                        <span className="inline-flex items-center gap-1">
                          {service.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center justify-end gap-2">
                          <Button
                            size="iconSm"
                            variant="outline"
                            disabled={!service.options}
                            onClick={() => setEditService(service.nixName)}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            size="iconSm"
                            variant="outline"
                            onClick={() =>
                              setDeleteServiceOpen(service.nixName)
                            }
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        !isPending && <Signup />
      )}
    </div>
  )
}
