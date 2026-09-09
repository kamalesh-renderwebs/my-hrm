import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST() {
  try {
    const currentUser = await requireAuth();

    // Find employee linked to logged-in user
    const employee = await prisma.employee.findUnique({
      where: {
        userId: currentUser.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    // Today's start and end
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find today's attendance
    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // No check-in
    if (!attendance) {
      return NextResponse.json(
        { error: "You have not checked in today" },
        { status: 400 }
      );
    }

    // Already checked out
    if (attendance.checkOut) {
      return NextResponse.json(
        { error: "You have already checked out today" },
        { status: 400 }
      );
    }

    // Update checkout
    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        checkOut: new Date(),
      },
    });

    return NextResponse.json({
      message: "Check-out successful",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Check-out error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to check out" },
      { status: 500 }
    );
  }
}