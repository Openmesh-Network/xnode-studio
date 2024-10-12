'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { servicesCompressedForAdmin } from '@/utils/xnode'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { addYears, formatDistanceToNowStrict } from 'date-fns'
import { useUser } from 'hooks/useUser'
import {
  ChevronRight,
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
import { Skeleton } from '@/components/ui/skeleton'
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
import { sshUserData } from '@/components/Deployments/serviceAccess'
import Signup from '@/components/Signup'

import { Xnode } from '../../types/node'
import { HealthChartItem } from '../dashboard/health-data'

type XnodePageProps = {
  xNodeId: string
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

type ServiceOptionRowProps = {
  option: ServiceOption
  value?: (
    option: ServiceOption['nixName'],
    parentOption?: ServiceOption['nixName']
  ) => ServiceOption['value']
  onUpdate: (
    newVal: ServiceOption['value'],
    option: ServiceOption['nixName'],
    parentOption?: ServiceOption['nixName']
  ) => void
  canReset: (option: ServiceOption['nixName']) => boolean
  onReset: (
    option: ServiceOption['nixName'],
    parentOption?: ServiceOption['nixName']
  ) => void
  parentOption?: ServiceOption['nixName']
}
function ServiceOptionRow({
  option,
  value,
  onUpdate,
  canReset,
  onReset,
  parentOption,
}: ServiceOptionRowProps) {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <>
      <TableRow key={option.nixName}>
        <TableCell
          className={cn(option.options && 'font-bold', parentOption && 'pl-6')}
          colSpan={option.options?.length ? 3 : 1}
        >
          <span className="inline-flex items-center gap-2.5">
            {option.options?.length ? (
              <Button size="iconSm" className="size-6" variant="outline">
                <span className="sr-only">
                  {collapsed ? 'Expand' : 'Collapse'}
                </span>
                <ChevronRight
                  className={cn(
                    'size-3.5 transition-transform',
                    collapsed ? 'rotate-0' : 'rotate-90'
                  )}
                  onClick={() => setCollapsed(!collapsed)}
                />
              </Button>
            ) : null}
            {option.name ?? option.nixName}
          </span>
        </TableCell>
        {/* <TableCell>{option.desc}</TableCell> */}
        {!option.options?.length ? (
          <>
            <ServiceOptionInput
              value={value ? value(option.nixName, parentOption) : option.value}
              option={option}
              updateOption={(newVal) =>
                onUpdate(newVal, option.nixName, parentOption)
              }
            />
            <TableCell>
              <span className="flex justify-end">
                <Button
                  disabled={canReset(option.nixName)}
                  size="iconSm"
                  variant="outline"
                  onClick={() => onReset(option.nixName, parentOption)}
                >
                  <RefreshCcw className="size-3.5" />
                </Button>
              </span>
            </TableCell>
          </>
        ) : null}
      </TableRow>
      {!collapsed &&
        option.options?.map((subOption) => (
          <ServiceOptionRow
            key={`${option.nixName}-${subOption.nixName}`}
            value={value}
            option={subOption}
            onUpdate={onUpdate}
            canReset={canReset}
            onReset={onReset}
            parentOption={option.nixName}
          />
        ))}
    </>
  )
}

export default function XNodeDashboard({ xNodeId }: XnodePageProps) {
  const [user] = useUser()

  const {
    data: xNode,
    isSuccess,
    isLoading,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQuery<Xnode>({
    queryKey: ['xnodes', xNodeId],
    queryFn: async () => {
      if (!user?.sessionToken) return null
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
    enabled: !!user?.sessionToken,
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

  const [userData, setUserData] = useState<ServiceData>(sshUserData('')) // Always relates to the xnode user for now.

  const [openSshKeysOpen, setOpenSshKeysOpen] = useState(false)
  const [editService, setEditService] = useState<ServiceData['nixName'] | null>(
    null
  )
  const serviceInEdit = useMemo<ServiceData | null>(() => {
    if (!editService || !services) return null
    return (
      services.services.find((service) => service.nixName === editService) ??
      null
    )
  }, [editService, services])
  const [deleteServiceOpen, setDeleteServiceOpen] = useState<
    ServiceData['nixName'] | null
  >(null)

  const updateServices = useCallback(async () => {
    if (!services?.services || !user?.sessionToken) return
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
    await refetch()
  }, [
    refetch,
    serviceChanges,
    services?.services,
    user?.sessionToken,
    userData,
    xNodeId,
  ])

  const deleteService = useCallback(async () => {
    if (!services?.services || !user?.sessionToken) return
    const servicesWithChanges = services.services.filter(
      (service) => service.nixName !== deleteServiceOpen
    )
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
    if (!servicesWithChanges || !user?.sessionToken) return
    servicesWithChanges.push(opensshConfig)
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
    await refetch()
  }, [refetch, services?.services, user?.sessionToken, userData, xNodeId])

  async function updateXNode() {
    if (!user?.sessionToken || !xNode) return
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
      {isLoading ? (
        <div>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-2 h-9 w-64" />
          <div className="flex gap-2">
            <Skeleton className="mt-2 h-7 w-24" />
            <Skeleton className="mt-2 h-7 w-80" />
          </div>
          <div className="mt-6 rounded border p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Skeleton className="h-6 w-28" />
                <Skeleton className="mt-1 h-4 w-40" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
          <div className="mt-6 rounded border p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Skeleton className="h-6 w-28" />
                <Skeleton className="mt-1 h-4 w-40" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <span />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-5 w-32" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-5 w-32" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-5 w-32" />
                  </TableHead>
                  <TableHead>
                    <span />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="size-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex gap-2">
                        <Skeleton className="size-4" />
                        <Skeleton className="size-4" />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : null}
      {isSuccess && user?.sessionToken ? (
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
                          disabled={
                            serviceInEdit
                              ? !changedOptions[serviceInEdit.nixName]
                              : true
                          }
                          size="sm"
                          variant="outlinePrimary"
                          className="h-7 gap-1"
                          onClick={() => {
                            setServiceChanges((prev) => {
                              if (!serviceInEdit) return prev
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
                      <ServiceOptionRow
                        key={option.nixName}
                        option={option}
                        value={(nixName, parentOption) => {
                          return parentOption
                            ? serviceChanges
                                .get(serviceInEdit.nixName)
                                ?.find((opt) => opt.nixName === parentOption)
                                ?.options?.find(
                                  (opt) => opt.nixName === nixName
                                )?.value
                            : serviceChanges
                                .get(serviceInEdit.nixName)
                                ?.find((opt) => opt.nixName === nixName)?.value
                        }}
                        onUpdate={(newVal, currentOption, parentOption) => {
                          setServiceChanges((prev) => {
                            const newMap = new Map(prev)
                            const existingChanges = newMap.get(
                              serviceInEdit.nixName
                            )
                            const newChanges = (
                              existingChanges ?? serviceInEdit.options
                            )?.map((opt) => {
                              if (
                                opt.nixName === (parentOption ?? currentOption)
                              ) {
                                if (parentOption && opt.options) {
                                  opt.options = opt.options.map((subOpt) =>
                                    subOpt.nixName === currentOption
                                      ? { ...subOpt, value: newVal }
                                      : subOpt
                                  )
                                } else {
                                  return { ...opt, value: newVal }
                                }
                              }
                              return opt
                            })
                            newMap.set(serviceInEdit.nixName, newChanges)
                            return newMap
                          })
                        }}
                        canReset={(nixName) =>
                          !changedOptions[serviceInEdit.nixName]?.includes(
                            nixName
                          )
                        }
                        onReset={(option, parentOption) => {
                          setServiceChanges((prev) => {
                            const newMap = new Map(prev)
                            const existingChanges = newMap.get(
                              serviceInEdit.nixName
                            )
                            const newChanges = (
                              existingChanges ?? serviceInEdit.options
                            )?.map((opt) => {
                              if (opt.nixName === (parentOption ?? option)) {
                                if (parentOption && opt.options) {
                                  opt.options = opt.options.map((subOpt) =>
                                    subOpt.nixName === option
                                      ? {
                                          ...subOpt,
                                          value: defaultOptions.get(
                                            `${serviceInEdit.nixName}_${option}`
                                          ),
                                        }
                                      : subOpt
                                  )
                                } else {
                                  return {
                                    ...opt,
                                    value: defaultOptions.get(
                                      `${serviceInEdit.nixName}_${option}`
                                    ),
                                  }
                                }
                              }
                              return opt
                            })
                            newMap.set(serviceInEdit.nixName, newChanges)
                            return newMap
                          })
                        }}
                      />
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
                  healthData={xNode.heartbeatData?.cpuPercent ?? 0}
                />
              </div>
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 px-4 py-2.5">
                <div className="text-center">
                  <p className="font-bold">RAM</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(
                      ((xNode.heartbeatData?.ramMbUsed ?? 0) / 1024) * 100
                    ) / 100}
                    GB/
                    {Math.round(
                      ((xNode.heartbeatData?.ramMbTotal ?? 0) / 1024) * 100
                    ) / 100}
                    GB
                  </p>
                </div>
                <HealthChartItem
                  className="size-48"
                  type="ram"
                  healthData={
                    ((xNode.heartbeatData?.ramMbUsed ?? 0) /
                      (xNode.heartbeatData?.ramMbTotal ?? 1)) *
                    100
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 px-4 py-2.5">
                <div className="text-center">
                  <p className="font-bold">CPU</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(
                      ((xNode.heartbeatData?.storageMbUsed ?? 0) / 1024) * 100
                    ) / 100}
                    GB/
                    {Math.round(
                      ((xNode.heartbeatData?.storageMbTotal ?? 1) / 1024) * 100
                    ) / 100}
                    GB
                  </p>
                </div>
                <HealthChartItem
                  className="size-48"
                  type="storage"
                  healthData={
                    ((xNode.heartbeatData?.storageMbUsed ?? 0) /
                      (xNode.heartbeatData?.storageMbTotal ?? 1)) *
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
      ) : null}
      {!isFetching && !isSuccess ? <Signup /> : null}
    </div>
  )
}
