import { NextRequest } from 'next/server'
import { db } from '@/db'
import { Providers, type Provider } from '@/db/schema'
import { and, asc, count, desc, eq, gte, like, lte, or, SQL } from 'drizzle-orm'
import { z } from 'zod'

const FALLBACK_LIMIT = 50

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const page = z.coerce.number().parse(params.get('page') ?? 0)
  const limit = z.coerce.number().parse(params.get('limit') ?? FALLBACK_LIMIT)
  const sort = z.string().nullable().parse(params.get('sort'))
  const order = z.string().nullable().parse(params.get('order'))
  const searchQuery = z.string().nullable().parse(params.get('q'))
  const region = z.string().nullable().parse(params.get('r'))
  const minPrice = z.coerce.number().nullable().parse(params.get('min'))
  const maxPrice = z.coerce.number().nullable().parse(params.get('max'))
  const minRAM = z.coerce.number().nullable().parse(params.get('minRAM'))
  const minStorage = z.coerce
    .number()
    .nullable()
    .parse(params.get('minStorage'))

  let filters: (SQL | undefined)[] = []
  if (searchQuery !== null && searchQuery !== '') {
    const q = `%${searchQuery.trim()}%`
    filters.push(
      or(like(Providers.providerName, q), like(Providers.productName, q))
    )
  }
  if (region !== null && region.trim() !== '') {
    filters.push(eq(Providers.location, region.trim()))
  }
  if (minPrice !== null) {
    filters.push(
      or(
        gte(Providers.priceMonth, minPrice),
        gte(Providers.priceSale, minPrice)
      )
    )
  }
  if (maxPrice !== null && maxPrice !== 1000) {
    filters.push(
      or(
        lte(Providers.priceMonth, maxPrice),
        lte(Providers.priceSale, maxPrice)
      )
    )
  }
  if (minRAM !== null) {
    filters.push(gte(Providers.ram, minRAM))
  }
  if (minStorage !== null) {
    filters.push(gte(Providers.storageTotal, minStorage))
  }

  let sortOrder: SQL[] = []
  if (sort && order) {
    if (order === 'asc') {
      sortOrder.push(asc(Providers[sort as keyof Provider]))
    } else {
      sortOrder.push(desc(Providers[sort as keyof Provider]))
    }
  }

  const data = await db.query.Providers.findMany({
    where: () => and(...filters),
    orderBy: () => sortOrder,
    offset: page * limit,
    limit,
  })

  const [rowCount] = await db
    .select({
      count: count(),
    })
    .from(Providers)
    .where(() => and(...filters))
    .limit(1)

  const totalPages = Math.ceil(rowCount.count / limit)
  return Response.json({ data, totalPages })
}
