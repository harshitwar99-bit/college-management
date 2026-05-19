import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

declare global {
    // eslint-disable-next-line no-var
    var _prisma: PrismaClient | undefined;
}

/**
 * Bug #1 fix — Prisma v7 with the 'client' engine type (used by Prisma Accelerate / 
 * serverless deployments) REQUIRES either an `adapter` or `accelerateUrl` to be passed 
 * to the PrismaClient constructor. The database URL can no longer live in schema.prisma.
 *
 * This file uses the official @prisma/adapter-neon which works with our Neon PostgreSQL
 * database. The DATABASE_URL is read from the environment and passed to the Neon adapter.
 */
const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
};

export const getPrisma = () => {
    if (typeof window !== 'undefined') return {} as PrismaClient; // Guard for client components
    if (!globalThis._prisma) {
        globalThis._prisma = prismaClientSingleton();
    }
    return globalThis._prisma;
};

// Named export for backward-compat with any direct `import { prisma }` usages
export const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop, receiver) => {
        const p = getPrisma();
        return Reflect.get(p, prop, receiver);
    }
});
