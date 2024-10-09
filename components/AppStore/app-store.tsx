'use client'

import { useCallback, useMemo, useOptimistic, useTransition } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { prefix } from '@/utils/prefix'
import { AppWindow, X } from 'lucide-react'
import CategoryDefinitions from 'utils/category.json'
import ServiceDefinitions from 'utils/service-definitions.json'
import TemplateDefinitions from 'utils/template-definitions.json'

import { type AppStoreItem, type AppStorePageType } from '@/types/dataProvider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export const optionsNetwork = [
  {
    name: 'Date Created',
    value: 'Date Created',
  },
  {
    name: 'Template Name',
    value: 'Template Name',
  },
]

const obj = {
  name: 'Openmesh Core',
  desc: 'CPU, 8-Core (16-Thread)',
  tags: 'Core app',
  infraId: '#262343',
}
export const optionsCreator = [
  {
    name: 'Openmesh',
    value: 'Openmesh',
  },
]

export const providerNameToLogo = {
  Equinix: {
    src: 'new-equinix.png',
    width: 'w-[50px]',
  },
}

type AppStoreItemProps = {
  data: AppStoreItem
  type: AppStorePageType
}
function AppStoreItem({ data, type }: AppStoreItemProps) {
  const params = useMemo(() => {
    const newParams = new URLSearchParams()
    if (type === 'templates') newParams.set('templateId', data.id)
    if (type === 'use-cases') newParams.set('useCaseId', data.id)
    return newParams
  }, [data.id, type])
  return (
    <Link
      href={data.implemented ? `${prefix}/deploy-new?${params}` : '#'}
      aria-disabled={!data.implemented}
      className="flex shrink-0 basis-1/4 flex-col rounded border p-4 hover:bg-muted aria-disabled:pointer-events-none aria-disabled:opacity-50"
    >
      <div className="flex items-center justify-between">
        {data.logo && data.logo !== '' ? (
          <img
            src={
              data.logo.startsWith('https://')
                ? data.logo
                : `${prefix}${data.logo}`
            }
            alt={`${data.name} logo`}
            width={32}
            height={32}
          />
        ) : (
          <AppWindow
            className="size-8 text-muted-foreground"
            strokeWidth={1.5}
          />
        )}
        <div className="flex"></div>
      </div>
      <div className="flex-1">
        <h3 className="mt-2 text-lg font-semibold text-primary">{data.name}</h3>
        <p className="mt-1 line-clamp-4 text-sm text-muted-foreground">
          {data.desc}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-primary/5 px-2 py-0.5 text-xs text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

type AppStoreProps = {
  categories: string[]
  nftId?: string
  type: AppStorePageType
}
export default function AppStore({ categories, nftId, type }: AppStoreProps) {
  const router = useRouter()
  const params = useSearchParams()
  const useCases = useMemo(() => {
    if (!nftId) return TemplateDefinitions
    return TemplateDefinitions.filter((template) => template.isUnitRunnable)
  }, [nftId])
  const templates = useMemo(() => {
    return ServiceDefinitions.map((def, index) => ({
      ...def,
      id: String(index),
    }))
  }, [])

  const [optimisticCategories, setOptimisticCategories] =
    useOptimistic(categories)
  const [optimisticType, setOptimisticType] = useOptimistic(type)

  const [, startTransition] = useTransition()

  const filteredData = useMemo<AppStoreItem[]>(() => {
    let data: AppStoreItem[] = []
    if (type === 'templates') data = templates
    if (type === 'use-cases') data = useCases
    let filteredData: AppStoreItem[] = []
    if (!optimisticCategories.length || type === 'templates') return data
    for (const dataItem of data) {
      if (
        !optimisticCategories.includes(
          dataItem.category.toLowerCase().replace(/\s/g, '-')
        )
      )
        continue
      filteredData.push(dataItem)
    }
    return filteredData
  }, [optimisticCategories, templates, type, useCases])

  const updateCategories = useCallback(
    (newCategory: string) => {
      const newParams = new URLSearchParams()
      if (params.get('type')) newParams.set('type', params.get('type'))
      const newCategories = optimisticCategories.includes(newCategory)
        ? optimisticCategories.filter((c) => c !== newCategory)
        : [...optimisticCategories, newCategory]
      newCategories.forEach((category) =>
        newParams.append('category', category)
      )
      startTransition(() => {
        setOptimisticCategories(newCategories)
        router.push(`?${newParams}`)
      })
    },
    [optimisticCategories, params, router, setOptimisticCategories]
  )

  const resetFilter = useCallback(() => {
    startTransition(() => {
      setOptimisticCategories([])
      router.push('?')
    })
  }, [router, setOptimisticCategories])

  const changeType = useCallback(
    (type: AppStorePageType) => {
      startTransition(() => {
        const newType: AppStorePageType = type.length === 0 ? 'templates' : type
        setOptimisticType(newType)
        const newParams = new URLSearchParams(params)
        newParams.set('type', newType)
        router.push(`?${newParams}`)
      })
    },
    [params, router, setOptimisticType]
  )

  return (
    <>
      <section className="flex flex-col items-center justify-center bg-gradient-to-r from-[#3C20D8] to-[#9F14BB] py-6 text-background">
        <h1 className="text-3xl font-bold">
          Explore and launch ready made apps and solutions
        </h1>
        <div className="mt-2 text-muted">
          Openmesh App store lets you quickly deploy software on you Xnode
        </div>
      </section>
      <div className="container my-20 max-w-none space-y-8">
        <div className="flex gap-12">
          <div className="w-56" />
          <ToggleGroup
            size="lg"
            variant="underline"
            type="single"
            value={optimisticType}
            onValueChange={(type: AppStorePageType) => changeType(type)}
          >
            <ToggleGroupItem value="templates" className="h-9">
              Templates
            </ToggleGroupItem>
            <ToggleGroupItem value="use-cases" className="h-9">
              Use Cases
            </ToggleGroupItem>
            <ToggleGroupItem disabled value="advanced" className="h-9">
              Advanced
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <section className="flex gap-12">
          <div className="flex w-56 flex-col gap-3">
            <Button
              disabled={optimisticCategories.length === 0}
              variant="outline"
              className="gap-1.5"
              onClick={() => resetFilter()}
            >
              <X className="size-4" />
              Reset
            </Button>
            <Accordion type="multiple" defaultValue={['category']}>
              <AccordionItem value="category">
                <AccordionTrigger className="data-[state=open]:text-primary">
                  Category
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {Object.entries(CategoryDefinitions).map(
                      ([category, amount]) => {
                        const categoryFilterName = category
                          .toLowerCase()
                          .replace(/\s/g, '-')
                        return (
                          <button
                            data-active={optimisticCategories.includes(
                              categoryFilterName
                            )}
                            role="listitem"
                            type="button"
                            key={category}
                            className="group flex w-full items-center justify-between gap-3 px-3 py-1.5 text-muted-foreground"
                            onClick={() => updateCategories(categoryFilterName)}
                          >
                            <span className="flex-1 truncate text-start transition-colors group-hover:text-primary group-data-[active=true]:text-primary">
                              {category}
                            </span>
                            <span className="shrink-0">({amount})</span>
                          </button>
                        )
                      }
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex-1 space-y-12">
            {filteredData.length > 0 ? (
              <div className="space-y-2">
                <h2 className="text-lg font-bold">Featured</h2>
                <div className="grid grid-cols-4 gap-6">
                  {filteredData.slice(0, 4).map((data) => (
                    <AppStoreItem
                      key={`featured-${data.id}`}
                      data={data}
                      type={optimisticType}
                    />
                  ))}
                </div>
              </div>
            ) : null}
            <div className="space-y-2">
              <h2 className="text-lg font-bold">All Apps</h2>
              <div className="grid grid-cols-4 gap-6">
                {filteredData.map((data) => (
                  <AppStoreItem
                    key={`all-${data.id}`}
                    data={data}
                    type={optimisticType}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
