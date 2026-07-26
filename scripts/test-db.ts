import { db } from "../src/lib/db";

async function main() {
  try {
    console.log("Testing database connection...");
    const userCount = await db.user.count();
    console.log("Database connected successfully! User count:", userCount);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
