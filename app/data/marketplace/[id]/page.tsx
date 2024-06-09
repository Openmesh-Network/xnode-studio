import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Building, MapPin, Search } from 'lucide-react'
import { z } from 'zod'

import { cn, formatPrice } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Section } from '@/components/ui/section'
import { Separator } from '@/components/ui/separator'

import { DATA_PRODUCT_DATA, MARKETPLACE_DATA } from '../dummy'

type DataMarketplaceItemProps = {
  params: {
    id: string
  }
}
export default function DataMarketplaceItem({
  params,
}: DataMarketplaceItemProps) {
  const itemId = z.coerce.number().parse(params.id)
  const data = MARKETPLACE_DATA.find((d) => d.id === itemId)
  if (!data) redirect('/data/marketplace')
  return (
    <Section className="my-20 flex">
      <section className="flex-1">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex size-12 items-center justify-center rounded shadow-lg">
              <Image
                src={data.image}
                alt={data.name}
                width={24}
                height={24}
                className="size-6 rounded-lg object-cover"
              />
            </div>
            <p
              className={cn(
                'font-semibold',
                data.price === 0 && 'text-green-600'
              )}
            >
              {data.price === 0 ? 'Free' : formatPrice(data.price)}
            </p>
          </div>
          <h1 className="mt-1.5 text-3xl font-semibold">{data.name}</h1>
        </div>
        <p className="mt-4 text-muted-foreground">{data.summary}</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MapPin className="size-4" />
            <p className="font-medium">{data.headquarter}</p>
          </div>
          <div className="flex items-center gap-1">
            <Building className="size-4" />
            <p className="font-medium">{data.founded}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium">Tags</h3>
          <div className="mt-1 flex gap-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary px-3 py-1 text-sm font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium">Use Cases</h3>
          <div className="mt-1 flex gap-2">
            {data.useCases.map((useCase) => (
              <span
                key={useCase}
                className="rounded-full border border-primary px-3 py-1 text-sm font-medium text-primary"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="w-96">
        <div className="relative w-full">
          <Input placeholder="Search Data Products" className="w-full pl-9" />
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
        <ul className="mt-8 flex flex-col gap-2">
          {DATA_PRODUCT_DATA.filter((d) => d.linkedIds.includes(itemId)).map(
            (d) => (
              <li
                key={d.endpoint}
                className="rounded-lg p-4 shadow-[0_0.375rem_1.5rem_hsl(0_0_0/0.1)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Image
                      src={data.image}
                      alt={data.name}
                      width={24}
                      height={24}
                      className="size-6 rounded-lg object-cover"
                    />
                    <p className="text-lg font-semibold">{data.name}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-green-200 px-3 py-1.5 text-green-700">
                    <div className="size-3 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold capitalize">
                      {d.status}
                    </span>
                  </div>
                </div>
                <p className="mt-3 font-semibold">Base Endpoint</p>
                <div className="mt-1 flex items-center justify-between rounded bg-accent px-3 py-2">
                  <p className="text-sm font-medium">{d.endpoint}</p>
                </div>
                <Separator className="my-4" />
                <Link
                  href={`#`}
                  className="group inline-flex items-center gap-1.5 font-semibold text-primary"
                >
                  Free to access
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            )
          )}
        </ul>
      </section>
    </Section>
  )
}
