import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Use DATABASE_URL from environment or fallback to local
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/learning_platform'

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create GED test prep access code with Baserow config
  const accessCode = await prisma.accessCode.upsert({
    where: { code: 'TEST123' },
    update: {
      courseName: 'GED Test Prep',
      baserowApiToken: 'P3TdCrvcw8GGTx1lyZA3evKeaS99gnsh',
      baserowLessonsTableId: '804403',
      baserowFlashcardsTableId: '804405',
      baserowTestsTableId: '804406',
      baserowQuestionsTableId: '804407',
    },
    create: {
      code: 'TEST123',
      courseId: 'course-1',
      courseName: 'GED Test Prep',
      isActive: true,
      baserowApiToken: 'P3TdCrvcw8GGTx1lyZA3evKeaS99gnsh',
      baserowLessonsTableId: '804403',
      baserowFlashcardsTableId: '804405',
      baserowTestsTableId: '804406',
      baserowQuestionsTableId: '804407',
    },
  })

  console.log('Created access code:', accessCode.code)

  // Create another access code with same Baserow config
  const accessCode2 = await prisma.accessCode.upsert({
    where: { code: 'DEMO2024' },
    update: {
      courseName: 'GED Test Prep Demo',
      baserowApiToken: 'P3TdCrvcw8GGTx1lyZA3evKeaS99gnsh',
      baserowLessonsTableId: '804403',
      baserowFlashcardsTableId: '804405',
      baserowTestsTableId: '804406',
      baserowQuestionsTableId: '804407',
    },
    create: {
      code: 'DEMO2024',
      courseId: 'course-2',
      courseName: 'GED Test Prep Demo',
      isActive: true,
      baserowApiToken: 'P3TdCrvcw8GGTx1lyZA3evKeaS99gnsh',
      baserowLessonsTableId: '804403',
      baserowFlashcardsTableId: '804405',
      baserowTestsTableId: '804406',
      baserowQuestionsTableId: '804407',
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
