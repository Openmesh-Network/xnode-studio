import { cwd } from 'process'
import { Provider } from '@/server/resources'
import { parseFile } from '@fast-csv/parse'

export async function convertCSVToSQLite() {
  const res = await new Promise<Provider[]>((resolve, reject) => {
    const stream = parseFile(`${cwd()}/scripts/providers.csv`, {
      skipLines: 2,
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
    stream.on('end', () => {
      resolve(data)
    })
    stream.on('error', (error) => {
      console.error(error)
      reject(error)
    })
  })

  // TODO: write to SQLite

  return res
}
