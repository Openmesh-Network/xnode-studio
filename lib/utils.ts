import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { Xnode } from '@/types/node'
import type { SelectedXnode } from '@/components/selected-xnode'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(+price)
}

export function formatSelectedXNodeName(xnode: SelectedXnode) {
  if (!xnode) {
    console.warn('formatSelectedXnodeName undefined')
    return ''
  }

  if (xnode.type === 'Unit') {
    // Step 1: Create a hash from the input string
    const hash = xnode.id
      .toString()
      .split('')
      .reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0
      }, 0)

    // Step 2: Use the hash as a seed for random selection
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''

    for (let i = 0; i < 3; i++) {
      const index = Math.abs((hash * (i + 1)) % chars.length)
      result += chars[index]
    }

    return `XnodeDVM ${result}`
  }

  return `Xnode ${xnode.id.slice(0, 3)}`
}

export function formatXNodeName(xnode: Xnode) {
  if (!xnode) {
    console.warn('formatXNodeName undefined')
    return ''
  }

  return formatSelectedXNodeName(
    xnode.isUnit
      ? {
          type: 'Unit',
          id: BigInt(xnode.deploymentAuth),
        }
      : {
          type: 'Custom',
          id: xnode.id,
        }
  )
}
