import { z } from 'zod'

import AppStore from '@/components/AppStore/app-store'

const appStorePageType = z.enum(['templates', 'use-cases'])
export type AppStorePageType = z.infer<typeof appStorePageType>

type TemplatesPageProps = {
  searchParams: {
    type: string
    nftId: string
    category: string[]
  }
}

export default function TemplateProductsPage({
  searchParams,
}: TemplatesPageProps) {
  const type = appStorePageType
    .optional()
    .default('templates')
    .safeParse(searchParams.type)
  const nftId = z.string().optional().parse(searchParams.nftId)
  const categories = z
    .string()
    .array()
    .optional()
    .parse(
      Array.isArray(searchParams.category)
        ? searchParams.category
        : searchParams.category
          ? [searchParams.category]
          : []
    )

  return (
    <>
      <AppStore
        nftId={nftId}
        categories={categories}
        type={type.success ? type.data : 'templates'}
      />
    </>
  )
}
