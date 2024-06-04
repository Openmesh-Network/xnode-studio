import { cwd } from 'process'
import { parseFile } from '@fast-csv/parse'

import { TemplatesProducts } from '@/types/dataProvider'

type Provider = Omit<TemplatesProducts, 'id'> & {
  country: string
}

export async function getResourceStats() {
  const res = await new Promise<Provider[]>((resolve, reject) => {
    const stream = parseFile(`${cwd()}/server/bare-metal-providers.csv`, {
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
  let stats = {
    providers: new Set<string>(),
    countries: new Set<string>(),
    regions: new Set<string>(),
    storage: 0,
    // gpus: 0,
    // in GB
    ram: 0,
    bandwidth: 0,
  }
  res.forEach((provider) => {
    if (provider.providerName) stats.providers.add(provider.providerName)
    if (provider.country) stats.countries.add(provider.country)
    if (provider.location) stats.regions.add(provider.location)
    if (provider.storageTotal)
      stats.storage += parseInt(provider.storageTotal.replace(/\D/g, '')) || 0
    // if (provider.gpuType) stats.gpus += 1
    if (provider.ram)
      stats.ram += parseInt(provider.ram.replace(/\D/g, '')) || 0
    if (provider.bandwidthNetwork)
      stats.bandwidth +=
        parseInt(provider.bandwidthNetwork.replace(/\D/g, '')) || 0
  })

  return {
    // resources: res,
    stats: {
      countries: stats.countries.size,
      providers: stats.providers.size,
      regions: stats.regions.size,
      storage: stats.storage,
      // gpus: stats.gpus,
      ram: stats.ram,
      bandwidth: stats.bandwidth,
    },
  }
}
