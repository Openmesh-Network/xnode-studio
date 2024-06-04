import Image from 'next/image'

type StatsItemProps = {
  title: string
  value: string
}
function StatsItem({ title, value }: StatsItemProps) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <h1 className="text-xl font-medium text-darkGray">{title}</h1>
      <p className="text-4xl font-bold text-primary">{value}</p>
    </div>
  )
}

export default function ResourcesPage() {
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
        <StatsItem title="Countries" value="172" />
        <StatsItem title="Providers" value="32" />
        <StatsItem title="Regions" value="482" />
        <StatsItem title="Storage" value="900PB" />
        <StatsItem title="GUPs" value="335G/F" />
        <StatsItem title="RAM" value="26PB" />
        <StatsItem title="Bandwidth" value="900PB" />
      </section>
      <section className="mt-12">
        <table className="w-full text-black">
          <thead className="bg-body-color/50">
            <tr className="h-10 [&>th]:px-4 [&>th]:text-start [&>th]:font-normal">
              <th>Provider</th>
              <th>Region</th>
              <th>Item</th>
              <th>CPU</th>
              <th>Storage</th>
              <th>GPU</th>
              <th>Price</th>
            </tr>
          </thead>
        </table>
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
