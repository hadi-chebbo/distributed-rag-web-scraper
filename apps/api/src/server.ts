import { buildApp } from "./app.js";
import { prisma } from "./db/prisma.js";

const start = async() => {
  const app = buildApp();

  try {
    await app.listen({
      host: "0.0.0.0",
      port: Number(process.env.PORT ?? 3000),
    });
  } catch(error) {
    app.log.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();