'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { type Provider } from '@/db/schema'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import {
  Check,
  ChevronsUpDown,
  Loader,
  MapPin,
  Search,
  Server,
  X,
} from 'lucide-react'
import { prefix } from 'utils/prefix'

import { type Specs } from '@/types/dataProvider'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/Icons'

import { Slider } from '../../components/ui/slider'
import { useDeploymentContext } from '../deploy/deployment-context'

const STEP_MIN = 1
const STEP_MAX = 1000
const PRICE_MAX = 50000

const TEMP_FETCH_ENDPOINTS = 5
const FETCHING_TEXTS = [
  'Searching Equinix...',
  'Searching DigitalOcean...',
  'Searching AWS...',
  'Searching Azure...',
  'Filtering results...',
  'Finishing up...',
]

type DeploymentProviderProps = {
  specs?: Specs
  onSelect: () => void
}
export default function DeploymentProvider({
  specs,
  onSelect,
}: DeploymentProviderProps) {
  const [page, setPage] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>('')
  const debouncedSearchInput = useDebounce(searchInput, 500)
  const [region, setRegion] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined])
  const debouncedPriceRange = useDebounce(priceRange, 500)
  const { setConfig } = useDeploymentContext()

  const { data: providerData, isFetching: providersFetching } = useQuery({
    queryKey: [
      'resources',
      page,
      debouncedSearchInput,
      region,
      debouncedPriceRange,
      specs,
    ],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      if (debouncedSearchInput) {
        params.append('q', debouncedSearchInput)
      }
      if (region) {
        params.append('r', region)
      }
      if (specs?.ram && specs.ram > 0) {
        const ramGB = specs.ram / 1024
        params.append('minRAM', String(ramGB))
      }
      if (specs?.storage && specs.storage > 0) {
        const storageGB = specs.storage / 1024
        params.append('minStorage', String(storageGB))
      }
      debouncedPriceRange[0] &&
        params.append('min', String(debouncedPriceRange[0]))
      debouncedPriceRange[0] &&
        params.append('max', String(debouncedPriceRange[1]))
      const res = await fetch(prefix + `/api/providers?${params.toString()}`)
      return res.json() as Promise<{ data: Provider[] }>
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(-1)
  const incrementLoading = () => {
    setLoadingProgress((oldProgress) => {
      if (oldProgress === TEMP_FETCH_ENDPOINTS) {
        if (timerRef.current) clearInterval(timerRef.current)
        return -1
      }
      return Math.min(oldProgress + 1, TEMP_FETCH_ENDPOINTS)
    })
  }

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setLoadingProgress(0)
    timerRef.current = setInterval(incrementLoading, 900)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [providersFetching])

  const { data: regionData, isLoading: regionLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await fetch(prefix + '/api/providers/regions')
      return res.json() as Promise<string[]>
    },
  })

  const histogramPriceData = useMemo(() => {
    if (!providerData?.data) return []
    const BINS = 32
    const prices = providerData.data
      .map((provider) => provider.priceSale ?? provider.priceMonth)
      .filter((price) => price !== null)

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const range = maxPrice - minPrice

    const binSize = range / BINS
    const bins = Array.from({ length: BINS }, (_, i) => minPrice + i * binSize)

    const counts = new Array(BINS).fill(0)
    prices.forEach((price) => {
      const binIndex = Math.min(
        Math.floor((price - minPrice) / binSize),
        BINS - 1
      )
      counts[binIndex]++
    })

    const totalCount = prices.length
    const histogram = counts.map((count, index) => [
      bins[index],
      (count / totalCount) * 100,
    ])
    return histogram
  }, [providerData?.data])

  const scaledHistogramData = useMemo(() => {
    const MIN = 10
    const MAX = 100
    const percentages = histogramPriceData.map(([_, percentage]) => percentage)

    const minPercentage = Math.min(...percentages)
    const maxPercentage = Math.max(...percentages)

    return percentages.map((p) => {
      const normalized = (p - minPercentage) / (maxPercentage - minPercentage)
      return MIN + normalized * (MAX - MIN)
    })
  }, [histogramPriceData])

  return (
    <div>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-lg bg-primary/10 transition-all',
          loadingProgress > -1 ? 'h-3' : 'h-0'
        )}
      >
        <div
          className="absolute left-0 top-0 h-full animate-pulse rounded-full bg-primary transition-all"
          style={{
            width: `${(100 / TEMP_FETCH_ENDPOINTS) * Math.max(loadingProgress, 0)}%`,
          }}
        />
      </div>
      <div
        className={cn(
          'mt-1 flex items-center gap-1 overflow-hidden transition-all',
          loadingProgress > -1 ? 'h-auto' : 'h-0'
        )}
      >
        <Loader className="size-3.5 animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">
          {FETCHING_TEXTS[loadingProgress]}
        </p>
      </div>
      <div className="mt-8 flex gap-12">
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            disabled={
              region === null &&
              searchInput === '' &&
              priceRange[0] === undefined &&
              priceRange[1] === undefined
            }
            size="lg"
            variant="outline"
            onClick={() => {
              setPriceRange([undefined, undefined])
              setRegion(null)
              setSearchInput('')
            }}
            className="gap-1.5"
          >
            <X className="size-4 shrink-0" />
            Reset filter
          </Button>
          <Separator className="my-3" />
          <div className="flex flex-col space-y-2">
            <Label htmlFor="search">Search providers and servers</Label>
            <div className="relative flex w-full max-w-80 items-center">
              <Search className="absolute left-3 size-4" />
              <Input
                id="search"
                type="text"
                placeholder="Providers and servers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Separator className="my-3" />
          <div>
            <Label>Price Range</Label>
            <div className="mt-2 flex h-16 w-full items-end gap-px">
              {scaledHistogramData.map((percentage, index) => (
                <div
                  key={`histogram-bin-${index}`}
                  className="flex-1 rounded-t-[3px] bg-border"
                  style={{ height: `${percentage}%` }}
                />
              ))}
            </div>
            <Slider
              minStepsBetweenThumbs={2}
              max={STEP_MAX}
              min={STEP_MIN}
              step={10}
              onValueChange={(values: [number, number]) =>
                setPriceRange(values)
              }
              className="w-full"
              value={[priceRange[0] ?? STEP_MIN, priceRange[1] ?? STEP_MAX]}
            />
            <div className="mt-3 flex w-full items-center justify-between gap-2">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 mt-px inline-flex items-center text-sm font-medium leading-10 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={priceRange[0] ?? ''}
                  placeholder={STEP_MIN.toString()}
                  min={STEP_MIN}
                  onChange={(e) => {
                    const inputVal = e.target.value
                    let newVal: number | undefined
                    if (inputVal !== '' && !isNaN(Number(inputVal))) {
                      newVal = Number(inputVal)
                    }
                    setPriceRange([newVal, priceRange[1]])
                  }}
                  onBlur={(e) => {
                    const inputVal = e.target.value
                    if (inputVal === '') return
                    const newValue = +inputVal
                    if (newValue < STEP_MIN) {
                      setPriceRange([STEP_MIN, priceRange[1]])
                    }
                    if (newValue >= (priceRange?.[1] ?? PRICE_MAX)) {
                      setPriceRange([
                        Math.max((priceRange?.[1] ?? PRICE_MAX) - 20, 0),
                        priceRange[1],
                      ])
                    }
                  }}
                  className="h-8 w-[5.125rem] pl-6"
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 mt-px inline-flex items-center text-sm font-medium leading-10 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={priceRange[1] ?? ''}
                  placeholder={STEP_MAX.toString()}
                  onChange={(e) => {
                    const inputVal = e.target.value
                    let newVal: number | undefined
                    if (inputVal !== '' && !isNaN(+inputVal)) {
                      newVal = +inputVal
                    }
                    setPriceRange([priceRange[0], newVal])
                  }}
                  onBlur={(e) => {
                    const inputVal = e.target.value
                    if (inputVal === '') return
                    if (+inputVal < STEP_MIN) {
                      setPriceRange([priceRange[0], STEP_MIN])
                    }
                    if (+inputVal > PRICE_MAX) {
                      setPriceRange([priceRange[0], PRICE_MAX])
                    }
                  }}
                  className="h-8 w-[5.125rem] pl-6"
                />
              </div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="flex flex-col space-y-2">
            <Label htmlFor="region">Region</Label>
            <Popover>
              <PopoverTrigger id="region" asChild disabled={regionLoading}>
                <Button
                  size="lg"
                  variant="outline"
                  role="combobox"
                  className="min-w-64 justify-between"
                >
                  <span className="max-w-[20ch] truncate">
                    {region ? region : 'Select region...'}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-0"
              >
                <Command>
                  <CommandInput
                    placeholder="Search regions..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No regions found</CommandEmpty>
                    <CommandGroup>
                      {regionData?.map((regionItem) => {
                        const selected = regionItem === region
                        return (
                          <CommandItem
                            key={`region-${regionItem}`}
                            onSelect={() => {
                              selected ? setRegion(null) : setRegion(regionItem)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-1.5 size-4 shrink-0 transition-transform',
                                selected ? 'scale-100' : 'scale-0'
                              )}
                            />
                            {regionItem}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <ScrollArea className="h-[40rem] w-full flex-1 pr-3" type="auto">
          <div className="grid grid-cols-12 items-center gap-12 rounded border border-primary bg-gradient-to-r from-primary/5 to-[#FFFED9] px-6 py-4">
            <div className="col-span-7 flex items-center gap-4">
              <Icons.Openmesh className="size-14 p-1" />
              <div>
                <div className="flex items-start gap-1">
                  <p className="text-lg font-bold">Openmesh Cloud</p>
                  <span className="rounded bg-primary px-1.5 py-px text-xs font-medium text-background">
                    Beta
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Peer to peer resource marketplace
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="font-medium line-through">
                $260<span>/mo</span>
              </p>
              <p className="text-xl font-bold text-green-600">Free</p>
            </div>
            <div className="col-span-3 flex flex-1 justify-end">
              <div className="flex flex-col items-center gap-2">
                <Button disabled size="lg" className="min-w-48">
                  Coming Soon
                </Button>
                <p className="text-sm text-primary">1,000 OPEN Rewards</p>
              </div>
            </div>
          </div>
          <ul className="mt-8 flex flex-col gap-2 text-black">
            <li className="grid grid-cols-12 items-center gap-12 rounded border border-primary/25 bg-primary/[0.01] px-6 py-4">
              <div className="col-span-7 flex items-center gap-4">
                <Image
                  src={`${prefix}/images/xnode-card/silvercard-front.webp`}
                  alt="Xnode Card"
                  width={56}
                  height={40}
                  className="rounded object-contain"
                />
                <div>
                  <p className="text-lg font-bold">Xnode DVM</p>
                  <p className="text-sm text-muted-foreground">
                    CPU, 8-Core (16-Thread), RAM, 16GB DDR4 ; Storage, 320GB SSD
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-medium line-through">
                  ~$260<span>/mo</span>
                </p>
                <p className="text-xl font-bold text-green-600">Free</p>
              </div>
              <div className="col-span-3 flex flex-1 justify-end">
                <div className="flex flex-col items-center gap-2">
                  <Link href="/claim">
                    <Button
                      size="lg"
                      className="min-w-48"
                      variant="outlinePrimary"
                    >
                      Select
                    </Button>
                  </Link>
                  <p className="text-sm text-primary">$200 Cashback</p>
                </div>
              </div>
            </li>
            {providerData !== undefined ? (
              providerData.data.length === 0 ? (
                <li className="my-12 grid place-content-center text-xl font-bold">
                  No results found.
                </li>
              ) : (
                providerData.data
                  .slice(
                    0,
                    loadingProgress > -1
                      ? Math.round(
                          (providerData.data.length *
                            Math.max(loadingProgress, 0)) /
                            TEMP_FETCH_ENDPOINTS
                        )
                      : undefined
                  )
                  .map((provider) => {
                    let config = ''
                    if (provider.cpuGHZ) config += `${provider.cpuGHZ}GHz `
                    if (provider.cpuCores)
                      config += `${provider.cpuCores}-Core `
                    if (provider.cpuThreads)
                      config += `(${provider.cpuThreads} threads)`
                    if (provider.ram) config += `, ${provider.ram}GB RAM`
                    if (provider.storageTotal)
                      config += `, ${provider.storageTotal} GB`
                    if (provider.network) config += `, ${provider.network} Gbps`
                    return (
                      <li
                        key={provider.id}
                        className="grid grid-cols-12 items-center gap-12 rounded border px-6 py-4"
                      >
                        <div className="col-span-5 flex items-center gap-4">
                          <Image
                            src={`${prefix}/images/providers/${provider.providerName.toLowerCase()}.svg`}
                            alt={provider.providerName + ' logo'}
                            width={64}
                            height={64}
                            className="text-xs"
                          />
                          <div>
                            <p className="font-bold">{provider.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {config}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="size-3.5" />
                            <p className="text-sm">{provider.location}</p>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Server className="size-3.5" />
                            <p className="text-sm">{provider.providerName}</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <p>
                            ~
                            <span
                              className={cn(
                                provider.priceSale
                                  ? 'line-through'
                                  : 'text-xl font-bold'
                              )}
                            >
                              {formatPrice(provider.priceMonth ?? 0)}
                            </span>
                            /mo
                          </p>
                          {provider.priceSale !== null ? (
                            <p>
                              ~
                              <span className="text-xl font-bold">
                                {formatPrice(provider.priceSale)}
                              </span>
                              /mo
                            </p>
                          ) : null}
                        </div>
                        <div className="col-span-3 flex flex-1 justify-end">
                          <div className="flex flex-col items-center gap-2">
                            <Button
                              variant={'outlinePrimary'}
                              size="lg"
                              className="min-w-48"
                              onClick={() => {
                                setConfig((prev) => ({
                                  ...prev,
                                  name: provider.productName!,
                                  provider: provider.providerName!,
                                  location: provider.location!,
                                  isUnit: false,
                                }))
                                onSelect()
                              }}
                            >
                              Select
                            </Button>
                            {provider.priceSale !== null ? (
                              <p className="text-sm text-primary">
                                {formatPrice(
                                  (provider.priceMonth ?? 0) -
                                    provider.priceSale
                                )}{' '}
                                Cashback
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    )
                  })
              )
            ) : null}
          </ul>
        </ScrollArea>
      </div>
    </div>
  )
}
