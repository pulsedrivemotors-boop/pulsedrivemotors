import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
  // Resolve relative file paths to absolute so they work from any cwd
  const resolvedUrl = dbUrl.startsWith('file:.')
    ? 'file:' + path.resolve(process.cwd(), dbUrl.replace('file:', ''))
    : dbUrl
  const adapter = new PrismaBetterSqlite3({ url: resolvedUrl })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
