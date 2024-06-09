import Image from 'next/image'
import { prefix } from '@/utils/prefix'

import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'
import { CodeCalculator } from '@/app/data/page'

export default function APIOverview() {
  return (
    <div className="bg-[#0C0C0C] pt-12 text-white">
      <Section fullWidth className="bg-[#0C0C0C] py-16 text-white">
        <div className="container max-w-6xl space-y-2">
          <Header level={1}>UnifiedAPI</Header>
          <Header level={3} className="pt-2 text-white">
            Single endpoint for data, APIs, no registration, no licenses.
          </Header>
          <p className="text-balance">
            Power thousands of applications (mobile & web), dAps. protocols,
            DAOs. Built for developers, data scientists, game developers,
            blockchain protocols, and startups.
          </p>
          <CodeCalculator />
        </div>
      </Section>
      <Section className="mx-auto mt-12 w-full text-center">
        <p className="text-3xl">Unified API</p>
        <Header level={2} className="text-5xl">
          Single endpoint for data
        </Header>
        <Image
          src={`${prefix}/images/apis/APIOverview.png`}
          alt="API overview"
          width={819}
          height={565}
          className="mx-auto"
        />
      </Section>
    </div>
  )
}
