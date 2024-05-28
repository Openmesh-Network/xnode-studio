'use client'
import { ReactElement, useState } from 'react'
import { usePathname } from 'next/navigation'
import { HouseLine } from 'phosphor-react'
import Link from 'next/link'

import * as Accordion from '@radix-ui/react-accordion'
import { APIIcon } from '../Icons/APIIcon'
import { LateralNavListItem } from './ListItem'
import { LateralNavListCollapsableItem } from './CollapsableListItem'
import { ServersIcon } from '../Icons/ServersIcon'
import { DataIcon } from '../Icons/DataIcon'

export interface NavItemsProps {
  label: string
  href: string
  icon?: ReactElement
  activeIcon?: ReactElement
  collapsable?: boolean
  subItems?: NavItemsProps[]
}

export function LateralNav() {
  const [expandedItem, setExpandedItem] = useState<string>('')

  const navItems: NavItemsProps[] = [
    {
      label: 'Home',
      href: '/',
      icon: <HouseLine size={20} weight="regular" color="#4D4D4D" />,
      // activeIcon: <HouseLine size={20} weight="regular" color="#0059FF" />,
      collapsable: false,
      subItems: [],
    },
    {
      label: 'Workspace',
      href: '/workspace',
      icon: <HouseLine size={20} weight="regular" color="#4D4D4D" />,
      // activeIcon: <HouseLine size={20} weight="regular" color="#0059FF" />,
      collapsable: true,
      subItems: [],
    },
    {
      label: 'Servers',
      href: '/servers',
      icon: <ServersIcon />,
      activeIcon: <ServersIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/servers',
        },
        {
          label: 'Servers',
          href: '/servers',
        },
        {
          label: 'Documentation',
          href: '/servers',
        },
      ],
    },
    {
      label: 'Data',
      href: '/data',
      icon: <DataIcon />,
      activeIcon: <DataIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/data',
        },
        {
          label: 'Data',
          href: '/data',
        },
        {
          label: 'Documentation',
          href: '/data',
        },
      ],
    },
  ]

  const pathname = usePathname()

  return (
    <aside className="flex-grow-1 hidden w-[280px] flex-col border-r border-[#D1D5DB] bg-gray100 lg:flex">
      <div>
        <span className="block px-6 py-4 text-xs font-medium uppercase text-darkGray">
          STUDIO
        </span>

        <Accordion.Root type="single" defaultValue="item-1" collapsible>
          <ul>
            {navItems.map(
              ({ activeIcon, collapsable, href, icon, label, subItems }) => {
                const isActive = pathname.includes(href)

                const currentIcon = icon
                const isExpanded = expandedItem === label

                if (collapsable)
                  return (
                    <LateralNavListCollapsableItem
                      subItems={subItems}
                      key={label}
                      icon={currentIcon}
                      isActive={isActive}
                      isExpanded={isExpanded}
                      label={label}
                      onExpand={() => {
                        if (isExpanded) {
                          setExpandedItem('')
                        } else setExpandedItem(label)
                      }}
                    />
                  )

                return (
                  <li key={label}>
                    <Link href={href}>
                      <LateralNavListItem
                        icon={currentIcon}
                        isActive={isActive}
                        label={label}
                      />
                    </Link>
                  </li>
                )
              },
            )}
          </ul>
        </Accordion.Root>
      </div>
    </aside>
  )
}

export default LateralNav
