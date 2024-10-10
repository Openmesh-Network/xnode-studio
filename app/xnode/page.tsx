'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'

import 'react-toastify/dist/ReactToastify.css'

import Image from 'next/image'
import stackIcon from '@/assets/stack.svg'
import { servicesCompressedForAdmin } from '@/utils/xnode'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { addYears, formatDistanceToNowStrict } from 'date-fns'
import { useUser } from 'hooks/useUser'
import { HelpCircle } from 'lucide-react'

import { ServiceData, XnodeConfig } from '@/types/dataProvider'
import { opensshConfig } from '@/config/openssh'
import { cn, formatXNodeName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

const XnodeMeasurement = ({
  name,
  unit,
  isAvailable,
  used,
  available,
  usedPercent,
}: {
  used: number
  available: number
  usedPercent: number
  unit: string
  name: string
  isAvailable: boolean
}) => {
  const upperCaseFirstLetter = (str: string) => {
    let newStr = ''

    newStr += str[0].toUpperCase()
    newStr += str.slice(1, str.length)
    return newStr
  }

  return (
    <div className="flex-1">
      <p className="font-medium"> {upperCaseFirstLetter(name)} </p>
      <div className="flex w-full">
        {/* TODO: Add icon */}
        <div className="mr-2 size-10">
          <Image src={stackIcon} alt={'Stack icon'} />
        </div>

        <div className="flex min-h-5 flex-1 bg-gray-200 align-middle">
          {isAvailable ? (
            <>
              <div
                className="h-full bg-blue-500"
                style={{ width: usedPercent + '%' }}
              ></div>

              <div className="w-fit p-2">
                <p> {available + unit + ' '} left </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-fit p-2">
                <p> No {name} data available. </p>
              </div>
            </>
          )}
        </div>
      </div>
      {isAvailable && <p className="ml-12"> {used + unit} </p>}
    </div>
  )
}

export default function XnodePage({ searchParams }: XnodePageProps) {
  const xNodeId = z.coerce.string().parse(searchParams.uuid)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const {
    data: xNode,
    isPending,
    dataUpdatedAt,
    refetch,
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

  const [serviceChanges, setServiceChanges] = useState<ServiceData[] | null>()

  const [user] = useUser()
  const [userData, setUserData] = useState<ServiceData>(sshUserData('')) // Always relates to the xnode user for now.

  const updateServices = useCallback(() => {}, [])

  const updateChanges = async () => {
    let newServices = servicesCompressedForAdmin(services.services)

    if (
      userData?.options?.find(
        (option) => option.nixName == 'openssh.authorizedKeys.keys'
      ).value != '[]'
    ) {
      newServices.push(opensshConfig as ServiceData)
    }

    console.log('Final services: ', newServices)

    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/pushXnodeServices`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'X-Parse-Session-Token': user.sessionToken,
        'Content-Type': 'application/json',
      },
      data: {
        id: xNodeId,
        services: Buffer.from(
          JSON.stringify({
            services: newServices,
            'users.users': [userData],
          })
        ).toString('base64'),
      },
    }
    try {
      const response = await axios(config)
      console.log(response)
      setIsLoading(true)
    } catch (error) {
      toast.error(`Error updating the Xnode services: ${error}`)
      setIsLoading(false)
    }
  }

  async function allowUpdate() {
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

  function round(x: number) {
    return Math.floor(x * 100) / 100
  }

  return (
    <div className="container my-12 max-w-none">
      {isPending ? (
        <div></div>
      ) : user?.sessionToken ? (
        <>
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
                  onClick={() => allowUpdate()}
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
                  })}{' '}
                </span>
              </div>
            )}
          </div>
          <div className="mt-6 rounded border p-6">
            <h2 className="text-xl font-bold">Resources</h2>
            <p className="text-xs text-muted-foreground">
              Last updated {lastUpdated} ago
            </p>
            <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 p-4">
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
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 p-4">
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
              <div className="flex flex-col items-center gap-4 rounded border bg-muted/50 p-4">
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
          <div className="mt-3 h-fit w-full border p-8 shadow-md">
            <ServiceEditor
              startingServices={services.services}
              updateServices={setServiceChanges}
            />
          </div>
          <div className="mt-3 h-fit w-full border p-8 shadow-md">
            <ServiceAccess
              currentService={services.services}
              ip={xNode.ipAddress}
              startingUserData={userData}
              updatedUserData={setUserData}
            />
          </div>
          <div className="mt-3 h-fit w-full border p-8 shadow-md">
            <p>Actions</p>
            <div className="flex">
              <Button
                onClick={() => {
                  updateChanges()
                }}
              >
                {' '}
                Push changes{' '}
              </Button>
              <Button
                onClick={() => {
                  allowUpdate()
                }}
              >
                {' '}
                Force update{' '}
              </Button>
            </div>
          </div>
        </>
      ) : (
        !isLoading && <Signup />
      )}
    </div>
  )
}
