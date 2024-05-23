// import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'
import { Providers } from './providers'
import { Header } from '@/components/Header'
import LateralNav from '@/components/LateralNav'

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
          <div className="flex flex-col">
            <Header />
            <div className="flex items-stretch">
              <LateralNav />
              {children}
            </div>
          </div>

          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
