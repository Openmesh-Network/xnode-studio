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
import type { Column, Row, Table as TableType } from '@tanstack/react-table'
import { useDebounce } from '@uidotdev/usehooks'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  Search,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
    cell: ({ row }) => {
      return formatCpuInfo(row)
    },
  },
  {
    accessorKey: 'storageTotal',
    header: ({ column }) => {
      return <SortableHeaderButton column={column} label="Storage" />
    },
    cell: ({ cell }) => {
      if (!cell.getValue()) return '-'
      return formatStorageSize(cell.getValue() as number)
    },
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

function formatCpuInfo(row: Row<Provider>): string {
  const { cpuCores, cpuThreads, cpuGHZ } = row.original
  const parts: string[] = []

  if (cpuCores != null) {
    parts.push(`${cpuCores}C`)
  }
  if (cpuThreads != null) {
    parts.push(`${cpuThreads}T`)
  }
  if (cpuGHZ != null) {
    parts.push(`${cpuGHZ}GHz`)
  }

  return parts.length > 0 ? parts.join(' / ') : '-'
}

function formatStorageSize(sizeInGb: number): string {
  // Check if the size is equal to or exceeds 1024 GB (1 TB)
  if (sizeInGb >= 1024) {
    const sizeInTb = sizeInGb / 1000
    return `${Math.round(sizeInTb)} TB`
  } else {
    return `${sizeInGb} GB`
  }
}

type ResourcesDataProps = {
  data: Provider[]
  totalPages: number
}

export default function ResourcesTable() {
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [pageSize, setPageSize] = useState(20)
  const [searchInput, setSearchInput] = useState<string>()
  const debouncedSearchInput = useDebounce(searchInput, 500)
  const { data, isLoading } = useQuery({
    queryKey: ['resources', page, debouncedSearchInput, sorting, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('limit', String(pageSize))
      if (debouncedSearchInput) {
        params.append('q', debouncedSearchInput)
      }
      if (sorting.length) {
        const sort = sorting[0]
        params.append('sort', sort.id)
        params.append('order', sort.desc ? 'desc' : 'asc')
      }
      const res = await fetch(`/api/providers?${params.toString()}`)
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
    <div className="flex flex-col gap-2">
      <div className="relative flex max-w-96 items-center">
        <Search className="absolute left-3 size-4" />
        <Input
          type="text"
          placeholder="Filter provider and item names"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted text-muted-foreground">
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
        pageSize={pageSize}
        setPageSize={setPageSize}
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
      className="-ml-3"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      {column.getIsSorted() === 'asc' ? (
        <ChevronUp className="ml-2 size-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <ChevronDown className="ml-2 size-4" />
      ) : (
        <ChevronsUpDown className="ml-2 size-4" />
      )}
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
  pageSize,
  setPageSize,
  totalPages,
}: DataTablePaginationProps<TData> & {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  totalPages: number
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="bottom">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
