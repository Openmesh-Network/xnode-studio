'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'
import { Cloud, EllipsisVertical, Star } from 'lucide-react'

import { type ServiceData } from '@/types/dataProvider'
import { type Xnode } from '@/types/node'
import { cn, formatXNodeName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Icons } from '@/components/Icons'

import { useXnodes } from '../dashboard/health-data'

type DeploymentItemProps = {
  xNode: Xnode
  services: ServiceData[]
}
function DeploymentItem({ xNode, services }: DeploymentItemProps) {
  return (
    <Link
      href={`/xnode?uuid=${xNode.id}`}
      className="hover:bg-muted/50 flex h-16 items-center gap-6 rounded border px-6 py-3 transition-colors"
    >
      <p className="text-muted-foreground text-sm">
        {formatDistanceToNowStrict(xNode.unitClaimTime)} ago
      </p>
      <div className="flex basis-2/12 items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  'bg-primary size-2.5 rounded-full hover:animate-pulse',
                  xNode.status !== 'online' && 'bg-orange-500',
                  xNode.status === 'booting' && 'bg-destructive'
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-muted-foreground text-sm">Server Status</p>
              <p className="font-semibold capitalize">{xNode.status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h3 className="text-lg font-semibold">
          {xNode.isUnit
            ? formatXNodeName(xNode.deploymentAuth)
            : `Xnode ${xNode.id}`}
        </h3>
      </div>
      <div className="text-muted-foreground basis-1/12 space-y-1">
        <p className="text-xs font-medium">Installation</p>
        <div className="flex items-center gap-1">
          <Icons.XNodeIcon className="size-4" />
          <Cloud className="size-4" />
        </div>
      </div>
      <div className="text-muted-foreground basis-4/12 space-y-1">
        <p className="text-xs font-medium">Services</p>
        <div className="flex items-center gap-1">
          {services.slice(0, 3).map((service) => (
            <span
              key={`${xNode.id}-service-${service.nixName}`}
              className="bg-primary/10 text-foreground flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium"
            >
              {service.logo ? (
                <img
                  src={service.logo}
                  alt={`${service.nixName} logo`}
                  width={16}
                  height={16}
                />
              ) : null}
              {service.name ?? service.nixName}
            </span>
          ))}
          {services.length > 3 ? (
            <span
              key={`${xNode.id}-more-services`}
              className="bg-primary/10 text-foreground flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium"
            >
              +{services.length - 3}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex grow items-center justify-end">
        <Button disabled variant="ghost" size="icon">
          <span className="sr-only">Mark as favourite</span>
          <Star className="text-muted-foreground size-5" />
        </Button>
        <Button disabled variant="ghost" size="icon">
          <span className="sr-only">More</span>
          <EllipsisVertical className="text-muted-foreground size-5" />
        </Button>
      </div>
    </Link>
  )
}

type DeploymentsListProps = {
  sessionToken: string
}
export default function DeploymentsList({
  sessionToken,
}: DeploymentsListProps) {
  const { data: xNodes, isPending } = useXnodes(sessionToken)

  const services = useMemo(() => {
    const allServices: Map<Xnode['id'], ServiceData[]> = new Map()
    if (isPending || !xNodes) return allServices
    for (const xNode of xNodes) {
      const services = JSON.parse(
        Buffer.from(xNode.services, 'base64').toString('utf-8')
      )['services'] as ServiceData[]
      allServices.set(xNode.id, services)
    }
    return allServices
  }, [isPending, xNodes])

  return (
    <div className="flex flex-col gap-3">
      {isPending
        ? Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={`deployment-placeholder-${index}`}
              className="h-16 border"
            />
          ))
        : xNodes?.map((xNode) => (
            <DeploymentItem
              key={xNode.deploymentAuth}
              xNode={xNode}
              services={services.get(xNode.id) ?? []}
            />
          ))}
    </div>
  )
}
