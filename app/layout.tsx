import ScrollToTop from '@/components/ScrollToTop'

import '../styles/index.css'

import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { prefix } from '@/utils/prefix'

import { cn } from '@/lib/utils'
import CTAHelp from '@/components/cta-help'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
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
    icon: `${prefix}/openmesh.svg`,
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
          'max-w-screen bg-background text-foreground h-screen w-full overflow-x-hidden font-sans antialiased',
          inter.variable
        )}
      >
        <Providers>
          <Header />
          <NavLayout>
            {children}
            <ScrollToTop />
          </NavLayout>
          <Footer />
          <CTAHelp />
        </Providers>
      </body>
    </html>
  )
}
