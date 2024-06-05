'use client'

import DataProduct from '@/components/DataProduct'

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <DataProduct id={params.id} />
    </>
  )
}
