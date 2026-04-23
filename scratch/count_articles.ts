import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function count() {
  const count = await prisma.article.count();
  console.log("ARTICLE_COUNT=" + count);
  await prisma.$disconnect();
}
count();
