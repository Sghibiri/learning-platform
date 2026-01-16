import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: pg.Pool | undefined
}

function createPrismaClient() {
  // Use DATABASE_URL from environment, fallback to local for development
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/learning_platform'

  const pool = globalForPrisma.pool ?? new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool
  }

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
