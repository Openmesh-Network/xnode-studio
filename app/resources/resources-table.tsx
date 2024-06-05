'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { Provider } from '@/db/schema'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import type { Column, Table as TableType } from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Create the column definitions for the new DataTable.
const columns: ColumnDef<Provider>[] = [
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
    header: ({ column }) => {
      return <SortableHeaderButton column={column} label="CPU" />
    },
    cell: ({ row }) =>
      `${row.original.cpuCores}C / ${row.original.cpuThreads}T / ${row.original.cpuGHZ}GHz`,
  },
  {
    accessorKey: 'storageTotal',
    header: ({ column }) => {
      return <SortableHeaderButton column={column} label="Storage" />
    },
    cell: ({ cell }) => `${cell.getValue()}GB`,
  },
  {
    accessorKey: 'gpuType',
    header: ({ column }) => {
      return <SortableHeaderButton column={column} label="GPU" />
    },
    cell: ({ row }) =>
      row.original.gpuType
        ? `${row.original.gpuType} ${row.original.gpuMemory}`
        : '-',
  },
  {
    accessorKey: 'priceHour',
    header: ({ column }) => {
      return <SortableHeaderButton column={column} label="Price" />
    },
    cell: ({ cell }) => (cell.getValue() ? `${cell.getValue()}/h` : '-'),
  },
]

type ResourcesDataProps = {
  data: Provider[]
  totalPages: number
}

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
      return res.json() as Promise<ResourcesDataProps>
    },
    placeholderData: keepPreviousData,
  })

  const table = useReactTable({
    data: data?.data || [], // Provide a default empty array to avoid undefined issues
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
      <DataTablePagination
        table={table}
        page={page}
        setPage={setPage}
        totalPages={data?.totalPages}
      />
    </div>
  )
}

function SortableHeaderButton({
  column,
  label,
}: {
  column: Column<Provider>
  label: string
}) {
  return (
    <Button
      className="-ml-2"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 size-4" />
    </Button>
  )
}

interface DataTablePaginationProps<TData> {
  table: TableType<TData>
}

function DataTablePagination<TData>({
  table,
  page,
  setPage,
  totalPages,
}: DataTablePaginationProps<TData> & {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  totalPages: number
}) {
  return (
    <div className="mt-2 flex items-center justify-end">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => setPage(totalPages - 1)}
            disabled={page === totalPages - 1}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
