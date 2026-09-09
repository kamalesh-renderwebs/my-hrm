import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const managers = await prisma.user.findMany({
      where: {
        role: "MANAGER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(managers);
  } catch (error) {
    console.error("Get managers error:", error);

    return NextResponse.json(
      { error: "Failed to fetch managers" },
      { status: 500 }
    );
  }
}