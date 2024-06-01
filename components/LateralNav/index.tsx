'use client'
import { ReactElement, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import * as Accordion from '@radix-ui/react-accordion'

import { LateralNavListItem } from './ListItem'
import { LateralNavListCollapsableItem } from './CollapsableListItem'

import {
  IntegrationsIcon,
  ServersIcon,
  APIIcon,
  AnalyticsIcon,
  CommunityIcon,
  ComputeIcon,
  DataIcon,
  DocumentationIcon,
  FAQIcon,
  HomeIcon,
  RPCIcon,
  SettingsIcon,
  StorageIcon,
  TradingIcon,
  WorkspaceIcon,
  MachineLearningIcon,
} from '../Icons'
import { ProfileIcon } from '../Icons/ProfileIcon'

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

  const studioItems: NavItemsProps[] = [
    {
      label: 'Home',
      href: '/',
      icon: <HomeIcon />,
      activeIcon: <HomeIcon />,
      collapsable: false,
      subItems: [],
    },
    {
      label: 'Workspace',
      href: '/workspace',
      icon: <WorkspaceIcon />,
      activeIcon: <WorkspaceIcon />,
      collapsable: false,
      subItems: [],
    },
    {
      label: 'Templates',
      href: '/template-products',
      icon: <WorkspaceIcon />,
      activeIcon: <WorkspaceIcon />,
      collapsable: false,
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
    {
      label: 'APIs',
      href: '/apis',
      icon: <APIIcon />,
      activeIcon: <APIIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/apis',
        },
        {
          label: 'APIs',
          href: '/apis',
        },
        {
          label: 'Documentation',
          href: '/apis',
        },
      ],
    },
    {
      label: 'RPC',
      href: '/RPC',
      icon: <RPCIcon />,
      activeIcon: <RPCIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/RPC',
        },
        {
          label: 'RPC',
          href: '/RPC',
        },
        {
          label: 'Documentation',
          href: '/RPC',
        },
      ],
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: <AnalyticsIcon />,
      activeIcon: <AnalyticsIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/analytics',
        },
        {
          label: 'Analytics',
          href: '/analytics',
        },
        {
          label: 'Documentation',
          href: '/analytics',
        },
      ],
    },
    {
      label: 'Data Management',
      href: '/data-management',
      icon: <AnalyticsIcon />,
      activeIcon: <AnalyticsIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/data-management',
        },
        {
          label: 'Data Management',
          href: '/data-management',
        },
        {
          label: 'Documentation',
          href: '/data-management',
        },
      ],
    },
    {
      label: 'Storage',
      href: '/storage',
      icon: <StorageIcon />,
      activeIcon: <StorageIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/storage',
        },
        {
          label: 'Storage',
          href: '/storage',
        },
        {
          label: 'Documentation',
          href: '/storage',
        },
      ],
    },
    {
      label: 'Compute',
      href: '/compute',
      icon: <ComputeIcon />,
      activeIcon: <ComputeIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/compute',
        },
        {
          label: 'Compute',
          href: '/compute',
        },
        {
          label: 'Documentation',
          href: '/compute',
        },
      ],
    },
    {
      label: 'Trading',
      href: '/trading',
      icon: <TradingIcon />,
      activeIcon: <TradingIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/trading',
        },
        {
          label: 'Trading',
          href: '/trading',
        },
        {
          label: 'Documentation',
          href: '/trading',
        },
      ],
    },
    {
      label: 'Machine Learning',
      href: '/machine-learning',
      icon: <MachineLearningIcon />,
      activeIcon: <MachineLearningIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/machine-learning',
        },
        {
          label: 'Machine Learning',
          href: '/machine-learning',
        },
        {
          label: 'Documentation',
          href: '/machine-learning',
        },
      ],
    },
    {
      label: 'Integrations',
      href: '/integrations',
      icon: <IntegrationsIcon />,
      activeIcon: <IntegrationsIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/integrations',
        },
        {
          label: 'Integrations',
          href: '/integrations',
        },
        {
          label: 'Documentation',
          href: '/integrations',
        },
      ],
    },
  ]

  const pageItems: NavItemsProps[] = [
    {
      label: 'Profile',
      href: '/profile',
      icon: <ProfileIcon />,
      activeIcon: <ProfileIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/profile',
        },
        {
          label: 'Profile',
          href: '/profile',
        },
        {
          label: 'Documentation',
          href: '/profile',
        },
      ],
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />,
      activeIcon: <SettingsIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/settings',
        },
        {
          label: 'Settings',
          href: '/settings',
        },
        {
          label: 'Documentation',
          href: '/settings',
        },
      ],
    },
    {
      label: 'FAQs',
      href: '/faqs',
      icon: <FAQIcon />,
      activeIcon: <FAQIcon />,
      collapsable: false,
      subItems: [],
    },
  ]

  const supportItems: NavItemsProps[] = [
    {
      label: 'Documentation',
      href: '/documentation',
      icon: <DocumentationIcon />,
      activeIcon: <DocumentationIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/documentation',
        },
        {
          label: 'Documentation',
          href: '/documentation',
        },
        {
          label: 'Documentation',
          href: '/documentation',
        },
      ],
    },
    {
      label: 'Community',
      href: '/community',
      icon: <CommunityIcon />,
      activeIcon: <CommunityIcon />,
      collapsable: true,
      subItems: [
        {
          label: 'Overview',
          href: '/community',
        },
        {
          label: 'Community',
          href: '/community',
        },
        {
          label: 'Documentation',
          href: '/community',
        },
      ],
    },
    {
      label: 'FAQs',
      href: '/faqs',
      icon: <FAQIcon />,
      activeIcon: <FAQIcon />,
      collapsable: false,
      subItems: [
        {
          label: 'Overview',
          href: '/FAQs',
        },
        {
          label: 'FAQs',
          href: '/FAQs',
        },
        {
          label: 'Documentation',
          href: '/FAQs',
        },
      ],
    },
  ]

  const pathname = usePathname()

  return (
    <aside className="flex-grow-1 hidden w-full max-w-[280px] flex-col border-r border-[#D1D5DB] bg-gray100 lg:flex">
      <div className="flex flex-col py-4">
        <span className="block px-6 pb-2 text-xs font-medium uppercase text-darkGray">
          STUDIO
        </span>

        <Accordion.Root type="single" defaultValue="item-1" collapsible>
          <ul>
            {studioItems.map(
              ({ activeIcon, collapsable, href, icon, label, subItems }) => {
                const isActive = pathname === href

                const currentIcon = isActive ? activeIcon : icon
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

      <div className="flex flex-col py-4">
        <span className="block px-6 pb-2 text-xs font-medium uppercase text-darkGray">
          PAGES
        </span>

        <Accordion.Root type="single" defaultValue="item-1" collapsible>
          <ul>
            {pageItems.map(
              ({ activeIcon, collapsable, href, icon, label, subItems }) => {
                const isActive = pathname === href

                const currentIcon = isActive ? activeIcon : icon
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

      <div className="flex flex-col py-4">
        <span className="block px-6 pb-2 text-xs font-medium uppercase text-darkGray">
          SUPPORT
        </span>

        <Accordion.Root type="single" defaultValue="item-1" collapsible>
          <ul>
            {supportItems.map(({ activeIcon, href, icon, label, subItems }) => {
              const isActive = pathname === href

              const currentIcon = isActive ? activeIcon : icon
              const isExpanded = expandedItem === label

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
            })}
          </ul>
        </Accordion.Root>
      </div>
    </aside>
  )
}

export default LateralNav
