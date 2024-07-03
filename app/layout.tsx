import ScrollToTop from '@/components/ScrollToTop'

import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'

import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { prefix } from '@/utils/prefix'

import { cn } from '@/lib/utils'
import { Footer } from '@/components/Footer'
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
    icon: `${prefix}/openmesh-latest.svg`,
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
          <div className="absolute inset-x-0 z-50">
            <Header />
          </div>
          <NavLayout>
            {children}
            <ScrollToTop />
          </NavLayout>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
