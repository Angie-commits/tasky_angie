import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function getTaskById(id: string) {
  return await client.task.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });
}
