import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'

import { COMPUTE_DATA } from './dummy'

export default function ComputeOverviewPage() {
  return (
    <>
      <section className="bg-foreground text-background">
        <div className="container flex basis-2/3 gap-24 pt-32">
          <div>
            <Header level={1} className="leading-none">
              Design, build, visualize, deploy, and store powerful crypto and
              web3 data products in your web3 wallet.
            </Header>
            <Header level={2} className="mt-4">
              Auto-scale workloads and only pay for the resources you need.
            </Header>
          </div>
          <Image
            src="/images/compute/hero.png"
            width={600}
            height={600}
            alt="Compute Overview"
            className="basis-1/3"
          />
        </div>
      </section>
      <Section className="py-20">
        <Header level={2}>Jump right in</Header>
        <div className="mt-8 flex items-center justify-between gap-8">
          <div>
            <p className="text-xl font-semibold">
              Your fast path to “up and running
            </p>
            <p className="text-lg">
              Deploy your source code or container image with only a few clicks.
            </p>
          </div>
          <Button size="lg" className="h-12 min-w-40 gap-1.5">
            Let&apos;s go
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </Section>
      <Section className="space-y-8 py-20">
        <Header level={2}>Features</Header>
        <div className="grid grid-cols-3 gap-8">
          {COMPUTE_DATA.map((data, index) => (
            <Card key={index} className="bg-white">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <data.icon className="size-7 stroke-[1.5] text-primary" />
                </div>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
