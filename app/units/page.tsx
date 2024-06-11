import { chain } from '@/utils/chain'

import ScrollUp from '@/components/Common/ScrollUp'
import Units from '@/components/Units'

export default function UnitsPage() {
  return (
    <>
      <ScrollUp />
      <Units chainId={chain.id} />
    </>
  )
}
