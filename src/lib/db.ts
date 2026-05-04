import { neon } from '@neondatabase/serverless'

type SqlClient = ReturnType<typeof neon>

let client: SqlClient | null = null

function getDatabaseUrl() {
  return process.env.DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.POSTGRES_PRISMA_URL
}

export function hasDatabase() {
  return Boolean(getDatabaseUrl())
}

export function getSqlClient() {
  const url = getDatabaseUrl()

  if (!url)
    return null

  if (!client)
    client = neon(url)

  return client
}

export async function query<T>(sqlText: string, params: unknown[] = []) {
  const sql = getSqlClient()

  if (!sql)
    throw new Error('Database is not configured.')

  return await sql.query(sqlText, params) as T[]
}
