import { cwd } from 'process'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const client = createClient({
  url: `${cwd()}/db/providers.db`,
})
export const db = drizzle(client)
