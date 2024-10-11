import { getXuNfts } from '@/utils/nft'
import { z } from 'zod'

import XNodeDashboard from './dashboard'

type XnodePageProps = {
  searchParams: {
    uuid: string
  }
}

export default function XNodePage({ searchParams }: XnodePageProps) {
  const xNodeId = z.coerce.string().parse(searchParams.uuid)

  return <XNodeDashboard xNodeId={xNodeId} />
}
