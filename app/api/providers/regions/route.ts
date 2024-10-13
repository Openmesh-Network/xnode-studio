import { NextRequest } from 'next/server'
import { db } from '@/db'
import { Providers } from '@/db/schema'

export async function GET(_: NextRequest) {
  const regions = await db
    .selectDistinct({
      region: Providers.location,
    })
    .from(Providers)
  const regionSet = new Set<string>(
    regions
      .map(({ region }) => (region ? region.trim() : null))
      .filter((region) => region !== null)
  )
  return Response.json(Array.from(regionSet))
}
