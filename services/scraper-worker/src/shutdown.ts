import { prisma } from "./db/prisma.js";

export async function shutdown() {
    await prisma.$disconnect();
}