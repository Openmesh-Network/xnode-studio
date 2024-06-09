import React from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface ComboBoxProps {
  disabled?: boolean
  data: string[]
  selectedItem: string | null
  setItemSelect: (item: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  noItemsText?: string
  className?: string
  comboBoxWidth?: string
}

const ComboBox: React.FC<ComboBoxProps> = ({
  disabled = false,
  data,
  selectedItem,
  setItemSelect,
  placeholder = 'Select an item...',
  searchPlaceholder = 'Search...',
  noItemsText = 'No items found',
  className = 'min-w-64',
  comboBoxWidth = 'w-80',
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          size="lg"
          variant="outline"
          role="combobox"
          className={cn(className, 'justify-between')}
        >
          <span className="truncate font-normal">
            {selectedItem ? selectedItem : placeholder}
          </span>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn(comboBoxWidth, 'p-0')}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noItemsText}</CommandEmpty>
            <CommandGroup>
              {data?.map((item) => {
                const selected = item === selectedItem
                return (
                  <CommandItem
                    key={`item-${item}`}
                    onSelect={() => {
                      selected ? setItemSelect(null) : setItemSelect(item)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-1.5 size-4 shrink-0 transition-transform',
                        selected ? 'scale-100' : 'scale-0'
                      )}
                    />
                    {item}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboBox
