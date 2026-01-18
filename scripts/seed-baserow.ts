import 'dotenv/config'

const BASEROW_API_TOKEN = 'P3TdCrvcw8GGTx1lyZA3evKeaS99gnsh'
const BASEROW_API_URL = 'https://api.baserow.io/api'

const LESSONS_TABLE_ID = '804403'
const FLASHCARDS_TABLE_ID = '804405'
const TESTS_TABLE_ID = '804406'
const QUESTIONS_TABLE_ID = '804407'

// GED Test Prep Data
const lessons = [
  {
    title: 'Introduction to GED Math',
    content: 'This lesson covers the fundamentals of GED Mathematics including basic arithmetic, fractions, decimals, and percentages. The GED Math test assesses your ability to solve real-world problems using mathematical reasoning.',
    videoUrl: '',
    duration: 30,
  },
  {
    title: 'Algebra Basics',
    content: 'Learn the essentials of algebra for the GED test. Topics include variables, expressions, equations, and inequalities. Understanding algebra is crucial for approximately 55% of the GED Math questions.',
    videoUrl: '',
    duration: 45,
  },
  {
    title: 'Reading Comprehension Strategies',
    content: 'Master reading comprehension techniques for the GED Reasoning Through Language Arts test. Learn how to identify main ideas, make inferences, and analyze author\'s purpose and tone.',
    videoUrl: '',
    duration: 40,
  },
  {
    title: 'Science Data Analysis',
    content: 'Develop skills to interpret scientific data, graphs, and charts. The GED Science test focuses on your ability to understand and apply scientific concepts rather than memorizing facts.',
    videoUrl: '',
    duration: 35,
  },
  {
    title: 'Social Studies: US History & Government',
    content: 'Review key concepts in US History, Civics, and Government for the GED Social Studies test. Learn about the Constitution, branches of government, and major historical events.',
    videoUrl: '',
    duration: 50,
  },
]

const flashcards = [
  // Math flashcards
  { front: 'What is the order of operations?', back: 'PEMDAS: Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right)', category: 'Math' },
  { front: 'How do you convert a fraction to a decimal?', back: 'Divide the numerator by the denominator. Example: 3/4 = 3 ÷ 4 = 0.75', category: 'Math' },
  { front: 'What is the slope formula?', back: 'm = (y₂ - y₁) / (x₂ - x₁) - Rise over Run', category: 'Math' },
  { front: 'What is the Pythagorean theorem?', back: 'a² + b² = c², where c is the hypotenuse of a right triangle', category: 'Math' },
  { front: 'How do you find the area of a circle?', back: 'A = πr², where r is the radius', category: 'Math' },
  { front: 'What is the quadratic formula?', back: 'x = (-b ± √(b² - 4ac)) / 2a', category: 'Math' },
  // Reading flashcards
  { front: 'What is the main idea of a passage?', back: 'The central point or most important concept the author wants to communicate', category: 'Reading' },
  { front: 'What is an inference?', back: 'A conclusion reached based on evidence and reasoning from the text, not directly stated', category: 'Reading' },
  { front: 'What is tone in writing?', back: 'The author\'s attitude toward the subject, conveyed through word choice and style', category: 'Reading' },
  { front: 'What is the difference between fact and opinion?', back: 'Facts can be proven true or false; opinions are personal beliefs or judgments', category: 'Reading' },
  { front: 'What are context clues?', back: 'Words or phrases near an unfamiliar word that help you understand its meaning', category: 'Reading' },
  { front: 'What is author\'s purpose?', back: 'The reason an author writes: to inform, persuade, entertain, or explain', category: 'Reading' },
  // Science flashcards
  { front: 'What is the scientific method?', back: 'Observation → Question → Hypothesis → Experiment → Analysis → Conclusion', category: 'Science' },
  { front: 'What is photosynthesis?', back: 'Process where plants convert sunlight, water, and CO₂ into glucose and oxygen', category: 'Science' },
  { front: 'What is the difference between mitosis and meiosis?', back: 'Mitosis produces 2 identical cells; meiosis produces 4 genetically different sex cells', category: 'Science' },
  { front: 'What is Newton\'s First Law?', back: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force', category: 'Science' },
  { front: 'What is the pH scale?', back: 'Measures acidity/alkalinity: 0-6 acidic, 7 neutral, 8-14 basic/alkaline', category: 'Science' },
  { front: 'What is an ecosystem?', back: 'A community of living organisms interacting with their physical environment', category: 'Science' },
  // Social Studies flashcards
  { front: 'What are the three branches of US government?', back: 'Legislative (Congress), Executive (President), Judicial (Supreme Court)', category: 'Social Studies' },
  { front: 'What is the Bill of Rights?', back: 'The first 10 amendments to the US Constitution, guaranteeing individual freedoms', category: 'Social Studies' },
  { front: 'What was the Civil Rights Movement?', back: 'A struggle for social justice in the 1950s-60s to end racial segregation and discrimination', category: 'Social Studies' },
  { front: 'What is supply and demand?', back: 'Economic principle: price rises when demand exceeds supply, falls when supply exceeds demand', category: 'Social Studies' },
  { front: 'What is the Electoral College?', back: 'A body of 538 electors who formally elect the President; 270 votes needed to win', category: 'Social Studies' },
  { front: 'What caused the Great Depression?', back: 'Stock market crash of 1929, bank failures, reduced spending, and poor monetary policy', category: 'Social Studies' },
]

const tests = [
  {
    title: 'GED Math Practice Test',
    description: 'Practice test covering algebra, geometry, data analysis, and number operations',
    timeLimit: 45,
    passingScore: 70,
    questionsPerCategory: 5,
  },
  {
    title: 'GED Reading Practice Test',
    description: 'Reading comprehension test with passages and analysis questions',
    timeLimit: 35,
    passingScore: 70,
    questionsPerCategory: 5,
  },
  {
    title: 'GED Science Practice Test',
    description: 'Science reasoning test covering life science, physical science, and earth science',
    timeLimit: 40,
    passingScore: 70,
    questionsPerCategory: 5,
  },
]

const questions = [
  // Math questions
  { category: 'Math', question: 'Solve for x: 2x + 5 = 13', optionA: 'x = 4', optionB: 'x = 6', optionC: 'x = 8', optionD: 'x = 9', correctAnswer: 'A' },
  { category: 'Math', question: 'What is 25% of 80?', optionA: '15', optionB: '20', optionC: '25', optionD: '30', correctAnswer: 'B' },
  { category: 'Math', question: 'If a rectangle has length 8 and width 5, what is its area?', optionA: '13', optionB: '26', optionC: '40', optionD: '45', correctAnswer: 'C' },
  { category: 'Math', question: 'Simplify: 3(x + 4) - 2x', optionA: 'x + 12', optionB: 'x + 4', optionC: '5x + 4', optionD: '5x + 12', correctAnswer: 'A' },
  { category: 'Math', question: 'What is the slope of the line passing through points (2, 3) and (4, 7)?', optionA: '1', optionB: '2', optionC: '3', optionD: '4', correctAnswer: 'B' },
  // Reading questions
  { category: 'Reading', question: 'When identifying the main idea, you should look for:', optionA: 'The first sentence only', optionB: 'The longest paragraph', optionC: 'The central message supported throughout', optionD: 'Proper nouns', correctAnswer: 'C' },
  { category: 'Reading', question: 'An inference is best described as:', optionA: 'A direct quote from the text', optionB: 'The author\'s biography', optionC: 'A logical conclusion based on evidence', optionD: 'A summary of the passage', correctAnswer: 'C' },
  { category: 'Reading', question: 'Which word signals a contrast in writing?', optionA: 'Furthermore', optionB: 'However', optionC: 'Additionally', optionD: 'Similarly', correctAnswer: 'B' },
  { category: 'Reading', question: 'Author\'s purpose to convince readers is called:', optionA: 'Inform', optionB: 'Entertain', optionC: 'Persuade', optionD: 'Describe', correctAnswer: 'C' },
  { category: 'Reading', question: 'Context clues help readers:', optionA: 'Find page numbers', optionB: 'Understand unfamiliar words', optionC: 'Skip difficult sections', optionD: 'Memorize vocabulary', correctAnswer: 'B' },
  // Science questions
  { category: 'Science', question: 'Which step comes first in the scientific method?', optionA: 'Experiment', optionB: 'Hypothesis', optionC: 'Observation', optionD: 'Conclusion', correctAnswer: 'C' },
  { category: 'Science', question: 'What gas do plants release during photosynthesis?', optionA: 'Carbon dioxide', optionB: 'Nitrogen', optionC: 'Oxygen', optionD: 'Hydrogen', correctAnswer: 'C' },
  { category: 'Science', question: 'A pH of 3 indicates a substance is:', optionA: 'Neutral', optionB: 'Basic', optionC: 'Acidic', optionD: 'Alkaline', correctAnswer: 'C' },
  { category: 'Science', question: 'What type of cell division produces sex cells?', optionA: 'Mitosis', optionB: 'Meiosis', optionC: 'Binary fission', optionD: 'Budding', correctAnswer: 'B' },
  { category: 'Science', question: 'Newton\'s First Law is also known as the law of:', optionA: 'Acceleration', optionB: 'Gravity', optionC: 'Inertia', optionD: 'Reaction', correctAnswer: 'C' },
  // Social Studies questions
  { category: 'Social Studies', question: 'Which branch of government interprets laws?', optionA: 'Legislative', optionB: 'Executive', optionC: 'Judicial', optionD: 'Administrative', correctAnswer: 'C' },
  { category: 'Social Studies', question: 'How many amendments are in the Bill of Rights?', optionA: '5', optionB: '10', optionC: '15', optionD: '20', correctAnswer: 'B' },
  { category: 'Social Studies', question: 'The stock market crash that started the Great Depression occurred in:', optionA: '1919', optionB: '1929', optionC: '1939', optionD: '1949', correctAnswer: 'B' },
  { category: 'Social Studies', question: 'How many electoral votes are needed to win the presidency?', optionA: '250', optionB: '270', optionC: '290', optionD: '310', correctAnswer: 'B' },
  { category: 'Social Studies', question: 'The Civil Rights Act of 1964 primarily addressed:', optionA: 'Women\'s suffrage', optionB: 'Child labor', optionC: 'Racial discrimination', optionD: 'Immigration', correctAnswer: 'C' },
]

async function createRow(tableId: string, data: Record<string, unknown>) {
  const response = await fetch(`${BASEROW_API_URL}/database/rows/table/${tableId}/?user_field_names=true`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${BASEROW_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create row: ${error}`)
  }

  return response.json()
}

async function clearTable(tableId: string) {
  // Get all rows
  const response = await fetch(`${BASEROW_API_URL}/database/rows/table/${tableId}/?user_field_names=true`, {
    headers: {
      'Authorization': `Token ${BASEROW_API_TOKEN}`,
    },
  })

  if (!response.ok) {
    console.log(`Could not fetch rows from table ${tableId}`)
    return
  }

  const data = await response.json()
  const rows = data.results || []

  // Delete each row
  for (const row of rows) {
    await fetch(`${BASEROW_API_URL}/database/rows/table/${tableId}/${row.id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${BASEROW_API_TOKEN}`,
      },
    })
  }

  console.log(`Cleared ${rows.length} rows from table ${tableId}`)
}

async function main() {
  console.log('Seeding Baserow tables with GED Test Prep data...\n')

  // Clear existing data
  console.log('Clearing existing data...')
  await clearTable(LESSONS_TABLE_ID)
  await clearTable(FLASHCARDS_TABLE_ID)
  await clearTable(TESTS_TABLE_ID)
  await clearTable(QUESTIONS_TABLE_ID)

  // Seed lessons
  console.log('\nSeeding lessons...')
  for (const lesson of lessons) {
    await createRow(LESSONS_TABLE_ID, lesson)
    console.log(`  Created lesson: ${lesson.title}`)
  }

  // Seed flashcards
  console.log('\nSeeding flashcards...')
  for (const flashcard of flashcards) {
    await createRow(FLASHCARDS_TABLE_ID, flashcard)
    console.log(`  Created flashcard: ${flashcard.front.substring(0, 40)}...`)
  }

  // Seed tests
  console.log('\nSeeding tests...')
  for (const test of tests) {
    await createRow(TESTS_TABLE_ID, test)
    console.log(`  Created test: ${test.title}`)
  }

  // Seed questions
  console.log('\nSeeding questions...')
  for (const question of questions) {
    await createRow(QUESTIONS_TABLE_ID, question)
    console.log(`  Created question: ${question.question.substring(0, 40)}...`)
  }

  console.log('\nSeeding complete!')
  console.log(`  - ${lessons.length} lessons`)
  console.log(`  - ${flashcards.length} flashcards`)
  console.log(`  - ${tests.length} tests`)
  console.log(`  - ${questions.length} questions`)
}

main().catch(console.error)
