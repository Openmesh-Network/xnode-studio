import { z } from 'zod'

import { appStorePageType } from '@/types/dataProvider'
import AppStore from '@/components/AppStore/app-store'

type AppStorePageProps = {
  searchParams: {
    type: string
    nftId: string
    category: string[]
  }
}

export default function AppStorePage({ searchParams }: AppStorePageProps) {
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
        categories={categories ?? []}
        type={type.success ? type.data : 'templates'}
      />
    </>
  )
}
