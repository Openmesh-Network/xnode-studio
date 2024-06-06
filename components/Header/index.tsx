'use client'

import Image from 'next/image'
import Link from 'next/link'
import thunderIcon from '@/assets/thunderIcon.svg'
import xNodeLogo from '@/assets/xnode_logo.svg'

export function Header() {
  const headerItems = [
    // {
    //   label: 'Xnode Innovation',
    //   href: `https://docs.openmesh.network/products/xnode`,
    // },
    {
      label: 'About',
      href: `https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/openmesh-overview`,
    },
    {
      label: 'Use cases',
      href: `https://docs.openmesh.network/products/xnode`,
    },
    {
      label: 'Innovation',
      href: `https://docs.openmesh.network/products/xnode`,
    },
    {
      label: 'Docs',
      href: `https://openmesh.network/xnode/docs`,
    },
  ]

  return (
    <header className="fixed z-50 flex h-16 w-full items-center justify-between gap-x-32 bg-[#1F1F1F] pl-6">
      <Image src={xNodeLogo} alt="XNode Logo" />

      <div className="hidden h-full items-center gap-x-20 lg:flex">
        <nav className="flex items-center gap-x-12">
          {headerItems.map((option, index) => (
            <Link
              key={index}
              href={`${option.href}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-white transition-colors duration-300 hover:text-gray200">
                {option.label}
              </span>
            </Link>
          ))}
        </nav>

        <Link
          href={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? `/xnode/template-products/`
              : `/template-products/`
          }`}
          className="flex h-full items-center gap-x-[10px] bg-blue500 px-9 transition-colors duration-300 hover:bg-blue500/80"
        >
          <Image src={thunderIcon} alt="Thunder icon" />
          <span className="text-sm font-medium text-white">
            Create service and deploy
          </span>
        </Link>
      </div>
    </header>
  )
}
