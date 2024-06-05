'use client'

import IndexerDeployer from '@/components/Template'

export default function UserPage({ params }) {
  return (
    <>
      <IndexerDeployer id={params.id} />
    </>
  )
}
