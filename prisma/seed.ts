import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Use direct TCP connection for seeding
const connectionString = 'postgresql://postgres:postgres@localhost:51214/template1?sslmode=disable'

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create a test access code
  const accessCode = await prisma.accessCode.upsert({
    where: { code: 'TEST123' },
    update: {},
    create: {
      code: 'TEST123',
      courseId: 'course-1',
      courseName: 'My Test Course',
      isActive: true,
    },
  })

  console.log('Created access code:', accessCode.code)

  // Create another access code
  const accessCode2 = await prisma.accessCode.upsert({
    where: { code: 'DEMO2024' },
    update: {},
    create: {
      code: 'DEMO2024',
      courseId: 'course-2',
      courseName: 'Demo Learning Course',
      isActive: true,
    },
  })

  console.log('Created access code:', accessCode2.code)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
