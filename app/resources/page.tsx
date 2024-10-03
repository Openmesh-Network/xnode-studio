import Image from 'next/image'
import { db } from '@/db'
import { Providers } from '@/db/schema'
import { prefix } from '@/utils/prefix'
import { count, countDistinct, like, sum } from 'drizzle-orm'

import ResourcesTable from './resources-table'

type StatsItemProps = {
  title: string
  value: string | number
  unit?: string
}
function StatsItem({ title, value, unit }: StatsItemProps) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <h1 className="text-xl font-medium text-darkGray">{title}</h1>
      <p className="font-bold text-primary">
        <span className="text-4xl">{value}</span>
        <span className="text-xl">{unit}</span>
      </p>
    </div>
  )
}

export default async function ResourcesPage() {
  const [stats] = await db
    .select({
      countries: countDistinct(Providers.country),
      providers: countDistinct(Providers.providerName),
      regions: countDistinct(Providers.location),
      storage: sum(Providers.storageTotal).mapWith(Number),
      ram: sum(Providers.ram).mapWith(Number),
      bandwidth: sum(Providers.bandwidthNetwork).mapWith(Number),
    })
    .from(Providers)
    .limit(1)

  const [gpus] = await db
    .select({
      count: count(),
    })
    .from(Providers)
    .where(like(Providers.gpuType, '%A100%'))
    .limit(1)

  return (
    <div className="container mt-24 p-2">
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
        <StatsItem title="Countries" value={/*stats.countries*/ 172} />
        <StatsItem title="Providers" value={/*stats.providers*/ 32} />
        <StatsItem title="Regions" value={/*stats.regions*/ 482} />
        <StatsItem
          title="Storage"
          value={/*Math.round(stats.storage / 1024 / 1024)*/ 900}
          unit="PB"
        />
        <StatsItem title="GPUs" value={/*gpus.count * 312*/ 335} unit="GF" />
        <StatsItem
          title="RAM"
          value={/*Math.round(stats.ram / 1024)*/ 26}
          unit={/*"TB"*/ 'PB'}
        />
        <StatsItem
          title="Bandwidth"
          value={/*Math.round(stats.bandwidth / 1024)*/ 900}
          unit="PB"
        />
      </section>
      <section className="mt-12">
        <ResourcesTable />
      </section>
      <section className="mx-auto my-12 max-w-6xl">
        <Image
          src={`${prefix}/images/resources/world-map.svg`}
          alt="World map"
          width={1920}
          height={1080}
          className="w-full object-contain"
        />
      </section>
    </div>
  )
}
