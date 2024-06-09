'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'
import { type EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowUpRight, MoveLeft, MoveRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'

import { PYTHIA_PRO_HELP } from './dummy'

export default function PythiaProPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('init', onScroll)
    emblaApi.on('reInit', onScroll)
    emblaApi.on('select', onScroll)

    return () => {
      emblaApi.off('init', onScroll)
      emblaApi.off('reInit', onScroll)
      emblaApi.off('select', onScroll)
    }
  }, [emblaApi, onScroll])

  return (
    <>
      <section className="bg-card py-20">
        <div className="container relative flex max-w-none flex-col items-center">
          <div className="relative">
            <Header level={1} className="text-center">
              Pythia <strong>Pro</strong>
            </Header>
            <Image
              src={`${prefix}/images/addOns/pythia.png`}
              alt="Pythia Logo"
              width={24}
              height={24}
              className="absolute -top-3 left-full"
            />
          </div>
          <Header
            level={2}
            className="mt-8 max-w-xl text-center text-5xl font-bold"
          >
            Push your analytics to extreme levels
          </Header>
          <p className="mt-6 max-w-prose text-balance text-center text-muted-foreground">
            Design, build, visualize, deploy, and store powerful data products
            directly in your web3 wallet
          </p>
          <Button size="lg" className="mt-12 h-14 min-w-48 font-semibold">
            Launch App
          </Button>
          <div className="mt-24 grid max-w-screen-xl grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <h4 className="text-4xl font-semibold text-primary">100%</h4>
              <p className="mt-0.5 text-xl font-semibold">Open-source</p>
              <p className="mt-2 text-balance text-muted-foreground">
                Built using Apache Superset open-source framework.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <h4 className="text-4xl font-semibold text-primary">50+</h4>
              <p className="mt-0.5 text-xl font-semibold">Visualizations</p>
              <p className="mt-2 text-balance text-muted-foreground">
                Pre-installed visualizations and charts for your needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <h4 className="text-4xl font-semibold text-primary">100%</h4>
              <p className="mt-0.5 text-xl font-semibold">Ownership</p>
              <p className="mt-2 text-balance text-muted-foreground">
                Save your queries & data products directly to your web3 wallet.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <h4 className="text-4xl font-semibold text-primary">Free</h4>
              <p className="mt-0.5 text-xl font-semibold">Ecosystem</p>
              <p className="mt-2 text-balance text-muted-foreground">
                Community developed data products & dashboards.
              </p>
            </div>
          </div>
          <Image
            src={`${prefix}/images/analytics/pythia-info-1.png`}
            alt="Pythia Pro"
            width={250}
            height={500}
            className="absolute left-20 top-0"
          />
          <Image
            src={`${prefix}/images/analytics/pythia-info-2.png`}
            alt="Pythia Pro"
            width={250}
            height={500}
            className="absolute right-20 top-[20%] translate-y-[-20%]"
          />
        </div>
      </section>
      <Section className="py-20">
        <Header level={2}>We&apos;ll help you get started</Header>
        <p>
          Browse the use cases, educational videos, and customer stories to find
          what you need to succeed with Pythia.
        </p>
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={!canScrollPrev}
              className="px-6 py-2 text-primary disabled:opacity-50"
              onClick={scrollPrev}
            >
              <MoveLeft className="size-6" />
            </button>
            <button
              type="button"
              disabled={!canScrollNext}
              className="px-6 py-2 text-primary disabled:opacity-50"
              onClick={scrollNext}
            >
              <MoveRight className="size-6" />
            </button>
          </div>
          <div ref={emblaRef}>
            <div className="-mx-4 flex">
              {PYTHIA_PRO_HELP.map((help, index) => (
                <div
                  className="shrink-0 grow-0 basis-1/3 px-4 first:pl-0"
                  key={index}
                >
                  <div className="flex h-full flex-col rounded border p-6">
                    <Image
                      src={`${prefix}${help.image}`}
                      alt={help.title}
                      width={250}
                      height={250}
                      className="aspect-video w-full object-cover"
                    />
                    <Header level={3} className="mt-4">
                      {help.title}
                    </Header>
                    <p className="mt-1 grow text-muted-foreground">
                      {help.description}
                    </p>
                    <Link
                      href="/analytics/pythia-pro"
                      className="group mt-4 inline-flex items-center gap-1.5 text-primary"
                    >
                      <span className="font-semibold">{help.linkText}</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
