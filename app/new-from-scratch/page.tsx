/* eslint-disable no-unused-vars */
'use client'

import ScrollUp from '@/components/Common/ScrollUp'
import Hero from '@/components/Hero'
import { Inter } from '@next/font/google'
import { useRef } from 'react'
import FromScratch from '@/components/NewFromScratch'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const pricingRef = useRef(null)
  const contributorsRef = useRef(null)
  const tallyFormsRef = useRef(null)

  return (
    <>
      <ScrollUp />
      <FromScratch />
    </>
  )
}
