'use client'

import { Inter } from "next/font/google"

import DataProduct from '@/components/DataProduct'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <DataProduct id={params.id} />
    </>
  )
}
