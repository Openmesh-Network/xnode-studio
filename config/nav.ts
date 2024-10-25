import {
  BookText,
  ChartLine,
  Cloud,
  Cpu,
  DatabaseZap,
  Gauge,
  Globe,
  Home,
  IdCard,
  PackageOpen,
  Rocket,
  Star,
  TestTubeDiagonal,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { type Icon } from '@/components/Icons'

type NavCategory = 'main' | 'support'
export type NavItem = {
  name: string
  icon?: LucideIcon | Icon
} & (
  | {
      type: 'item'
      href: string
    }
  | {
      type: 'category'
      items: NavItem[]
      disabled?: boolean
    }
)
export const navItems: Record<NavCategory, NavItem[]> = {
  main: [
    {
      type: 'item',
      name: 'Home',
      href: '/',
      icon: Home,
    },
    // {
    //   type: 'item',
    //   name: 'Test Xnode',
    //   href: '/explore',
    //   icon: TestTubeDiagonal,
    // },
    {
      type: 'item',
      name: 'Dashboard',
      href: '/dashboard',
      icon: Gauge,
    },
    {
      type: 'item',
      name: 'Deployments',
      href: '/deployments',
      icon: Rocket,
    },
    {
      type: 'item',
      name: 'App Store',
      href: '/app-store',
      icon: PackageOpen,
    },
    {
      type: 'item',
      name: 'Xnode DVM',
      href: '/claim',
      icon: IdCard,
    },
    {
      type: 'item',
      name: 'Rewards',
      href: '/rewards',
      icon: Star,
    },
    {
      type: 'item',
      name: 'Resources',
      href: '/resources',
      icon: DatabaseZap,
    },
    {
      type: 'category',
      name: 'Compute',
      icon: Cpu,
      disabled: true,
      items: [
        {
          type: 'item',
          name: 'Overview',
          href: '/compute',
        },
        {
          type: 'item',
          name: 'Deploy',
          href: '/compute/deploy',
        },
      ],
    },
    {
      type: 'category',
      name: 'Storage',
      icon: Cloud,
      disabled: true,
      items: [{ type: 'item', name: 'Storage', href: '/storage' }],
    },
  ],
  support: [
    {
      type: 'item',
      name: 'Documentation',
      href: 'https://docs.openmesh.network/products/xnode',
      icon: BookText,
    },
    {
      type: 'item',
      name: 'Node Viability',
      href: 'https://www.openmesh.network/naas',
      icon: ChartLine,
    },
    {
      type: 'item',
      name: 'Community',
      href: 'https://discord.com/invite/openmesh',
      icon: Users,
    },
    {
      type: 'item',
      name: 'OpenCircle',
      href: 'https://circle.openmesh.network/',
      icon: Globe,
    },
  ],
}
