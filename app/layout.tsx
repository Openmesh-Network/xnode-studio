import ScrollToTop from '@/components/ScrollToTop'

import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'

import { type Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
import { NavLayout } from '@/components/SidebarNav/sibebar-nav'

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
          'max-w-screen h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased',
          inter.variable
        )}
      >
        <Providers>
          <div className="absolute z-50 mx-auto w-full">
            <Header />
          </div>
          <NavLayout>
            {children}
            <ScrollToTop />
          </NavLayout>
        </Providers>
      </body>
    </html>
  )
}
