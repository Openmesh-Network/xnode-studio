'use client'

import Template from '@/components/Template'

export default function UserPage({ params }) {
  return (
    <>
      <Template id={params.id} />
    </>
  )
}
