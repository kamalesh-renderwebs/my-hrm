import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    const currentUser = await requireAuth();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let where = {};

    // ==========================================
    // DATE FILTER
    // ==========================================

    if (date) {
      const selectedDate = new Date(`${date}T00:00:00`);

      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);

      where.date = {
        gte: selectedDate,
        lt: nextDate,
      };
    }

    // ==========================================
    // ADMIN
    // ==========================================

    if (currentUser.role === "ADMIN") {
      // Admin can see everyone
      where = {
        ...where,
      };
    }

    // ==========================================
    // MANAGER
    // ==========================================

    else if (currentUser.role === "MANAGER") {
      const department =
        await prisma.department.findUnique({
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

      /*
        Manager can see:

        1. Their own attendance
        2. Employees in their department
      */

      where = {
        ...where,

        employee: {
          departmentId: department.id,
        },
      };
    }

    // ==========================================
    // EMPLOYEE
    // ==========================================

    else if (currentUser.role === "EMPLOYEE") {
      where = {
        ...where,

        employee: {
          userId: currentUser.id,
        },
      };
    }

    // ==========================================
    // INVALID ROLE
    // ==========================================

    else {
      return NextResponse.json(
        {
          error: "Invalid user role",
        },
        {
          status: 403,
        }
      );
    }

    // ==========================================
    // FETCH ATTENDANCE
    // ==========================================

    const attendance =
      await prisma.attendance.findMany({
        where,

        orderBy: {
          date: "desc",
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

    return NextResponse.json(attendance);
  } catch (error) {
    console.error(
      "Get attendance error:",
      error
    );

    if (
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch attendance",
      },
      {
        status: 500,
      }
    );
  }
}