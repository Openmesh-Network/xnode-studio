'use client'

import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { Provider } from '@/db/schema'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/buttons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

const TemplateProducts = () => {
  const [page, setPage] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>()
  const debouncedSearchInput = useDebounce(searchInput, 500)
  const [region, setRegion] = useState<string | null>()

  const {
    data: { data: providerData },
    isLoading: providersLoading,
  } = useQuery({
    queryKey: ['resources', page, debouncedSearchInput, region],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      if (debouncedSearchInput) {
        params.append('q', debouncedSearchInput)
      }
      if (region) {
        params.append('r', region)
      }
      const res = await fetch(`/api/resources?${params.toString()}`)
      return res.json() as Promise<{ data: Provider[] }>
    },
    placeholderData: keepPreviousData,
  })

  const { data: regionData, isLoading: regionLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await fetch('/api/providers/regions')
      return res.json() as Promise<string[]>
    },
  })

  const { templateSelected, setTemplateSelected } = useContext(AccountContext)

  return (
    <section>
      <h1 className="text-4xl font-semibold text-black">Select a provider</h1>
      <Separator className="my-12" />
      <div className="flex flex-wrap gap-4">
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
          <PopoverContent align="start" className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Search regions..." />
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
        <Button
          size="lg"
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
          providerData.length === 0 ? (
            <p>No results found</p>
          ) : (
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
                    className="flex items-start gap-12 rounded-lg border border-darkGray/20 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]"
                  >
                    <div>
                      {/* <Image
                      src={`/images/template/${provider.providerName}.png`}
                      alt={provider.providerName}
                      width={50}
                      height={50}
                    /> */}
                      <p>Bare Metal</p>
                    </div>
                    <div className="grow">
                      <h3 className="text-lg font-semibold">
                        {provider.productName}
                      </h3>
                      <p>{provider.location}</p>
                      <p className="mt-4">{config}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p>Est. ${provider.priceMonth}/mo</p>
                      <Button
                        variant={selected ? 'default' : 'outlinePrimary'}
                        size="lg"
                        className="min-w-56"
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
          )
        ) : null}
      </div>
    </section>
  )
}

export default TemplateProducts
