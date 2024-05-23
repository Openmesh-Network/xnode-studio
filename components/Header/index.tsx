'use client'

import Image from 'next/image'

import xNodeLogo from '@/assets/xnode_logo.svg'
import thunderIcon from '@/assets/thunderIcon.svg'
import Link from 'next/link'

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
    <header className="z-40 w-full bg-darkGray px-6 py-4">
      <div className="flex w-full items-center justify-between gap-x-32">
        <Image src={xNodeLogo} alt="XNode Logo" />

        <div className="flex items-center gap-x-20">
          <nav className="flex items-center gap-x-12">
            {headerItems.map((option, index) => (
              <Link
                key={index}
                href={`${option.href}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="hover:text-gray200 text-white transition-colors duration-300">
                  {option.label}
                </span>
              </Link>
            ))}
          </nav>

          <Link
            href={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? `/xnode/template-products/eae27511-c846-4db0-ac8c-bf3531873e7a`
                : `/template-products/eae27511-c846-4db0-ac8c-bf3531873e7a`
            }`}
            className="transition-color flex h-9 items-center gap-x-[10px] rounded-[5px] bg-[#0059FF] px-4 duration-300 hover:bg-blue500/80"
          >
            <Image src={thunderIcon} alt="Thunder icon" />
            <span className="text-sm text-white">Create and deploy</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
