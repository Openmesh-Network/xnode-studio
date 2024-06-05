'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { getAPI } from '@/utils/data'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import Image from 'next/image'
import { AccountContext } from '@/contexts/AccountContext'
import { Provider } from '@/db/schema'
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { ChevronsUpDown, X } from 'lucide-react'

import { TemplatesProducts } from '@/types/dataProvider'
import { Input } from '@/components/ui/input'

import { Button } from '../ui/buttons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import Dropdown, { ValueObject } from './Dropdown'

export const optionsNetwork = [
  {
    name: 'Equinix',
    value: 'Equinix',
  },
  {
    name: 'Vultr',
    value: 'Vultr',
  },
  {
    name: 'OneProvider',
    value: 'OneProvider',
  },
  {
    name: 'Heficed',
    value: 'Heficed',
  },
  {
    name: 'Latitude.sh',
    value: 'Latitude.sh',
  },
  {
    name: 'PhoenixNap',
    value: 'PhoenixNap',
  },
  {
    name: 'Fasthosts',
    value: 'Fasthosts',
  },
  {
    name: 'Colohouse',
    value: 'Colohouse',
  },
  {
    name: 'AMD House',
    value: 'AMD House',
  },
]

type dataAPI = {
  products: TemplatesProducts[]
  hasMorePages: boolean
  totalProducts: number
}

export const providerNameToLogo = {
  Equinix: {
    src: 'new-equinix.png',
    width: 'w-[50px]',
  },
}

const TemplateProducts = () => {
  const [templates, setTemplates] = useState<TemplatesProducts[]>([])
  const [page, setPage] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>()
  const debouncedSearchInput = useDebounce(searchInput, 500)
  const [region, setRegion] = useState<string | null>()
  const [hasMorePages, setHasMorePages] = useState<boolean>(false)
  const [totalResults, setTotalResults] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMoreTemplates, setIsLoadingMoreTemplates] = useState(false)
  const [progressLoadingBar, setProgressLoadingBar] = useState(0)
  const [progressLoadingText, setProgressLoadingText] = useState(
    'Checking 19 providers'
  )
  const [selected, setSelected] = useState<ValueObject | null>(null)

  const { data: providerData, isLoading: providersLoading } = useQuery({
    queryKey: ['resources', page, debouncedSearchInput],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      if (debouncedSearchInput) {
        params.append('q', debouncedSearchInput)
      }
      const res = await fetch(`/api/resources?${params.toString()}`)
      return res.json() as Promise<Provider[]>
    },
    placeholderData: keepPreviousData,
  })

  const { data: regionData, isLoading: regionLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await fetch('/api/providers/regions')
      return res.json() as Promise<string[]>
    },
    placeholderData: keepPreviousData,
  })

  const { templateSelected, setTemplateSelected } = useContext(AccountContext)

  return (
    <section>
      <h1 className="text-4xl font-semibold text-black">Select a provider</h1>
      <Separator className="my-12" />
      <div className="flex flex-wrap gap-8">
        <Input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-96"
        />
        <Popover>
          <PopoverTrigger asChild disabled={regionLoading}>
            <Button
              variant="outline"
              role="combobox"
              className="min-w-64 justify-between"
            >
              <span className="max-w-[32ch] truncate">
                {region ? region : 'Select region...'}
              </span>
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Search regions..." />
              <CommandList>
                <CommandEmpty>No regions found</CommandEmpty>
                <CommandGroup>
                  {regionData?.map((region) => (
                    <CommandItem
                      key={`region-${region}`}
                      onSelect={() => {
                        setRegion(region)
                      }}
                    >
                      {region}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          onClick={() => {
            setRegion(null)
            setSearchInput('')
          }}
          className="gap-1.5"
        >
          <X className="size-4 shrink-0" />
          Reset filter
        </Button>
      </div>
      <div className="mt-4">
        {providersLoading ? <p>Loading...</p> : null}
        {providerData !== undefined ? (
          <ul className="flex max-h-[calc(100svh-5rem)] flex-col gap-8 overflow-y-auto text-black">
            {providerData.map((provider) => {
              const selected = templateSelected?.id === String(provider.id)
              let config = ''
              if (provider.cpuGHZ) config += `${provider.cpuGHZ}GHz `
              if (provider.cpuCores) config += `${provider.cpuCores}-Core `
              if (provider.cpuThreads) config += `(${provider.cpuThreads})`
              if (provider.ram) config += `, ${provider.ram}GB RAM`
              if (provider.storageTotal)
                config += `, ${provider.storageTotal} GB`
              if (provider.network) config += `, ${provider.network} Gbps`
              return (
                <li
                  key={provider.id}
                  className="flex items-start gap-12 rounded-lg border border-darkGray/20 p-3 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]"
                >
                  <div>
                    <Image
                      src={`/images/template/${provider.providerName}.png`}
                      alt={provider.providerName}
                      width={50}
                      height={50}
                    />
                    <p>Bare Metal</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {provider.productName}
                    </h3>
                    <p>{provider.location}</p>
                    <p className="mt-4">{config}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p>Est. ${provider.priceMonth}/mo</p>
                    <Button
                      variant={selected ? 'default' : 'outlinePrimary'}
                      size="lg"
                      onClick={() => {
                        if (selected) {
                          setTemplateSelected(null)
                        } else {
                          setTemplateSelected({
                            id: String(provider.id),
                            providerName: provider.providerName,
                            productName: provider.productName,
                            location: provider.location,
                            cpuCores: String(provider.cpuCores),
                            ram: String(provider.ram),
                            priceMonth: String(provider.priceMonth),
                          })
                        }
                      }}
                    >
                      {selected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

export default TemplateProducts
