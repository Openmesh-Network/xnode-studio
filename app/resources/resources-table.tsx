'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

export default function ResourcesTable() {
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['resources'],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `http://localhost:3334/api/resources?cursor=${pageParam}`
      )
      return res.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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
          data?.pages.map((page) =>
            page.data.map((row) => (
              <tr key={row.providerName} className="h-10">
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
            ))
          )}
      </tbody>
    </table>
  )
}
