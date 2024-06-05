'use client'

import { Inter } from "next/font/google"

import DataProductEquinix from '@/components/DataProductEquinix'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <DataProductEquinix id={'87bdcf76-c7be-4294-8224-7f1770571eb0'} />
    </>
  )
}
