'use client'

import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { LogOut, User } from 'lucide-react'
import { useDisconnect } from 'wagmi'

import { navItems } from '@/config/nav'
import { useUser } from '@/hooks/useUser'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

import { PopoverContent } from './ui/popover'

type GlobalSearchProps = {
  onSelect: () => void
}
export function GlobalSearch({ onSelect }: GlobalSearchProps) {
  // const { disconnect } = useDisconnect()
  // const { open } = useWeb3Modal()
  const [user, , setUser] = useUser()
  return (
    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
      <Command>
        <CommandInput
          placeholder="Type a command or search..."
          className="h-10"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={onSelect} asChild>
              <Link href="/claim">
                <Image
                  src={`${prefix}/images/xnode-card/silvercard-front.webp`}
                  alt="Xnode Card"
                  width={16}
                  height={16}
                  className="mr-2 rounded-[1px] object-contain"
                />
                Claim Xnode
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigation">
            {navItems.main
              .filter((navItem) => navItem.type === 'item')
              .map((navItem) => (
                <CommandItem
                  key={`globalSearch-nav-${navItem.name}`}
                  asChild
                  onSelect={onSelect}
                >
                  <Link href={navItem.href}>
                    {navItem.icon ? (
                      <navItem.icon className="mr-2 size-4" />
                    ) : null}
                    <span>{navItem.name}</span>
                  </Link>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Support">
            {navItems.support
              .filter((navItem) => navItem.type === 'item')
              .map((navItem) => (
                <CommandItem
                  key={`globalSearch-nav-${navItem.name}`}
                  asChild
                  onSelect={onSelect}
                >
                  <Link href={navItem.href}>
                    {navItem.icon ? (
                      <navItem.icon className="mr-2 size-4" />
                    ) : null}
                    <span>{navItem.name}</span>
                  </Link>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={onSelect} asChild>
              <Link href="/login">
                <User className="mr-2 size-4" />
                <span>Profile</span>
              </Link>
            </CommandItem>
            {user && (
              <CommandItem
                onSelect={() => {
                  onSelect()
                  setUser(null)
                }}
              >
                <LogOut className="mr-2 size-4" />
                <span>Log out</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  )
}
