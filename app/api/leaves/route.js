import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// ==================================================
// GET LEAVES
// ==================================================

export async function GET() {
  try {
    const currentUser = await requireAuth();

    let where = {};

    // ADMIN
    // Can see all leave requests
    if (currentUser.role === "ADMIN") {
      where = {};
    }

    // MANAGER
    // Can see leaves of employees in their department
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
        return NextResponse.json([]);
      }

      where = {
        employee: {
          departmentId: department.id,
          user: {
            role: "EMPLOYEE",
          },
        },
      };
    }

    // EMPLOYEE
    // Can see only their own leaves
    else if (currentUser.role === "EMPLOYEE") {
      where = {
        employee: {
          userId: currentUser.id,
        },
      };
    }

    else {
      return NextResponse.json(
        { error: "Invalid user role" },
        { status: 403 }
      );
    }

    const leaves = await prisma.leave.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,

            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },

            department: {
              select: {
                id: true,
                name: true,
              },
            },

            designation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(leaves);

  } catch (error) {
    console.error("Get leaves error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch leaves" },
      { status: 500 }
    );
  }
}

// ==================================================
// CREATE LEAVE
// ==================================================

export async function POST(request) {
  try {
    const currentUser = await requireAuth();

    // Only employees can apply for leave
    if (currentUser.role !== "EMPLOYEE") {
      return NextResponse.json(
        {
          error: "Only employees can apply for leave",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      leaveType,
      fromDate,
      toDate,
      reason,
    } = body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!leaveType || !leaveType.trim()) {
      return NextResponse.json(
        {
          error: "Leave type is required",
        },
        { status: 400 }
      );
    }

    if (!fromDate) {
      return NextResponse.json(
        {
          error: "From date is required",
        },
        { status: 400 }
      );
    }

    if (!toDate) {
      return NextResponse.json(
        {
          error: "To date is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // DATE VALIDATION
    // -----------------------------------------------

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return NextResponse.json(
        {
          error: "Invalid date",
        },
        { status: 400 }
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        {
          error: "From date cannot be after To date",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // FIND EMPLOYEE
    // -----------------------------------------------

    const employee = await prisma.employee.findUnique({
      where: {
        userId: currentUser.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        {
          error: "Employee profile not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------------
    // CHECK OVERLAPPING LEAVE
    // -----------------------------------------------

    const existingLeave = await prisma.leave.findFirst({
      where: {
        employeeId: employee.id,

        status: {
          in: ["PENDING", "APPROVED"],
        },

        fromDate: {
          lte: endDate,
        },

        toDate: {
          gte: startDate,
        },
      },
    });

    if (existingLeave) {
      return NextResponse.json(
        {
          error:
            "You already have a pending or approved leave for these dates",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------------
    // CREATE LEAVE
    // -----------------------------------------------

    const leave = await prisma.leave.create({
      data: {
        employeeId: employee.id,
        leaveType: leaveType.trim(),
        fromDate: startDate,
        toDate: endDate,
        reason: reason?.trim() || null,
        status: "PENDING",
      },

      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,

            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },

            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Leave applied successfully",
        leave,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create leave error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to apply leave",
      },
      { status: 500 }
    );
  }
}