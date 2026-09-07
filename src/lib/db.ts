import { PrismaClient } from "@prisma/client";

// Singleton biar hot-reload dev nggak bikin koneksi DB menumpuk.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** true kalau DATABASE_URL tersedia (mode fullstack), false = mode demo. */
export const dbEnabled = Boolean(process.env.DATABASE_URL);
