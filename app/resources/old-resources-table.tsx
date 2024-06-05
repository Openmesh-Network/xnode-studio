'use client'

import { useState } from 'react'
import { Provider } from '@/db/schema'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export default function ResourcesTable() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['resources', page],
    queryFn: async () => {
      const res = await fetch(`/api/resources?page=${page}`)
      return res.json() as Promise<Provider[]>
    },
    placeholderData: keepPreviousData,
  })

  return (
    <table className="w-full text-black">
      <thead className="bg-body-color/50">
        <tr className="h-10 [&>th]:px-4 [&>th]:text-start [&>th]:font-normal">
          <th>Provider</th>
          <th>Region</th>
          <th>Item</th>
          <th>CPU</th>
          <th>Storage</th>
          <th>GPU</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td>Loading...</td>
          </tr>
        ) : null}
        {!isLoading &&
          data?.map((row, index) => (
            <tr key={`${row.providerName}-${index}`} className="h-10">
              <td className="px-4">{row.providerName}</td>
              <td className="px-4">{row.location || '-'}</td>
              <td className="px-4">{row.productName}</td>
              <td className="px-4">
                {row.cpuCores}C/{row.cpuThreads}T/{row.cpuGHZ}GHz
              </td>
              <td className="px-4">{row.storageTotal}GB</td>
              <td className="px-4">
                {row.gpuType} {row.gpuMemory}
              </td>
              <td className="px-4">
                {row.priceHour ? `${row.priceHour}/h` : '-'}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
