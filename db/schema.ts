import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const Providers = sqliteTable('providers', {
  id: integer('id').primaryKey(),
  providerName: text('providerName'),
  productName: text('productName'),
  country: text('country'),
  location: text('location'),
  cpuCores: integer('cpuCores'),
  cpuThreads: integer('cpuThreads'),
  cpuGHZ: real('cpuGHZ'),
  hasSGX: integer('hasSGX', { mode: 'boolean' }),
  ram: integer('ram'),
  numberDrives: integer('numberDrives'),
  avgSizeDrive: integer('avgSizeDrive'),
  storageTotal: integer('storageTotal'),
  gpuType: text('gpuType'),
  gpuMemory: text('gpuMemory'),
  bandwidthNetwork: integer('bandwidthNetwork'),
  network: integer('network'),
  priceHour: real('priceHour'),
  priceMonth: real('priceMonth'),
  availability: text('availability'),
  source: text('source'),
  unit: text('unit'),
})

export type Provider = typeof Providers.$inferSelect
