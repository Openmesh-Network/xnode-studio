import { z } from 'zod'

import TemplateStep from '@/components/TemplateProducts/TemplateStep'

type TemplatesPageProps = {
  searchParams: {
    nftId: string
    category: string[]
  }
}

export default function TemplateProductsPage({
  searchParams,
}: TemplatesPageProps) {
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
  console.log(categories)

  return (
    <>
      <TemplateStep nftId={nftId} categories={categories} />
    </>
  )
}
