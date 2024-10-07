'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from 'react'

import 'react-toastify/dist/ReactToastify.css'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { prefix } from '@/utils/prefix'
import { X } from 'lucide-react'
import CategoryDefinitions from 'utils/category.json'
import TemplateDefinitions from 'utils/template-definitions.json'

import { TemplateData } from '@/types/dataProvider'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { ValueObject } from './Dropdown'

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

type AppStoreProps = {
  categories: string[]
  nftId?: string
}

type TemplateCardProps = {
  template: TemplateData
  nftId?: string
}
function TemplateCard({ template, nftId }: TemplateCardProps) {
  return (
    <Link
      href={
        template.implementation
          ? `${prefix}/deploy?tId=${template.id}${nftId ? `&nftId=${nftId}` : ''}`
          : '#'
      }
      className="flex shrink-0 basis-1/4 flex-col rounded border p-4 hover:bg-muted"
    >
      <div className="flex items-center justify-between">
        <img
          src={
            template.logo.startsWith('https://')
              ? template.logo
              : `${prefix}${template.logo}`
          }
          alt={`${template.name} logo`}
          width={32}
          height={32}
        />
        <div className="flex"></div>
      </div>
      <div className="flex-1">
        <h3 className="mt-2 text-lg font-semibold text-primary">
          {template.name}
        </h3>
        <p className="mt-1 line-clamp-4 text-sm text-muted-foreground">
          {template.desc}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {template.tags.map((tag) => (
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

export default function TemplateStep({ categories, nftId }: AppStoreProps) {
  const router = useRouter()
  const templates = useMemo(() => {
    if (!nftId) return TemplateDefinitions
    return TemplateDefinitions.filter((template) => template.isUnitRunnable)
  }, [nftId])
  const [optimisticCategories, setOptimisticCategories] =
    useOptimistic(categories)
  const [, startTransition] = useTransition()

  const filteredTemplates = useMemo<TemplateData[]>(() => {
    if (!optimisticCategories.length) return templates
    const filteredTemplates: TemplateData[] = []
    for (const template of templates) {
      if (
        !optimisticCategories.includes(
          template.category.toLowerCase().replace(/\s/g, '-')
        )
      )
        continue
      filteredTemplates.push(template)
    }
    return filteredTemplates
  }, [optimisticCategories, templates])

  const updateCategories = useCallback(
    (newCategory: string) => {
      const newParams = new URLSearchParams()
      console.log(optimisticCategories, newCategory)

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
    [optimisticCategories, router, setOptimisticCategories]
  )

  const resetFilter = useCallback(() => {
    startTransition(() => {
      setOptimisticCategories([])
      router.push('?')
    })
  }, [router, setOptimisticCategories])

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
      <section className="container my-20 flex max-w-none gap-12">
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
          {filteredTemplates.length > 0 ? (
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Featured</h2>
              <div className="grid grid-cols-4 gap-6">
                {filteredTemplates.slice(0, 5).map((template) => (
                  <TemplateCard template={template} nftId={nftId} />
                ))}
              </div>
            </div>
          ) : null}
          <div className="space-y-2">
            <h2 className="text-lg font-bold">All Apps</h2>
            <div className="grid grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard template={template} nftId={nftId} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
