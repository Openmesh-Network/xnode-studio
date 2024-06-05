'use client'

import ScrollUp from '@/components/Common/ScrollUp'
import Validator from '@/components/Validator'

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <ScrollUp />
      <Validator id={params.id} />
    </>
  )
}
