import { NextRequest } from 'next/server'
import { db } from '@/db'
import { Providers } from '@/db/schema'
import { and, asc, count, desc, eq, like, or, SQL } from 'drizzle-orm'
import { number, string } from 'yup'

const FALLBACK_LIMIT = 50

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const page = number().cast(params.get('page') ?? 0)
  const limit = number().cast(params.get('limit') ?? FALLBACK_LIMIT)
  const sort = string().nullable().cast(params.get('sort'))
  const order = string().nullable().cast(params.get('order'))
  const searchQuery = string().nullable().cast(params.get('q'))
  const region = string().nullable().cast(params.get('r'))

  let filters: SQL[] = []
  if (searchQuery !== null && searchQuery !== '') {
    const q = `%${searchQuery.trim()}%`
    filters.push(
      or(like(Providers.providerName, q), like(Providers.providerName, q))
    )
  }
  if (region !== null && region.trim() !== '') {
    filters.push(eq(Providers.location, region.trim()))
  }

  let sortOrder: SQL[] = []
  if (sort && order) {
    if (order === 'asc') {
      sortOrder.push(asc(Providers[sort]))
    } else {
      sortOrder.push(desc(Providers[sort]))
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
