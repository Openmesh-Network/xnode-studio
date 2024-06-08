import Image from 'next/image'

import Header from '@/components/ui/header'
import { InfoCard } from '@/components/ui/info-card'
import { Section } from '@/components/ui/section'
import { Icon, Icons } from '@/components/Icons'

export default function DataDocumentation() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <Section fullWidth className="bg-neutral-50 pb-12 pt-20">
        <Image
          src={'/images/analytics/pythia-x/pythia-x-logo.svg'}
          alt="PythiaX logo"
          width={428}
          height={175}
          className="mx-auto h-36"
        />
        <Header level={1} className="mt-4 text-center text-2xl">
          Introducing Pythia - Your Gateway to Web3 Data
        </Header>
        <p className="mt-2 text-center text-lg">
          Revolutionize your data search and product development with
          Pythia&apos;s cutting-edge platform.
        </p>
        <span className="sr-only">PythiaX logo</span>
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
