import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { InfoCard } from '@/components/ui/info-card'
import { Input } from '@/components/ui/input'
import { Section } from '@/components/ui/section'
import { Icon, Icons } from '@/components/Icons'

export default function DataDocumentation() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <Section
        fullWidth
        className="flex flex-col items-center gap-y-4 bg-neutral-50 py-20"
      >
        <Image
          src={'/images/analytics/pythia-x/pythia-x-logo.svg'}
          alt="PythiaX logo"
          width={428}
          height={175}
          className="ml-12 h-40"
        />
        <Header level={1} className="text-center text-3xl">
          Introducing Pythia - Your Gateway to Web3 Data
        </Header>
        <p className="text-center text-base">
          Revolutionize your data search and product development with
          Pythia&apos;s cutting-edge platform.
        </p>
        <div className="flex items-center justify-center gap-x-2">
          <div className="relative flex items-center">
            <Search className="absolute right-4 size-4" />
            <Input
              type="text"
              placeholder="Display top play to earn games NFT sales within last 7 days "
              className="min-w-[600px] pl-4 pr-10"
            />
          </div>
          <Button className="h-10 px-6 font-semibold">Go</Button>
        </div>
        <Links />
        <PieChartGraph />
      </Section>
      <Section
        aria-labelledby="basics-heading"
        fullWidth
        className="bg-white pb-12"
      ></Section>
      <Section
        aria-labelledby="core-docs-heading"
        className="mt-12 space-y-6 pb-12"
      ></Section>
    </div>
  )
}

function Links() {
  return (
    <div className="flex gap-x-8">
      <Link
        className="text-sm text-primary underline hover:text-primary/70"
        href="/analytics/pythia-x"
      >
        Download Data/Image
      </Link>
      <Link
        className="text-sm text-primary underline hover:text-primary/70"
        href="/analytics/pythia-x"
      >
        View Query
      </Link>
      <Link
        className="text-sm text-primary underline hover:text-primary/70"
        href="/analytics/pythia-x"
      >
        Edit Properties
      </Link>
      <Link
        className="text-sm text-primary underline hover:text-primary/70"
        href="/analytics/pythia-x"
      >
        Run in SQL Lab
      </Link>
    </div>
  )
}

const pieChartData = [
  {
    color: '#4A90E2',
    address: '0xN80jPfN3LkTybpZ4SAVtn6ssIYAyynRa',
    percentage: '50%',
  },
  {
    color: '#A3E3D8',
    address: '0xbNH935dsp7OZqQH1ucYOdleB8cw1aZ',
    percentage: '25%',
  },
  {
    color: '#E59BBE',
    address: '0xN80jPfN3LkTybpZ4SAVtn6ssIYAyynRa',
    percentage: '16.4%',
  },
  {
    color: '#F5B17B',
    address: '0xbNH935dsp7OZqQH1ucYOdleB8cw1aZ',
    percentage: '5.6%',
  },
  {
    color: '#B39FEF',
    address: '0xN80jPfN3LkTybpZ4SAVtn6ssIYAyynRa',
    percentage: '3%',
  },
]

function PieChartGraph() {
  return (
    <div className="mt-12 flex w-full items-center justify-center gap-x-10">
      <Image
        src={'/images/analytics/pythia-x/pie-chart.svg'}
        alt="PythiaX logo"
        width={275}
        height={275}
        className="size-48"
      />
      <div className="space-y-1">
        {pieChartData.map((data, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-x-8"
          >
            <div className="flex items-center justify-center gap-1 font-light">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: data.color }}
              />
              <span>{data.address}</span>
            </div>
            <span className="font-bold">{data.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
