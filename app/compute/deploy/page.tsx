import Image from 'next/image'

import { cn, formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/ui/header'
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

export default function ComputDeploy() {
  return (
    <Section className="flex gap-x-2 py-20">
      <div className="grow">
        <Header level={1} className="text-3xl">
          Compute
        </Header>
        <ComputeOptions />
      </div>
      <MonthlyEstimate />
    </Section>
  )
}

function ComputeOptions() {
  return <div></div>
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
