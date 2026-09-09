import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@hrms.com",
    },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "Admin User",
      email: "admin@hrms.com",
      password: password,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "manager@hrms.com",
    },
    update: {
      role: "MANAGER",
    },
    create: {
      name: "Manager User",
      email: "manager@hrms.com",
      password: password,
      role: "MANAGER",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "employee@hrms.com",
    },
    update: {
      role: "EMPLOYEE",
    },
    create: {
      name: "Employee User",
      email: "employee@hrms.com",
      password: password,
      role: "EMPLOYEE",
    },
  });

  console.log("3 users created successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });