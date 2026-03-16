import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const getPrisma = () => {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma;
};

export const prisma = new Proxy({} as PrismaClient, {
    get: (_, prop) => {
        const client = getPrisma();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (client as any)[prop];
        if (typeof value === 'function') {
            return value.bind(client);
        }
        return value;
    }
});
