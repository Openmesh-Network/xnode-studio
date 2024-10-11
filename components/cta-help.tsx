'use client'

import Image from 'next/image'
import { domAnimation, LazyMotion, m } from 'framer-motion'
import { User } from 'lucide-react'

export default function CTAHelp() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="pointer-events-none fixed inset-4 z-50 flex items-end justify-end">
        <m.div
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          className="max-w-sm rounded border border-primary/25 bg-[color-mix(in_srgb,hsl(var(--background)),hsl(var(--primary))_5%)] px-6 py-4"
        >
          <p className="text-sm">
            Meet hundreds of visionaries from Data, Cloud, Blockchain, AI & Web3
            Infrastructure who support our mission.
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
              src="/open-circle.png"
              alt="open-circle"
              width={96}
              height={32}
              className="object-contain text-xs"
            />
          </div>
        </m.div>
      </div>
    </LazyMotion>
  )
}
