import TemplateStep from '@/components/TemplateProducts/TemplateStep'
import { z } from 'zod'

type TemplatesPageProps = {
  searchParams: {
    nftId: string
  }
}

export default function TemplateProductsPage({ searchParams }: TemplatesPageProps) {
  const nftId = z.string().optional().parse(searchParams.nftId)

  return (
    <>
      <TemplateStep nftId={ nftId } />
    </>
  )
}
