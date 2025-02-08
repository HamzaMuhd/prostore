import { prisma } from "@/db/prisma";

export default async function DebugPage() {
  try {
    const test = await prisma.product.findMany();
    console.log("✅ Prisma Query Success:", test);
  } catch (error) {
    console.error("❌ Prisma Error:", JSON.stringify(error, null, 2));
  }

  return <div>Check your console logs!</div>;
}
