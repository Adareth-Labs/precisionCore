// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma client singleton.
 * In Next.js development, hot reloading can create multiple instances —
 * this pattern prevents exhausting the connection pool.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// ─── Query helpers ────────────────────────────────────────────

/**
 * Generate a human-readable reference ID.
 * e.g. "RFQ-2024-0891", "CAR-2024-089"
 */
export function generateRefId(prefix: string, sequence: number): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(sequence).padStart(4, '0')}`;
}
