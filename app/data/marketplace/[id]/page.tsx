import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Building, MapPin } from 'lucide-react'
import { z } from 'zod'

import { cn, formatPrice } from '@/lib/utils'

import { MARKETPLACE_DATA } from '../dummy'

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
    <section className="p-12">
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
  )
}
