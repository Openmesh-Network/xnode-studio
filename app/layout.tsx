// import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'

import { Inter } from "next/font/google"

import { Header } from '@/components/Header'
import LateralNav from '@/components/LateralNav'

import { Providers } from './providers'

// import NewTask from '@/components/NewTask'

// eslint-disable-next-line no-unused-vars
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />

      <body className="max-w-screen w-full bg-white">
        <Providers>
          <div className="mx-auto">
            <Header />
          </div>

          <div className="max-w-screen flex w-full">
            <div className="z-50 float-left min-w-[180px] bg-[#F4F4F4]">
              <LateralNav />
            </div>

            <div className="m-auto w-full p-5">{children}</div>
          </div>

          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
