'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { User, X } from 'lucide-react'

export default function CTAHelp() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const dismissedFromStorage =
      localStorage.getItem('cta-help-dismissed') === 'true'
    setDismissed(dismissedFromStorage)
  }, [])

  const dismiss = useCallback(() => {
    localStorage.setItem('cta-help-dismissed', 'true')
    setDismissed(true)
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {!dismissed ? (
          <div className="fixed bottom-4 right-4 z-50 flex items-end justify-end">
            <m.div
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 500, opacity: 0 }}
              className="relative max-w-sm rounded border border-primary/25 bg-[color-mix(in_srgb,hsl(var(--background)),hsl(var(--primary))_5%)] px-6 py-4"
            >
              <button
                onClick={dismiss}
                className="absolute right-2 top-2 p-0.5 text-primary"
              >
                <X className="size-4" />
              </button>
              <Link href="https://circle.openmesh.network" target="_blank">
                <p className="w-4/5 text-pretty text-sm">
                  Meet hundreds of visionaries from Data, Cloud, Blockchain, AI
                  & Web3 Infrastructure who support our mission.
                </p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      <div className="flex size-8 items-center justify-center rounded-full border bg-white">
                        <User className="size-4" />
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full border bg-white">
                        <User className="size-4" />
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full border bg-white">
                        <User className="size-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold leading-none">248</p>
                      <p className="text-xs text-muted-foreground">
                        Growing Speakers
                      </p>
                    </div>
                  </div>
                  <Image
                    src={`${prefix}/open-circle.png`}
                    alt="open-circle"
                    width={96}
                    height={32}
                    className="object-contain text-xs"
                  />
                </div>
              </Link>
            </m.div>
          </div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  )
}
