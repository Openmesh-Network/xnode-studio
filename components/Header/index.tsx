'use client'

import Image from 'next/image'

import xNodeLogo from '@/assets/xnode_logo.svg'
import thunderIcon from '@/assets/thunderIcon.svg'
import listMenu from '@/assets/listMenu.svg'

import * as Dialog from '@radix-ui/react-dialog'

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
    <header className="z-40 flex h-[65px] w-full items-center bg-[#1F1F1F] pl-6">
      <div className="flex w-full items-center justify-between gap-x-32">
        <Image src={xNodeLogo} alt="XNode Logo" />

        <div className="hidden items-center gap-x-20 lg:flex">
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
            className="flex h-[65px] items-center gap-x-[10px] bg-blue500 px-9 transition-colors duration-300 hover:bg-blue500/80"
          >
            <Image src={thunderIcon} alt="Thunder icon" />
            <span className="text-sm font-medium text-white">
              Create service and deploy
            </span>
          </Link>
        </div>

        {/* <div className="block lg:hidden">
          <Dialog.Root>
            <Dialog.Trigger>
              <Image src={listMenu} alt="Three lines vector" />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90">
                <Dialog.Content className="text-purple50 border-gray600 bg-gray900 fixed left-[50%] top-[50%] z-50 w-full max-w-[596px] translate-x-[-50%] translate-y-[-50%] rounded-[20px] border bg-black px-9 pb-12 pt-6 focus:outline-none">
                  Hello world
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Portal>
          </Dialog.Root>
        </div> */}
      </div>
    </header>
  )
}
