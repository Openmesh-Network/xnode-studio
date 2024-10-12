import { createHash } from 'crypto'

export function formatAddress(address: string, length = 12) {
  if (address.length <= length) {
    return address
  }
  const partLength = Math.floor((length - 3) / 2)
  return `${address.slice(0, partLength)}...${address.slice(-partLength)}`
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
