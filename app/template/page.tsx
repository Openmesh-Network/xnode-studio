'use client'

import Template from '@/components/Template'

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <Template id={params.id} />
    </>
  )
}
