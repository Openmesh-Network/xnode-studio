'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AppWindow, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SortDropdown } from './ai-model-dropdown'
import { prefix } from '@/utils/prefix'

type ModelData = {
  model_name: string
  model_sizes: string
  type: string
  pulls: string
  last_updated: string
}

const sortOptions = [
  { value: 'most-popular', label: 'Most Popular' },
  { value: 'recently-updated', label: 'Recently Updated' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
]

const modelTypes = ['General', 'Vision', 'Embedding', 'Code']

function parseRelativeTime(timeString: string): number {
  const [amount, unit] = timeString.split(' ')
  const now = Date.now()
  const number = parseInt(amount)
  
  switch (unit) {
    case 'days':
    case 'day':
      return now - (number * 24 * 60 * 60 * 1000)
    case 'weeks':
    case 'week':
      return now - (number * 7 * 24 * 60 * 60 * 1000)
    case 'months':
    case 'month':
      return now - (number * 30 * 24 * 60 * 60 * 1000)
    default:
      return now
  }
}

function ModelCard({ data }: { data: ModelData }) {
  const sizes = data.model_sizes.split(',')
  const iconPath = data.model_name === 'deepseek-r1' 
    ? `${prefix}/images/models/deepseek.png` 
    : `${prefix}/images/models/ai-models.png`
  
  return (
    <div className="flex flex-col rounded-lg border p-4 hover:bg-muted/50">
      <div className="flex items-start gap-4">
        <img 
          src={iconPath}
          alt={data.model_name}
          className="-ml-2 size-12 object-contain"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{data.model_name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            A powerful language model for natural text generation and understanding
          </p>
        </div>
        <span className="ml-auto text-sm text-muted-foreground">{data.last_updated}</span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
            >
              {size.trim()}
            </span>
          ))}
        </div>
        <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
          {data.type}
        </span>
      </div>
    </div>
  )
}

type AIModelDirectoryProps = {
  initialModels: ModelData[]
}

export default function AIModelDirectory({ initialModels }: AIModelDirectoryProps) {
  const [sortBy, setSortBy] = useState('recently-updated')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredAndSortedModels = useMemo(() => {
    let models = [...initialModels]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      models = models.filter(model => 
        model.model_name.toLowerCase().includes(query)
      )
    }
    
    // Apply type filters
    if (selectedTypes.length > 0) {
      models = models.filter(model => selectedTypes.includes(model.type))
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'most-popular':
        models.sort((a, b) => parseFloat(b.pulls) - parseFloat(a.pulls))
        break
      case 'recently-updated':
        models.sort((a, b) => {
          const dateA = parseRelativeTime(a.last_updated)
          const dateB = parseRelativeTime(b.last_updated)
          return dateB - dateA
        })
        break
      case 'name-asc':
        models.sort((a, b) => a.model_name.localeCompare(b.model_name))
        break
      case 'name-desc':
        models.sort((a, b) => b.model_name.localeCompare(a.model_name))
        break
    }
    
    return models
  }, [initialModels, sortBy, selectedTypes, searchQuery])

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            App Store
          </Link>
          <span>/</span>
          <span className="text-foreground">AI model directory</span>
        </div>

        {/* Search and Filters Container */}
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative w-full lg:w-[300px]">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Type Filter Tags */}
          <div className="flex flex-wrap justify-center gap-2 lg:flex-1">
            {modelTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                className={cn(
                  "transition-colors",
                  selectedTypes.includes(type) && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => toggleType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex justify-end">
            <SortDropdown 
              value={sortBy}
              onValueChange={setSortBy}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedModels.map((model) => (
          <ModelCard key={model.model_name} data={model} />
        ))}
      </div>
    </div>
  )
} 