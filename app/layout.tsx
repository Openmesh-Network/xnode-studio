// import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'
import { Providers } from './providers'
import { Header } from '@/components/Header'
import LateralNav from '@/components/LateralNav'

import { Inter } from '@next/font/google'
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

      <Providers>
        <body className={`w-full bg-white ${inter.className}`}>
          <div className="flex flex-col">
            <Header />
            <div className="flex h-full w-full items-stretch">
              <LateralNav />
              {children}
            </div>
          </div>

          <ScrollToTop />
        </body>
      </Providers>
    </html>
  )
}
