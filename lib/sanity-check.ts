const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

async function test() {
  const prisma = new PrismaClient();
  console.log("Testing bcrypt...");
  const hash = await bcrypt.hash("password", 10);
  console.log("Hash created:", hash);
  const isValid = await bcrypt.compare("password", hash);
  console.log("Hash valid:", isValid);

  console.log("Testing prisma...");
  try {
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
