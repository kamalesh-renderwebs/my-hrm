import prisma from "@/lib/prisma";

export async function createActivityLog({
  userId,
  action,
  module,
  description,
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        module,
        description,
      },
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
}