import ScrollToTop from '@/components/ScrollToTop'

import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'

import { type Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
import LateralNav from '@/components/LateralNav'

import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Openmesh Xnode',
  icons: {
    icon: '/openmesh-blue.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={cn(
          'max-w-screen overflow-x-hidden bg-background font-sans text-foreground antialiased',
          inter.variable
        )}
      >
        <Providers>
          <div className="mx-auto">
            <Header />
          </div>

          <div className="max-w-screen flex w-full">
            <div className="z-50 float-left min-w-[180px] bg-[#F4F4F4]">
              <LateralNav />
            </div>
            <div className="w-full">{children}</div>
          </div>

          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
