import { cwd } from 'process'
import { NextRequest } from 'next/server'
import { parseFile } from '@fast-csv/parse'
import { number } from 'yup'

import { TemplatesProducts } from '@/types/dataProvider'

const CSV_HEADER_OFFSET = 2
const FALLBACK_LIMIT = 50

type Provider = Omit<TemplatesProducts, 'id'> & {
  country: string
}
export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const cursor = number().cast(params.get('cursor') ?? 0)
  const limit = number().cast(params.get('limit') ?? FALLBACK_LIMIT)
  const { data, maxRows } = await new Promise<{
    data: Provider[]
    maxRows: number
  }>((resolve, reject) => {
    const stream = parseFile(`${cwd()}/server/bare-metal-providers.csv`, {
      skipLines: CSV_HEADER_OFFSET + cursor,
      maxRows: limit,
    })
    stream.transform((row: string[]) => {
      if (row[1].length === 0) return null
      return {
        providerName: row[1],
        productName: row[2],
        country: row[3],
        location: row[4],
        cpuCores: row[6],
        cpuThreads: row[8],
        cpuGHZ: row[9],
        hasSGX: row[10],
        ram: row[41],
        numberDrives: row[43],
        avgSizeDrive: row[44],
        storageTotal: row[62],
        gpuType: row[63],
        gpuMemory: row[64] + '_' + row[65],
        bandwidthNetwork: row[67],
        network: row[68],
        priceHour: row[74],
        priceMonth: row[77],
        availability: row[79],
        source: row[80],
        unit: row[82],
      } satisfies Provider
    })
    let data: Provider[] = []
    stream.on('data', (row) => {
      if (row === null) return
      data.push(row)
    })
    stream.on('end', (rowCount: number) => {
      resolve({ data, maxRows: rowCount - CSV_HEADER_OFFSET })
    })
    stream.on('error', (error) => {
      console.error(error)
      reject(error)
    })
  })
  const nextCursor = cursor + limit
  return Response.json({
    data,
    nextCursor: nextCursor < maxRows ? nextCursor : null,
  })
}
