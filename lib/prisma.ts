import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Define a global variable to store the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a new Prisma client instance or use the existing one
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// In development, store the Prisma client instance in the global object
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
