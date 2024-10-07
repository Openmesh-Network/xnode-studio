'use client'

import { useEffect, useState } from 'react'

export default function useSelectedXNode(fallback?: string) {
  const [selectedXNode, setSelectedXNode] = useState<string | null>(null)

  function selectXNode(nft: string) {
    if (typeof window === undefined) return
    localStorage.setItem('selectedXNode', nft)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'selectedXNode',
        newValue: nft,
      })
    )
  }

  useEffect(() => {
    if (typeof window === undefined) return
    const storedValue = localStorage.getItem('selectedXNode')
    setSelectedXNode(storedValue ?? fallback ?? null)
    function handleLocalStorageUpdate(e: StorageEvent) {
      if (e.key === 'selectedXNode') {
        setSelectedXNode(e.newValue)
      }
    }
    window.addEventListener('storage', handleLocalStorageUpdate)
    return () => window.removeEventListener('storage', handleLocalStorageUpdate)
  }, [fallback])

  return [selectedXNode, selectXNode] as const
}
