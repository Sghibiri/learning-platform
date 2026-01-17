import { cookies } from 'next/headers'
import { prisma } from './prisma'
import type { SessionData } from '@/types'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'learning_session'
const SESSION_EXPIRY_DAYS = parseInt(process.env.SESSION_EXPIRY_DAYS || '7', 10)

// Baserow configuration for a course
export interface BaserowConfig {
  apiToken: string
  lessonsTableId: string
  flashcardsTableId: string
  testsTableId: string
  questionsTableId: string
}

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function validateAccessCode(code: string): Promise<{
  valid: boolean
  accessCode?: { id: string; courseId: string; courseName: string }
  error?: string
}> {
  const accessCode = await prisma.accessCode.findUnique({
    where: { code },
  })

  if (!accessCode) {
    return { valid: false, error: 'Invalid access code' }
  }

  if (!accessCode.isActive) {
    return { valid: false, error: 'This access code is no longer active' }
  }

  if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
    return { valid: false, error: 'This access code has expired' }
  }

  if (
    accessCode.usageLimit !== null &&
    accessCode.usageCount >= accessCode.usageLimit
  ) {
    return { valid: false, error: 'This access code has reached its usage limit' }
  }

  return {
    valid: true,
    accessCode: {
      id: accessCode.id,
      courseId: accessCode.courseId,
      courseName: accessCode.courseName,
    },
  }
}

export async function createSession(accessCodeId: string): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  await prisma.session.create({
    data: {
      accessCodeId,
      token,
      expiresAt,
    },
  })

  // Increment usage count
  await prisma.accessCode.update({
    where: { id: accessCodeId },
    data: { usageCount: { increment: 1 } },
  })

  return token
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { accessCode: true },
  })

  if (!session) {
    return null
  }

  if (session.expiresAt < new Date()) {
    // Session expired, delete it
    await prisma.session.delete({ where: { id: session.id } })
    return null
  }

  // Update last active time
  await prisma.session.update({
    where: { id: session.id },
    data: { lastActiveAt: new Date() },
  })

  return {
    accessCodeId: session.accessCodeId,
    courseId: session.accessCode.courseId,
    courseName: session.accessCode.courseName,
    token: session.token,
    expiresAt: session.expiresAt,
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionToken) {
    await prisma.session.deleteMany({ where: { token: sessionToken } })
    cookieStore.delete(SESSION_COOKIE_NAME)
  }
}

export async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10)
}

export async function verifyCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash)
}

// Get Baserow configuration for the current session
export async function getBaserowConfig(): Promise<{
  config: BaserowConfig | null
  courseId: string | null
  error?: string
}> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return { config: null, courseId: null, error: 'Not authenticated' }
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { accessCode: true },
  })

  if (!session) {
    return { config: null, courseId: null, error: 'Session not found' }
  }

  if (session.expiresAt < new Date()) {
    return { config: null, courseId: null, error: 'Session expired' }
  }

  const { accessCode } = session

  // Check if Baserow is configured for this course
  if (
    !accessCode.baserowApiToken ||
    !accessCode.baserowLessonsTableId ||
    !accessCode.baserowFlashcardsTableId ||
    !accessCode.baserowTestsTableId ||
    !accessCode.baserowQuestionsTableId
  ) {
    return {
      config: null,
      courseId: accessCode.courseId,
      error: 'Baserow not configured for this course',
    }
  }

  return {
    config: {
      apiToken: accessCode.baserowApiToken,
      lessonsTableId: accessCode.baserowLessonsTableId,
      flashcardsTableId: accessCode.baserowFlashcardsTableId,
      testsTableId: accessCode.baserowTestsTableId,
      questionsTableId: accessCode.baserowQuestionsTableId,
    },
    courseId: accessCode.courseId,
  }
}
