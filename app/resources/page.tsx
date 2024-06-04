import Image from 'next/image'
import { getResourceStats } from '@/server/resources'

import ResourcesTable from './resources-table'

type StatsItemProps = {
  title: string
  value: string | number
}
function StatsItem({ title, value }: StatsItemProps) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <h1 className="text-xl font-medium text-darkGray">{title}</h1>
      <p className="text-4xl font-bold text-primary">{value}</p>
    </div>
  )
}

export default async function ResourcesPage() {
  const { stats } = await getResourceStats()

  return (
    <div className="container max-w-screen-2xl">
      <section className="flex flex-col justify-center gap-4 text-center">
        <h1 className="text-6xl font-semibold text-black">
          Full resource list
        </h1>
        <p className="text-darkGray">
          Discover how our advanced consensus mechanisms ensure reliability and
          scalability for the Openmesh network
        </p>
      </section>
      <section className="mt-20 grid grid-cols-7 gap-6 rounded p-6 shadow-[0_0.75rem_1rem_hsl(0_0_0/0.05)]">
        <StatsItem title="Countries" value={stats.countries} />
        <StatsItem title="Providers" value={stats.providers} />
        <StatsItem title="Regions" value={stats.regions} />
        <StatsItem
          title="Storage"
          value={`${Math.round(stats.storage / 1024 / 1024)}PB`}
        />
        <StatsItem title="GUPs" value="0G/F" />
        <StatsItem title="RAM" value={`${Math.round(stats.ram / 1024)}TB`} />
        <StatsItem
          title="Bandwidth"
          value={`${Math.round(stats.bandwidth / 1024)}PB`}
        />
      </section>
      <section className="mt-12">
        <ResourcesTable />
      </section>
      <section className="mt-24">
        <Image
          src={'/images/resources/world-map.svg'}
          alt="World map"
          width={1600}
          height={400}
          className="w-full object-contain"
        />
      </section>
    </div>
  )
}
