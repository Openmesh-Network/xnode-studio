'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Define the Provider type to match the data structure of your Provider array.
export type Provider = {
  providerName: string
  location?: string
  productName: string
  cpuCores: number
  cpuThreads: number
  cpuGHZ: number
  storageTotal: number
  gpuType?: string
  gpuMemory?: string
  priceHour?: string
}

// Create the column definitions for the new DataTable.
export const columns: ColumnDef<Provider>[] = [
  {
    accessorKey: 'providerName',
    header: 'Provider',
  },
  {
    accessorKey: 'location',
    header: 'Region',
    cell: ({ cell }) => cell.getValue() || '-',
  },
  {
    accessorKey: 'productName',
    header: 'Item',
  },
  {
    accessorKey: 'cpuCores',
    header: 'CPU',
    cell: ({ row }) =>
      `${row.original.cpuCores}C/${row.original.cpuThreads}T/${row.original.cpuGHZ}GHz`,
  },
  {
    accessorKey: 'storageTotal',
    header: 'Storage',
    cell: ({ cell }) => `${cell.getValue()}GB`,
  },
  {
    accessorKey: 'gpuType',
    header: 'GPU',
    cell: ({ row }) =>
      row.original.gpuType
        ? `${row.original.gpuType} ${row.original.gpuMemory}`
        : '-',
  },
  {
    accessorKey: 'priceHour',
    header: 'Price',
    cell: ({ cell }) => (cell.getValue() ? `${cell.getValue()}/h` : '-'),
  },
]

export default function ResourcesTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['resources', page],
    queryFn: async () => {
      const res = await fetch(`/api/resources?page=${page}`)
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json() as Promise<Provider[]>
    },
  })

  console.log(data)

  const table = useReactTable({
    data: data || [], // Provide a default empty array to avoid undefined issues
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            <>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
