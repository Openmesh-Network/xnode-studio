'use client'

import { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AccountContext } from '@/contexts/AccountContext'
import { Check, X } from 'phosphor-react'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TemplateProgress() {
  const { indexerDeployerStep, setIndexerDeployerStep, templateSelected } =
    useContext(AccountContext)
  return (
    <aside className="relative min-w-96 shrink-0 border-l border-zinc-200 bg-zinc-50 p-8">
      <h4 className="font-bold text-black">Your Progress</h4>
      <Link
        href="/template-products"
        className="absolute right-8 top-8 flex size-8 items-center justify-center"
      >
        <X size={20} className="text-muted" />
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
                src={`/images/template/bare-metal.svg`}
                alt="Bare Metal"
                width={200}
                height={100}
                className="w-2/3 object-contain"
              />
              <button
                type="button"
                className={cn(
                  'relative w-full rounded-md border border-primary px-8 py-3 text-center font-semibold',
                  indexerDeployerStep === -1
                    ? 'bg-primary text-white'
                    : 'text-primary'
                )}
                onClick={() => setIndexerDeployerStep(0)}
              >
                Select
              </button>
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
                {indexerDeployerStep > 1 ? (
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
                    <li>{templateSelected.location}</li>
                  </ul>
                  <p className="font-semibold">
                    {templateSelected.cpuCores} vCPU Cores +{' '}
                    {templateSelected.ram}GB RAM
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Price/mo.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{templateSelected.productName}</TableCell>
                        <TableCell>${templateSelected.priceMonth}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : null}
              <button
                disabled={!templateSelected}
                type="button"
                className={cn(
                  'relative w-full rounded-md border border-primary px-8 py-3 text-center font-semibold',
                  indexerDeployerStep === 0
                    ? 'enabled:bg-primary enabled:text-white disabled:text-primary'
                    : 'text-primary'
                )}
                onClick={() => setIndexerDeployerStep(1)}
              >
                Deploy
              </button>
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
                {indexerDeployerStep > 2 ? (
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
              <button
                type="button"
                className={cn(
                  'relative w-full rounded-md border border-primary px-8 py-3 text-center font-semibold',
                  indexerDeployerStep === 1
                    ? 'enabled:bg-primary enabled:text-white disabled:text-primary'
                    : 'text-primary'
                )}
                onClick={() => setIndexerDeployerStep(2)}
              >
                Create and Deploy
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  )
}