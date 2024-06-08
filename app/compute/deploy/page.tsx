import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/ui/header'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupCard } from '@/components/ui/radio-group'
import { Section } from '@/components/ui/section'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Icons } from '@/components/Icons'
import { DeployTable } from '@/app/compute/deploy/deploy-table'
import {
  NameDropdown,
  RegionDropdown,
  ZoneDropdown,
} from '@/app/compute/deploy/selects'

export default function ComputeDeploy() {
  return (
    <div>
      <Section className="flex gap-x-16 pb-12 pt-20">
        <div className="grow">
          <Header level={1} className="mb-6 text-3xl">
            Compute
          </Header>
          <ComputeOptions />
        </div>
        <MonthlyEstimate />
      </Section>
      <Section className="">
        <DeployTable />
      </Section>
    </div>
  )
}

function ComputeOptions() {
  return (
    <div className="space-y-6">
      <ServerTabs />
      <NameDropdown />
      <div className="flex w-full gap-6">
        <RegionDropdown />
        <ZoneDropdown />
      </div>
      <div className="space-y-2">
        <Header level={2} className="text-xl">
          Use case
        </Header>
        <UseCaseTabs />
      </div>
    </div>
  )
}

function ServerTabs() {
  return (
    <RadioGroup
      defaultValue="server"
      className="flex gap-0 divide-x divide-border overflow-hidden rounded-md border drop-shadow-lg"
    >
      <RadioGroupCard value="server" id="server" className="grow">
        <Label htmlFor="server">Server</Label>
      </RadioGroupCard>

      <RadioGroupCard value="storage" id="storage" className="grow">
        <Label htmlFor="storage">Storage</Label>
      </RadioGroupCard>
      <RadioGroupCard value="gpu" id="gpu" className="grow">
        <Label htmlFor="gpu">GPU</Label>
      </RadioGroupCard>
    </RadioGroup>
  )
}

function UseCaseTabs() {
  return (
    <RadioGroup
      defaultValue="general-optimized"
      className="flex gap-0 divide-x divide-border overflow-hidden rounded-md border drop-shadow-lg"
    >
      <RadioGroupCard
        value="general-optimized"
        id="general-optimized"
        className="basis-1/4 px-0"
      >
        <Label htmlFor="general-optimized">General</Label>
      </RadioGroupCard>

      <RadioGroupCard
        value="storage-optimized"
        id="storage-optimized"
        className="basis-1/4 px-0"
      >
        <Label htmlFor="storage-optimized">Storage optimized</Label>
      </RadioGroupCard>
      <RadioGroupCard
        value="gpu-optimized"
        id="gpu-optimized"
        className="basis-1/4 px-0"
      >
        <Label htmlFor="gpu-optimized">GPU optimized</Label>
      </RadioGroupCard>
      <RadioGroupCard
        value="memory-optimized"
        id="memory-optimized"
        className="basis-1/4 px-0"
      >
        <Label htmlFor="memory-optimized">Memory optimized</Label>
      </RadioGroupCard>
    </RadioGroup>
  )
}

function MonthlyEstimate() {
  return (
    <Card className="min-w-72 rounded-none bg-white">
      <CardHeader>
        <CardTitle>Monthly Estimate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <p className="flex items-center gap-x-1.5 text-sm font-light text-card-foreground/80">
            <Icons.BareMetalIcon className="size-5" />
            Bare metal provider
          </p>
          <p className="flex items-center gap-x-1.5 text-sm font-light leading-none text-card-foreground/80">
            <Image
              src="https://flagicons.lipis.dev/flags/4x3/au.svg"
              width={20}
              height={15}
              className="size-5 rounded-md"
              alt="Australia flag"
            />
            Country & Region
          </p>
        </div>
        <p className="font-semibold">2 vCPU + 4 GB memory</p>
        <div>
          <Table className="">
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="font-normal text-card-foreground">
                  Item
                </TableHead>
                <TableHead className="text-right font-normal text-card-foreground">
                  <span className="pr-1">Price</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="text-muted-foreground">
                    Service
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="pr-2 text-sm">XX</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator />
        </div>
        <div className="flex items-start justify-between gap-4 px-2 pt-2">
          <p>Total</p>
          <div className="flex flex-col items-end">
            <p className="text-3xl font-bold text-primary">
              $267.97
              <span className="text-base font-semibold">/mo</span>
            </p>
            <p className="text-xs">or about $0.04/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
