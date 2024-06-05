import { NextRequest } from 'next/server'
import { db } from '@/db'
import { number } from 'yup'

const FALLBACK_LIMIT = 50

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const cursor = number().cast(params.get('cursor') ?? 0)
  const limit = number().cast(params.get('limit') ?? FALLBACK_LIMIT)

  const data = await db.query.Providers.findMany({
    offset: cursor,
    limit,
  })
  const nextCursor = cursor + limit
  return Response.json({
    data,
    nextCursor: nextCursor,
  })
}
