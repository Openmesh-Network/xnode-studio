import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'
import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'

export default function RPCOverviewPage() {
  return (
    <>
      <section className="bg-foreground text-background overflow-hidden">
        <div className="container relative py-48">
          <div className="flex gap-16">
            <Link href="#" className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-green-600" />
              <p>Xnode 3</p>
              <ArrowUpRight className="size-4" />
            </Link>
            <Link href="#" className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-green-600" />
              <p>Circle Live</p>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12 max-w-prose">
            <Header level={1} className="text-6xl font-black leading-none">
              Empowering a Decentralized Future
            </Header>
            <p className="mt-4 text-xl">
              Join the revolution with Openmesh, the leading decentralized
              network for data, infrastructure, and people.
            </p>
          </div>
          <div className="mt-12 flex gap-6">
            <Button className="h-12 min-w-48">Get Started</Button>
            <Button className="h-12 min-w-32" variant="ghost">
              Learn More
            </Button>
          </div>
          <div className="absolute right-0 top-1/2 isolate -translate-y-1/2">
            <Image
              src={`${prefix}/images/rpc/hero.png`}
              width={500}
              height={500}
              alt="Compute Overview"
            />
            <div className="bg-primary/15 absolute inset-0 -z-10 rounded-full blur-[5rem]" />
          </div>
        </div>
      </section>
      <section className="bg-foreground flex justify-between gap-12 px-20 py-8">
        <Image
          src={`${prefix}/images/rpc/logos/equinix.svg`}
          width={120}
          height={50}
          alt="Equinix"
          className="object-contain"
        />
        <Image
          src={`${prefix}/images/rpc/logos/singularitynet.svg`}
          width={120}
          height={50}
          alt="SingularityNET"
          className="object-contain"
        />
        <Image
          src={`${prefix}/images/rpc/logos/vultr.svg`}
          width={120}
          height={50}
          alt="VULTR"
          className="object-contain"
        />
        <Image
          src={`${prefix}/images/rpc/logos/snowflake.svg`}
          width={120}
          height={50}
          alt="Snowflake"
          className="object-contain"
        />
        <Image
          src={`${prefix}/images/rpc/logos/aiven.svg`}
          width={120}
          height={50}
          alt="Aiven"
          className="object-contain"
        />
        <Image
          src={`${prefix}/images/rpc/logos/polygon.png`}
          width={120}
          height={50}
          alt="Polygon"
          className="object-contain brightness-0 grayscale invert"
        />
        <Image
          src={`${prefix}/images/rpc/logos/chainlink.svg`}
          width={120}
          height={50}
          alt="Chainlink"
          className="object-contain"
        />
      </section>
      <Section className="flex gap-40 py-20">
        <Header level={2} className="text-4xl font-bold">
          Why
          <br />
          Openmesh?
        </Header>
        <div className="grid grid-cols-1 place-items-start gap-x-8 md:grid-cols-2">
          <div className="mt-8 rounded-lg p-6 shadow-md">
            <Header
              level={3}
              className="border-primary border-l pl-3 text-2xl font-bold"
            >
              Innovative Solutions
            </Header>
            <p className="mt-2">
              Leverage our cutting-edge technology, including the Xnode and
              decentralized data layer, to stay ahead in the evolving digital
              landscape.
            </p>
          </div>
          <div className="rounded-lg p-6 shadow-md">
            <Header
              level={3}
              className="border-l border-amber-500 pl-3 text-2xl font-bold"
            >
              Decentralized Network
            </Header>
            <p className="mt-2">
              Harness the power of a fully decentralized network, ensuring
              unparalleled security and resilience.
            </p>
          </div>
          <div className="mt-8 rounded-lg p-6 shadow-md">
            <Header
              level={3}
              className="border-l border-violet-500 pl-3 text-2xl font-bold"
            >
              Scalable Infrastructure
            </Header>
            <p className="mt-2">
              Enjoy a robust and scalable infrastructure that grows with your
              needs, providing the flexibility to handle projects of any size
              and complexity.
            </p>
          </div>
          <div className="rounded-lg p-6 shadow-md">
            <Header
              level={3}
              className="border-l border-green-500 pl-3 text-2xl font-bold"
            >
              Community-Driven
            </Header>
            <p className="mt-2">
              Be part of a thriving community of developers, startups, and web3
              enthusiasts, working together to shape the future of the internet.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
