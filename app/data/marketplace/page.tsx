import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'

import { cn, formatPrice } from '@/lib/utils'
import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'

import { MARKETPLACE_DATA } from './dummy'

export default function DataMarketplace() {
  return (
    <Section className="my-20 space-y-4">
      <Header level={2}>Data</Header>
      <div className="grid grid-cols-2 gap-4">
        {MARKETPLACE_DATA.map((data) => (
          <Link
            key={data.id}
            href={`/data/marketplace/${data.id}`}
            className="flex items-start gap-6 rounded-lg border bg-white p-6 shadow-md"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex size-12 items-center justify-center rounded shadow-lg">
                <Image
                  src={`${prefix}${data.image}`}
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
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold">{data.name}</h2>
                {data.tag ? (
                  <span className="rounded border border-amber-400 bg-amber-400/50 px-2 py-0.5 text-xs font-semibold uppercase text-amber-950">
                    {data.tag}
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">{data.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}
