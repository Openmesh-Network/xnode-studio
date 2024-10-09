'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Cloud, EllipsisVertical, Hourglass, Star } from 'lucide-react'

import { type ServiceData } from '@/types/dataProvider'
import { type Xnode } from '@/types/node'
import { formatXNodeName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/Icons'

import { useXnodes } from '../dashboard/health-data'

type DeploymentsListProps = {
  sessionToken: string
}
export default function DeploymentsList({
  sessionToken,
}: DeploymentsListProps) {
  const { data: xNodes, isPending } = useXnodes(sessionToken)

  const services = useMemo(() => {
    const allServices: Map<Xnode['id'], ServiceData[]> = new Map()
    if (isPending) return allServices
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
        : xNodes.map((xNode, index) => (
            <Link
              key={xNode.deploymentAuth}
              href={`/xnode?uuid=${xNode.id}`}
              className="flex h-16 items-center gap-6 rounded border px-6 py-3 transition-colors hover:bg-muted/50"
            >
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(xNode.unitClaimTime)} ago
              </p>
              <h3 className="basis-2/12 text-lg font-semibold">
                {xNode.isUnit
                  ? formatXNodeName(xNode.deploymentAuth)
                  : `Xnode ${index}`}
              </h3>
              <div className="basis-2/12 space-y-1 text-muted-foreground">
                <p className="text-xs font-medium">Installation</p>
                <div className="flex items-center gap-1">
                  <Icons.XNodeIcon className="size-4" />
                  <Cloud className="size-4" />
                </div>
              </div>
              <div className="basis-2/12 space-y-1 text-muted-foreground">
                <p className="text-xs font-medium">Services</p>
                <div className="flex items-center gap-1">
                  {services.get(xNode.id) !== null ? (
                    services.get(xNode.id).map((service) => (
                      <span
                        key={`${xNode.id}-service-${service.nixName}`}
                        className="flex items-center gap-1.5 rounded bg-primary/10 px-2 py-1 text-xs font-medium text-foreground"
                      >
                        {service.logo ? (
                          <img
                            src={service.logo}
                            alt={`${service.name} logo`}
                            width={16}
                            height={16}
                          />
                        ) : null}
                        {service.name}
                      </span>
                    ))
                  ) : (
                    <Hourglass className="size-4" />
                  )}
                </div>
              </div>
              <div className="flex grow items-center justify-end">
                <Button disabled variant="ghost" size="icon">
                  <span className="sr-only">Mark as favourite</span>
                  <Star className="size-5 text-muted-foreground" />
                </Button>
                <Button disabled variant="ghost" size="icon">
                  <span className="sr-only">More</span>
                  <EllipsisVertical className="size-5 text-muted-foreground" />
                </Button>
              </div>
            </Link>
          ))}
    </div>
  )
}
