import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST() {
  try {
    const currentUser = await requireAuth();

    // Find logged-in user's employee record
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

    // Today's date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check whether already checked in today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: "You have already checked in today" },
        { status: 400 }
      );
    }

    // Create attendance
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: new Date(),
        checkIn: new Date(),
        status: "PRESENT",
      },
    });

    return NextResponse.json(
      {
        message: "Check-in successful",
        attendance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Check-in error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to check in" },
      { status: 500 }
    );
  }
}