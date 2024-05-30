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

      <body className="max-w-screen w-full bg-white">
        <Providers>
          <div className="mx-auto">
            <Header />
          </div>

          <div className="w-full max-w-screen flex">
            <div className="z-50 min-w-[180px] float-left bg-[#F4F4F4]">
              <LateralNav />
            </div>

            <div className="p-5 w-full m-auto">
              {children}
            </div>
          </div>

          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
