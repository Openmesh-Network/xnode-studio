'use client'

import { Inter } from '@next/font/google'

import ScrollUp from '@/components/Common/ScrollUp'
import Validator from '@/components/Validator'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <ScrollUp />
      <Validator id={params.id} />
    </>
  )
}
