'use client'

import { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AccountContext } from '@/contexts/AccountContext'
import { prefix } from '@/utils/prefix'
import { Check, X } from 'phosphor-react'

import { getFlagImageURL } from '@/lib/countryFlags'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Separator } from '../../components/ui/separator'

export default function DeploymentProgress() {
  const {
    indexerDeployerStep,
    setIndexerDeployerStep,
    templateSelected,
    user,
  } = useContext(AccountContext)
  return (
    <aside className="relative min-w-96 shrink-0 border-l border-zinc-200 bg-zinc-50 p-8">
      <h4 className="font-bold text-black">Your Progress</h4>
      <Link
        href="/templates"
        className="absolute right-8 top-8 flex size-8 items-center justify-center"
      >
        <X className="size-5" />
      </Link>
      <div className="mt-8 flex flex-col gap-6">
        <div>
          <div className="-mx-8">
            <button
              disabled={indexerDeployerStep === -1}
              type="button"
              className={cn(
                'relative flex w-full items-center gap-6 px-8 py-3 transition-colors',
                indexerDeployerStep === -1
                  ? 'bg-primary/10'
                  : 'enabled:hover:bg-primary/10'
              )}
              onClick={() => setIndexerDeployerStep(-1)}
            >
              {indexerDeployerStep === -1 ? (
                <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
              ) : null}
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border border-zinc-400',
                  indexerDeployerStep === -1 && 'border-dashed border-primary',
                  indexerDeployerStep > -1 && 'border-primary'
                )}
              >
                {indexerDeployerStep > -1 ? (
                  <Check size={20} weight="bold" className="text-primary" />
                ) : null}
              </div>
              <p
                className={cn(
                  'font-bold',
                  indexerDeployerStep === -1 ? 'text-black' : 'text-black/50'
                )}
              >
                Select a Template
              </p>
            </button>
          </div>
          {indexerDeployerStep === -1 ? (
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              <Image
                src={`${prefix}/images/template/bare-metal.svg`}
                alt="Bare Metal"
                width={200}
                height={100}
                className="w-2/3 object-contain"
              />
              <Button
                className="h-12 w-full"
                onClick={() => setIndexerDeployerStep(0)}
              >
                Select
              </Button>
            </div>
          ) : null}
        </div>
        <div>
          <div className="-mx-8">
            <button
              disabled={indexerDeployerStep <= 0}
              type="button"
              className={cn(
                'relative flex w-full items-center gap-6 px-8 py-3 transition-colors',
                indexerDeployerStep === 0
                  ? 'bg-primary/10'
                  : 'enabled:hover:bg-primary/10'
              )}
              onClick={() => setIndexerDeployerStep(0)}
            >
              {indexerDeployerStep === 0 ? (
                <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
              ) : null}
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border border-zinc-400',
                  indexerDeployerStep <= 0 && 'border-dashed',
                  indexerDeployerStep === 0 && 'border-primary',
                  indexerDeployerStep > 0 && 'border-primary'
                )}
              >
                {indexerDeployerStep > 0 ? (
                  <Check size={20} weight="bold" className="text-primary" />
                ) : null}
              </div>
              <p
                className={cn(
                  'font-bold',
                  indexerDeployerStep === 0 ? 'text-black' : 'text-black/50'
                )}
              >
                Select a Provider
              </p>
            </button>
          </div>
          {indexerDeployerStep === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              {templateSelected ? (
                <div className="w-full">
                  <ul className="flex flex-col gap-1 text-sm">
                    <li>Bare Metal Provider</li>
                    <li className="flex items-center gap-1.5">
                      <Image
                        src={getFlagImageURL(templateSelected.location.trim())}
                        alt={templateSelected.location}
                        width={24}
                        height={16}
                        className="aspect-[3/2] rounded"
                      />
                      {templateSelected.location.trim()}
                    </li>
                  </ul>
                  <p className="mt-1.5 font-semibold">
                    {templateSelected.cpuCores} vCPU Cores +{' '}
                    {templateSelected.ram}GB RAM
                  </p>
                  <Table className="mt-4">
                    <TableHeader className="bg-accent">
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Price/mo.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          {templateSelected.productName}
                        </TableCell>
                        <TableCell>
                          {templateSelected.priceSale ? (
                            <span className="font-semibold">
                              {formatPrice(templateSelected.priceSale)}{' '}
                            </span>
                          ) : null}
                          <span
                            className={cn(
                              templateSelected.priceSale && 'line-through'
                            )}
                          >
                            {formatPrice(templateSelected.priceMonth)}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Separator />
                  <div className="mt-2 flex items-start justify-between gap-4 px-2">
                    <p>Total</p>
                    <div className="flex flex-col items-end">
                      <p className="text-3xl font-bold text-primary">
                        {templateSelected.priceSale
                          ? formatPrice(templateSelected.priceSale)
                          : formatPrice(templateSelected.priceMonth)}
                        <span className="text-base font-semibold">/mo</span>
                      </p>
                      <p className="text-xs">
                        or about {formatPrice(templateSelected.priceHour)}/h
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              <Button
                disabled={!templateSelected}
                variant={templateSelected ? 'default' : 'outlinePrimary'}
                className="h-12 w-full"
                onClick={() => setIndexerDeployerStep(1)}
              >
                Deploy
              </Button>
            </div>
          ) : null}
        </div>
        <div>
          <div className="-mx-8">
            <button
              disabled={indexerDeployerStep <= 1}
              type="button"
              className={cn(
                'relative flex w-full items-center gap-6 px-8 py-3 transition-colors',
                indexerDeployerStep === 1
                  ? 'bg-primary/10'
                  : 'enabled:hover:bg-primary/10'
              )}
              onClick={() => setIndexerDeployerStep(1)}
            >
              {indexerDeployerStep === 1 ? (
                <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
              ) : null}
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border border-zinc-400',
                  indexerDeployerStep <= 1 && 'border-dashed',
                  indexerDeployerStep === 1 && 'border-primary',
                  indexerDeployerStep > 1 && 'border-primary'
                )}
              >
                {indexerDeployerStep > 1 ? (
                  <Check size={20} weight="bold" className="text-primary" />
                ) : null}
              </div>
              <p
                className={cn(
                  'font-bold',
                  indexerDeployerStep === 1 ? 'text-black' : 'text-black/50'
                )}
              >
                Choose your configuration
              </p>
            </button>
          </div>
          {indexerDeployerStep === 1 ? (
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              <Button
                disabled={user === undefined}
                variant={user !== undefined ? 'default' : 'outlinePrimary'}
                className="h-12 w-full"
                onClick={() => setIndexerDeployerStep(2)}
              >
                Create and Deploy
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
