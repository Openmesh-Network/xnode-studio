import { useState } from 'react'
import { ChevronRight, RefreshCcw } from 'lucide-react'

import type { ServiceOption } from '@/types/dataProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'

export type ServiceOptionInputProps = {
  value: ServiceOption['value']
  option: ServiceOption
  updateOption: (newVal: ServiceOption['value']) => void
}
export function ServiceOptionInput({
  value,
  option,
  updateOption,
}: ServiceOptionInputProps) {
  return (
    <TableCell>
      {option.type === 'string' ||
      (option.type !== 'boolean' && !option.type.includes('integer')) ? (
        <Input
          value={value}
          onChange={(e) => {
            const newVal = e.target.value
            updateOption(newVal)
          }}
          className="h-8 px-2.5"
        />
      ) : null}
      {option.type === 'boolean' ? (
        <Checkbox
          checked={value === 'true'}
          onCheckedChange={(checked) => {
            const newVal = checked ? 'true' : 'false'
            updateOption(newVal.trim())
          }}
        />
      ) : null}
      {option.type.includes('integer') ? (
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const newVal = e.target.value
            updateOption(newVal.trim())
          }}
          className="h-8 px-2.5"
        />
      ) : null}
    </TableCell>
  )
}

export type ServiceOptionRowProps = {
  option: ServiceOption
  value?: (
    option: ServiceOption['nixName'],
    parentOption?: ServiceOption['nixName']
  ) => ServiceOption['value']
  onUpdate: (
    newVal: ServiceOption['value'],
    option: ServiceOption['nixName'],
    parentOption?: ServiceOption['nixName']
  ) => void
  canReset: (option: ServiceOption['nixName']) => boolean
  onReset: (
    option: ServiceOption['nixName'],
    parentOption?: ServiceOption['nixName']
  ) => void
  parentOption?: ServiceOption['nixName']
}
export function ServiceOptionRow({
  option,
  value,
  onUpdate,
  canReset,
  onReset,
  parentOption,
}: ServiceOptionRowProps) {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <>
      <TableRow key={option.nixName}>
        <TableCell
          className={cn(option.options && 'font-bold', parentOption && 'pl-6')}
          colSpan={option.options?.length ? 3 : 1}
        >
          <span className="inline-flex items-center gap-2.5">
            {option.options?.length ? (
              <Button size="iconSm" className="size-6" variant="outline">
                <span className="sr-only">
                  {collapsed ? 'Expand' : 'Collapse'}
                </span>
                <ChevronRight
                  className={cn(
                    'size-3.5 transition-transform',
                    collapsed ? 'rotate-0' : 'rotate-90'
                  )}
                  onClick={() => setCollapsed(!collapsed)}
                />
              </Button>
            ) : null}
            {option.name ?? option.nixName}
          </span>
        </TableCell>
        {/* <TableCell>{option.desc}</TableCell> */}
        {!option.options?.length ? (
          <>
            <ServiceOptionInput
              value={value?.(option.nixName, parentOption) ?? option.value}
              option={option}
              updateOption={(newVal) =>
                onUpdate(newVal, option.nixName, parentOption)
              }
            />
            <TableCell>
              <span className="flex justify-end">
                <Button
                  disabled={canReset(option.nixName)}
                  size="iconSm"
                  variant="outline"
                  onClick={() => onReset(option.nixName, parentOption)}
                >
                  <RefreshCcw className="size-3.5" />
                </Button>
              </span>
            </TableCell>
          </>
        ) : null}
      </TableRow>
      {!collapsed &&
        option.options?.map((subOption) => (
          <ServiceOptionRow
            key={`${option.nixName}-${subOption.nixName}`}
            value={value}
            option={subOption}
            onUpdate={onUpdate}
            canReset={canReset}
            onReset={onReset}
            parentOption={option.nixName}
          />
        ))}
    </>
  )
}
