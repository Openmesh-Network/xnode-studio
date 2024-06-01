/* eslint-disable no-unused-vars */
'use client'

import ScrollUp from '@/components/Common/ScrollUp'
import Hero from '@/components/Hero'
import { Inter } from '@next/font/google'
import { useRef } from 'react'
import FirstStep from '@/components/FirstStep'
import Footer from '@/components/Footer'
// import Console from '@/components/Console'
import LandingPage from '@/components/LandingPage'
import NewLandingPage from '@/components/NewLandingPage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const pricingRef = useRef(null)
  const contributorsRef = useRef(null)
  const tallyFormsRef = useRef(null)

  return (
    <>
      <ScrollUp />
      <LandingPage />
    </>
  )
}
