/* eslint-disable no-unused-vars */
import { Inter } from '@next/font/google'

import ScrollUp from '@/components/Common/ScrollUp'
// import Console from '@/components/Console'
import Dashboard from '@/components/Dashboard'
import DataProducts from '@/components/DataProducts'
import Profile from '@/components/Profile'
import Testing from '@/components/Testing'

// import NewTask from '@/components/NewTask'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function DashboardPage() {
  return (
    <>
      <Profile />
    </>
  )
}
