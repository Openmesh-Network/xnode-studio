import { ComponentProps, ReactElement } from 'react'
import Link from 'next/link'
import * as Accordion from '@radix-ui/react-accordion'
import { CaretDown } from 'phosphor-react'

import { NavItemsProps } from '.'

interface LateralNavListCollapsableItemProps extends ComponentProps<'div'> {
  isActive: boolean
  isExpanded: boolean
  icon: ReactElement
  label: string
  onExpand: () => void
  subItems: Pick<NavItemsProps, 'href' | 'label'>[]
}

export function LateralNavListCollapsableItem({
  icon,
  isActive,
  label,
  isExpanded,
  onExpand,
  subItems,
}: LateralNavListCollapsableItemProps) {
  return (
    <Accordion.Item
      key={label}
      value={label}
      className={`relative flex flex-col items-center ${
        isActive ? 'bg-[#E5EEFC]' : 'bg-transparent'
      }`}
    >
      <Accordion.Trigger
        onClick={onExpand}
        className="flex w-full items-center justify-between"
      >
        <div
          className={`relative flex h-12 w-full items-center${
            isActive ? 'bg-[#E5EEFC]' : 'bg-transparent'
          }`}
        >
          {isActive ? (
            <div className="absolute inset-y-0 left-0 w-1 bg-blue500" />
          ) : null}
          <div className="flex w-full items-center justify-between px-6">
            <div className="flex items-center gap-x-3">
              {icon}
              <strong
                className={
                  isActive
                    ? 'text-sm font-bold text-darkGray'
                    : 'text-sm font-medium text-darkGray'
                }
              >
                {label}
              </strong>
            </div>
            <CaretDown
              weight="bold"
              size={16}
              color="#4D4D4D"
              className={`transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </div>
      </Accordion.Trigger>
      <Accordion.Content className="w-full overflow-hidden text-darkGray data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
        <div className="flex w-full flex-col gap-y-2 px-12 pb-2">
          {subItems.map(({ href, label }) => {
            return (
              <Link key={label} href={href}>
                <span className="text-sm font-medium text-darkGray transition-colors duration-300 hover:opacity-70">
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}
