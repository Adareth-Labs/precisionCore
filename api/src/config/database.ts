import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// Single instance across hot reloads in development
export const db = global.__prisma ?? new PrismaClient({
  log: [
    { level: 'error',   emit: 'event' },
    { level: 'warn',    emit: 'event' },
    { level: 'query',   emit: process.env.NODE_ENV === 'development' ? 'event' : 'stdout' },
  ],
})

if (process.env.NODE_ENV === 'development') global.__prisma = db

db.$on('error' as never, (e: { message: string }) => {
  logger.error('Prisma error', { message: e.message })
})
db.$on('warn' as never, (e: { message: string }) => {
  logger.warn('Prisma warning', { message: e.message })
})

export async function connectDatabase(): Promise<void> {
  await db.$connect()
  logger.info('Database connected')
}

export async function disconnectDatabase(): Promise<void> {
  await db.$disconnect()
  logger.info('Database disconnected')
}