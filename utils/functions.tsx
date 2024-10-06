'use client'

import { createHash } from 'crypto'

export function formatAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function hashObject(obj: any) {
  const str = JSON.stringify(obj)
  const hash = createHash('sha256')
  hash.update(str)
  return hash.digest('hex')
}

export function convertSize(mb: any) {
  mb = parseInt(mb)
  console.log(mb)
  if (mb < 1) {
    return (mb * 1024).toFixed(2) + ' KB'
  } else if (mb >= 1 && mb <= 1024) {
    return mb.toFixed(2) + ' MB'
  } else if (mb > 1024 && mb <= 1024 * 1024) {
    return (mb / 1024).toFixed(2) + ' GB'
  } else {
    return (mb / (1024 * 1024)).toFixed(2) + ' TB'
  }
}
