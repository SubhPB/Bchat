/** Byimaan */

import { PrismaClient } from "@repo/db/src";

declare global {
    var prisma: PrismaClient | undefined
};

export const db = globalThis.prisma || new PrismaClient({
    log: ['query']
});

if (process.env.NODE_ENV !== 'production'){
    globalThis.prisma = db
}