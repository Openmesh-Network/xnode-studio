'use client'

import { useEffect, useState, type PropsWithChildren } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const MOBILE_BREAKPOINT = 1024

type ScreenProviderProps = PropsWithChildren<{}>
export default function ScreenProvider({ children }: ScreenProviderProps) {
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (window.visualViewport.width < MOBILE_BREAKPOINT) {
      setShowDialog(true)
    }
    const handleResize = () => {
      if (window.visualViewport.width > MOBILE_BREAKPOINT) {
        setShowDialog(false)
      } else {
        setShowDialog(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {showDialog ? (
        <Dialog open>
          <DialogContent className="t-50 l-50 absolute" canClose={false}>
            <DialogHeader>
              <DialogTitle>
                Xnode Studio can only be accessed on desktop.
              </DialogTitle>
              <DialogDescription>
                Please use a different device with a larger screen to use the
                application.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}
      {children}
    </>
  )
}
