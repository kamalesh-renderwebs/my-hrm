import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await requireAuth();

    // --------------------------------------------------
    // 1. Find employees based on role
    // --------------------------------------------------

    let employeeWhere = {};

    if (currentUser.role === "ADMIN") {
      employeeWhere = {};
    }

    else if (currentUser.role === "MANAGER") {
      const department = await prisma.department.findUnique({
        where: {
          managerId: currentUser.id,
        },
        select: {
          id: true,
        },
      });

      if (!department) {
        return NextResponse.json({
          role: "MANAGER",
          stats: {
            totalEmployees: 0,
            presentToday: 0,
            onLeave: 0,
            pendingLeaves: 0,
          },
        });
      }

      employeeWhere = {
        departmentId: department.id,
        user: {
          role: "EMPLOYEE",
        },
      };
    }

    else if (currentUser.role === "EMPLOYEE") {
      employeeWhere = {
        userId: currentUser.id,
      };
    }

    else {
      return NextResponse.json(
        { error: "Invalid user role" },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 2. Today's date
    // --------------------------------------------------

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // --------------------------------------------------
    // 3. Total employees
    // --------------------------------------------------

    const totalEmployees = await prisma.employee.count({
      where: employeeWhere,
    });

    // --------------------------------------------------
    // 4. Present today
    // --------------------------------------------------

    const presentToday = await prisma.attendance.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },

        status: "PRESENT",

        employee: employeeWhere,
      },
    });

    // --------------------------------------------------
    // 5. Today's approved leave
    // --------------------------------------------------

    const onLeave = await prisma.leave.count({
      where: {
        status: "APPROVED",

        fromDate: {
          lte: endOfDay,
        },

        toDate: {
          gte: startOfDay,
        },

        employee: employeeWhere,
      },
    });

    // --------------------------------------------------
    // 6. Pending leave requests
    // --------------------------------------------------

    const pendingLeaves = await prisma.leave.count({
      where: {
        status: "PENDING",

        employee: employeeWhere,
      },
    });

    // --------------------------------------------------
    // 7. Absent employees
    // --------------------------------------------------

    const absentToday = Math.max(
      totalEmployees - presentToday - onLeave,
      0
    );

    // --------------------------------------------------
    // 8. Return statistics
    // --------------------------------------------------

    return NextResponse.json({
      role: currentUser.role,

      stats: {
        totalEmployees,
        presentToday,
        onLeave,
        absentToday,
        pendingLeaves,
      },
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}