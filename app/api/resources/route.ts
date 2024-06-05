import { NextRequest } from 'next/server'
import { db } from '@/db'
import { Providers } from '@/db/schema'
import { and, eq, like, or } from 'drizzle-orm'
import { number, string } from 'yup'

const FALLBACK_LIMIT = 50

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const page = number().cast(params.get('page') ?? 0)
  const limit = number().cast(params.get('limit') ?? FALLBACK_LIMIT)
  const searchQuery = string().nullable().cast(params.get('q'))
  const region = string().nullable().cast(params.get('r'))

  let filters = []
  if (searchQuery !== null && searchQuery.trim() !== '') {
    filters.push(
      or(
        like(Providers.providerName, `%${searchQuery.trim()}%`),
        like(Providers.providerName, `%${searchQuery.trim()}%`)
      )
    )
  }
  if (region !== null && region.trim() !== '') {
    filters.push(eq(Providers.location, region.trim()))
  }

  const data = await db.query.Providers.findMany({
    where: () => and(...filters),
    offset: page * limit,
    limit,
  })

  return Response.json(data)
}
