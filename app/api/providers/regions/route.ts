import { NextRequest } from 'next/server'
import { db } from '@/db'
import { Providers } from '@/db/schema'

export async function GET(req: NextRequest) {
  const regions = await db
    .selectDistinct({
      region: Providers.location,
    })
    .from(Providers)
  const regionSet = new Set<string>(
    regions.map(({ region }) => (region ? region.trim() : null)).filter(Boolean)
  )
  return Response.json(Array.from(regionSet))
}
