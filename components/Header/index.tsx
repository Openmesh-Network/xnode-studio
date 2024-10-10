'use client'

import { useState } from 'react'
import { formatAddress } from '@/utils/functions'
import { useXueNfts, useXuNfts } from '@/utils/nft'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import {
  BellDot,
  Check,
  ChevronsUpDown,
  HelpCircle,
  PanelLeft,
  Plus,
  Search,
  Settings,
  User2,
} from 'lucide-react'
import { useAccount } from 'wagmi'

import { cn, formatXNodeName } from '@/lib/utils'
import useSelectedXNode from '@/hooks/useSelectedXNode'
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

import ActivateXNodeDialog from '../xnode/activate-dialog'

export function Header() {
  const { address, status } = useAccount()
  const { data: activeXNodes } = useXuNfts(address)
  const { data: inactiveXNodes } = useXueNfts(address)

  const { open } = useWeb3Modal()

  const [selectedXNode, selectXNode] = useSelectedXNode(
    activeXNodes?.length ? activeXNodes.at(0)?.toString() : null
  )

  const totalNodes = activeXNodes?.length + inactiveXNodes?.length

  const [activationOpen, setActivationOpen] = useState<string | null>()

  return (
    <>
      <ActivateXNodeDialog
        address={address}
        open={!!activationOpen}
        onOpenChange={() => setActivationOpen(null)}
        entitlementNft={activationOpen ? BigInt(activationOpen) : undefined}
      />
      <header className="sticky inset-x-0 top-0 z-50 flex h-20 items-center justify-between gap-x-32 bg-foreground px-6">
        <div className="flex items-center gap-6">
          <div className="shrink-0 text-2xl font-medium text-background">
            Xnode Studio
          </div>
          <Popover>
            <PopoverTrigger className="flex h-9 min-w-56 items-center justify-between rounded border border-background/15 bg-background/10 px-3 text-sm text-background">
              <span className="flex items-center gap-1.5">
                <PanelLeft className="size-3.5" />
                {selectedXNode
                  ? formatXNodeName(selectedXNode)
                  : 'Select your Xnode...'}
              </span>
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                {totalNodes > 4 ? (
                  <CommandInput placeholder="Search your Xnode" />
                ) : null}
                <CommandList>
                  <CommandEmpty>No Xnode found.</CommandEmpty>
                  <CommandGroup heading="Active">
                    {activeXNodes?.map((xNode) => {
                      const name = formatXNodeName(xNode.toString())
                      return (
                        <CommandItem
                          key={xNode}
                          value={xNode.toString()}
                          keywords={[name]}
                          onSelect={(val) => selectXNode(val)}
                        >
                          <Check
                            className={cn(
                              'mr-2 size-4 transition-transform',
                              selectedXNode === xNode.toString()
                                ? 'scale-100'
                                : 'scale-0'
                            )}
                          />
                          {name}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                  {inactiveXNodes?.length > 0 ? (
                    <CommandGroup heading="Inactive">
                      {inactiveXNodes?.map((xNode) => {
                        const name = formatXNodeName(xNode.toString())
                        return (
                          <CommandItem
                            key={xNode}
                            value={xNode.toString()}
                            keywords={[name]}
                            className="justify-between"
                            onSelect={(val) => setActivationOpen(val)}
                          >
                            {name}
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              activate
                            </span>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  ) : null}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <button
          type="button"
          className="flex h-9 min-w-56 max-w-lg grow items-center gap-3 rounded border border-background/15 bg-background/10 px-3 text-muted transition-colors hover:bg-background/15"
        >
          <Search className="size-4" />
          <span className="text-sm">Search & Run Commands</span>
        </button>
        <div className="flex items-center gap-6">
          <button
            disabled
            type="button"
            className="flex size-9 items-center justify-center rounded bg-primary text-background transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="size-5" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 text-background">
            <button
              disabled
              type="button"
              className="flex size-9 items-center justify-center rounded transition-colors hover:bg-background/10 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="sr-only">Notifications</span>
              <BellDot className="size-5" strokeWidth={1.5} />
            </button>
            <button
              disabled
              type="button"
              className="flex size-9 items-center justify-center rounded transition-colors hover:bg-background/10 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="sr-only">Help</span>
              <HelpCircle className="size-5" strokeWidth={1.5} />
            </button>
            <button
              disabled
              type="button"
              className="flex size-9 items-center justify-center rounded transition-colors hover:bg-background/10 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="sr-only">Settings</span>
              <Settings className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          {!address && status === 'disconnected' ? (
            <w3m-connect-button />
          ) : (
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded bg-primary px-3 text-sm text-background"
              onClick={() => open()}
            >
              <User2 className="size-4" />
              {address && status === 'connected' ? (
                formatAddress(address)
              ) : (
                <span className="h-6 w-20 animate-pulse rounded bg-white/20" />
              )}
            </button>
          )}
        </div>
        {/* <div className="hidden h-full items-center gap-x-20 lg:flex">
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
          href="/workspace"
          className="flex h-full items-center gap-x-[10px] bg-blue500 px-9 transition-colors duration-300 hover:bg-blue500/80"
        >
          <Image src={thunderIcon} alt="Thunder icon" />
          <span className="text-sm font-medium text-white">
            Create service and deploy
          </span>
        </Link>
      </div> */}
      </header>
    </>
  )
}
