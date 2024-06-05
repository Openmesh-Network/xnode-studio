'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import type { Table as TableType } from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/buttons'
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
      `${row.original.cpuCores}C / ${row.original.cpuThreads}T / ${row.original.cpuGHZ}GHz`,
  },
  {
    accessorKey: 'storageTotal',
    header: 'Storage',
    cell: ({ cell }) => `${cell.getValue()}GB`,
  },
  {
    accessorKey: 'gpuType',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          GPU
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.gpuType
        ? `${row.original.gpuType} ${row.original.gpuMemory}`
        : '-',
  },
  {
    accessorKey: 'priceHour',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ cell }) => (cell.getValue() ? `${cell.getValue()}/h` : '-'),
  },
]

export default function ResourcesTable() {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
      <DataTablePagination table={table} page={page} setPage={setPage} />
    </div>
  )
}

interface DataTablePaginationProps<TData> {
  table: TableType<TData>
}

export function DataTablePagination<TData>({
  table,
  page,
  setPage,
}: DataTablePaginationProps<TData> & {
  page: number
  setPage: Dispatch<SetStateAction<number>>
}) {
  return (
    <div className="mt-2 flex items-center justify-end">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
