'use client'

import IndexerDeployer from '@/components/Template'
import { Inter } from '@next/font/google'

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
