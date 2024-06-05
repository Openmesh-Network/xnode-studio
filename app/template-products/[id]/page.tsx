'use client'

import { Inter } from '@next/font/google'

import IndexerDeployer from '@/components/Template'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <IndexerDeployer id={params.id} />
    </>
  )
}
