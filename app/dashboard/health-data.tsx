'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  CalendarDays,
  Cpu,
  HardDrive,
  Hourglass,
  MemoryStick,
} from 'lucide-react'
import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'

import { Xnode, type HeartbeatData } from '@/types/node'
import { formatXNodeName } from '@/lib/utils'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function useXnodes(sessionToken: string) {
  return useQuery<Xnode[]>({
    queryKey: ['xnodes', sessionToken],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnodes`,
        {
          method: 'GET',
          headers: {
            'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
            'X-Parse-Session-Token': sessionToken,
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json()),
    refetchInterval: 30 * 1000,
  })
}

type HealthSummary = {
  cpu: number
  ram: number
  storage: number
}

type HealthSummaryItemProps = {
  type: 'cpu' | 'ram' | 'storage'
  healthData: number
}
function HealthSummaryItem({ type, healthData }: HealthSummaryItemProps) {
  const chartData = [
    {
      name: type,
      data: healthData,
      fill: 'hsl(var(--primary))',
    },
  ]

  const chartConfig = {
    data: {
      label: type.toUpperCase(),
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="size-64 min-h-48">
      <RadialBarChart
        accessibilityLayer
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={90}
        outerRadius={110}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[94, 86]}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <RadialBar dataKey="data" cornerRadius={2} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-mono text-4xl font-bold"
                    >
                      {chartData[0].data.toLocaleString('en-US', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                      %
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 26}
                      className="fill-muted-foreground uppercase"
                    >
                      {type}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}

type HealthComponentProps = {
  sessionToken: string
}
export function HealthSummary({ sessionToken }: HealthComponentProps) {
  const { data: xNodes, isPending } = useXnodes(sessionToken)
  const healthSummaryData = useMemo<HealthSummary | null>(() => {
    if (isPending) return null
    let avgHealth: Pick<
      HeartbeatData,
      | 'cpuPercent'
      | 'ramMbUsed'
      | 'ramMbTotal'
      | 'storageMbUsed'
      | 'storageMbTotal'
    > = {
      cpuPercent: 0,
      ramMbUsed: 0,
      ramMbTotal: 0,
      storageMbUsed: 0,
      storageMbTotal: 0,
    }

    for (const xNode of xNodes) {
      const newData = JSON.parse(
        xNode.heartbeatData as any as string
      ) as HeartbeatData
      avgHealth = {
        cpuPercent: avgHealth.cpuPercent + newData.cpuPercent,
        ramMbUsed: avgHealth.ramMbUsed + newData.ramMbUsed,
        ramMbTotal: avgHealth.ramMbTotal + newData.ramMbTotal,
        storageMbUsed: avgHealth.storageMbUsed + newData.storageMbUsed,
        storageMbTotal: avgHealth.storageMbTotal + newData.storageMbTotal,
      }
    }
    avgHealth = {
      cpuPercent: avgHealth.cpuPercent / xNodes.length,
      ramMbUsed: avgHealth.ramMbUsed / xNodes.length,
      ramMbTotal: avgHealth.ramMbTotal + xNodes.length,
      storageMbUsed: avgHealth.storageMbUsed / xNodes.length,
      storageMbTotal: avgHealth.storageMbTotal / xNodes.length,
    }
    return {
      cpu: avgHealth.cpuPercent * 100,
      ram: (avgHealth.ramMbUsed / avgHealth.ramMbTotal) * 100,
      storage: (avgHealth.storageMbUsed / avgHealth.storageMbTotal) * 100,
    }
  }, [isPending, xNodes])

  return (
    <div className="grid grid-cols-4 gap-6">
      {healthSummaryData ? (
        <>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">CPU</h4>
            <p className="text-sm text-muted-foreground">
              Avg. CPU utilization
            </p>
            <HealthSummaryItem type="cpu" healthData={healthSummaryData.cpu} />
          </div>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">GPU</h4>
            <p className="text-sm text-muted-foreground">
              Avg. GPU utilization
            </p>
            <div className="m-8 flex size-48 flex-col items-center justify-center gap-1 rounded-full bg-background ring-8 ring-inset ring-muted">
              <Hourglass
                className="size-10 text-muted-foreground"
                strokeWidth={1.25}
              />
              <p className="font-mono text-xl font-bold">No Data</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">RAM</h4>
            <p className="text-sm text-muted-foreground">
              Avg. RAM utilization
            </p>
            <HealthSummaryItem type="ram" healthData={healthSummaryData.ram} />
          </div>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">Storage</h4>
            <p className="text-sm text-muted-foreground">
              Avg. Storage utilization
            </p>
            <HealthSummaryItem
              type="storage"
              healthData={healthSummaryData.storage}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

export function XNodesHealth({ sessionToken }: HealthComponentProps) {
  const { data: xNodes, isPending } = useXnodes(sessionToken)

  return (
    <div className="grid grid-cols-4 gap-6">
      {!isPending
        ? xNodes.map((xNode, index) => {
            const heartbeatData = JSON.parse(
              xNode.heartbeatData as any as string
            ) as HeartbeatData
            return (
              <div
                key={`xNode-deployment-${xNode.id}`}
                className="rounded border px-4 py-2.5"
              >
                <h3 className="text-lg font-bold">
                  {xNode.isUnit
                    ? formatXNodeName(xNode.deploymentAuth)
                    : `Xnode ${index}`}
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex w-full items-center gap-4">
                    <div className="flex shrink-0 basis-1/4 items-center gap-1 text-muted-foreground">
                      <Cpu className="size-4" />
                      <p className="text-sm">CPU</p>
                    </div>
                    <div className="relative grow">
                      <div className="h-2 w-full rounded bg-border" />
                      <div
                        className="absolute left-0 top-0 h-2 rounded bg-primary transition-all"
                        style={{
                          width: `${heartbeatData.cpuPercent * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-4">
                    <div className="flex shrink-0 basis-1/4 items-center gap-1 text-muted-foreground">
                      <MemoryStick className="size-4" />
                      <p className="text-sm">RAM</p>
                    </div>
                    <div className="relative grow">
                      <div className="h-2 w-full rounded bg-border" />
                      <div
                        className="absolute left-0 top-0 h-2 rounded bg-primary transition-all duration-300 ease-out"
                        style={{
                          width: `${(heartbeatData.ramMbUsed / heartbeatData.ramMbTotal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-4">
                    <div className="flex shrink-0 basis-1/4 items-center gap-1 text-muted-foreground">
                      <HardDrive className="size-4" />
                      <p className="text-sm">Storage</p>
                    </div>
                    <div className="relative grow">
                      <div className="h-2 w-full rounded bg-border" />
                      <div
                        className="absolute left-0 top-0 h-2 rounded bg-primary transition-all"
                        style={{
                          width: `${(heartbeatData.storageMbUsed / heartbeatData.storageMbTotal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <p className="text-xs">
                      {formatDistanceToNow(xNode.updatedAt)} ago
                    </p>
                  </div>
                  <Image
                    src="/images/xnode-card/silvercard-front.webp"
                    alt="Xnode Card"
                    width={48}
                    height={28}
                    className="rounded object-contain"
                  />
                </div>
              </div>
            )
          })
        : null}
    </div>
  )
}

export function XNodesApps({ sessionToken }: HealthComponentProps) {
  const { data: xNodes } = useXnodes(sessionToken)
  console.log(xNodes)

  return (
    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
    <Table className="w-full overflow-clip rounded">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead className="h-7">App Title</TableHead>
          <TableHead className="h-7">Node</TableHead>
          <TableHead className="h-7">Updated</TableHead>
          <TableHead className="h-7" />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={4}
            className="py-8 text-center font-semibold text-muted-foreground"
          >
            No apps currently running.
          </TableCell>
        </TableRow>
        {/* {xNodes.flatMap(({deploymentAuth, services}) => ([deploymentAuth])).map(
          <TableRow key={deploymentAuth}>
            {services}
          </TableRow>
        ))} */}
      </TableBody>
    </Table>
  )
}
