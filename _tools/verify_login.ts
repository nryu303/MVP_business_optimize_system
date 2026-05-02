import bcrypt from "bcryptjs";
import { PrismaClient } from "../packages/db/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin1234";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("NG: user not found");
    return;
  }
  console.log("user:", { id: user.id, email: user.email, name: user.name });
  console.log("hash:", user.passwordHash);

  const match = await bcrypt.compare(password, user.passwordHash);
  console.log("password match:", match);
}

main().finally(() => prisma.$disconnect());
       