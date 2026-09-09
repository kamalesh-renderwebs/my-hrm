import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const currentUser = await requireAuth();

    // Only ADMIN and MANAGER can approve/reject
    if (
      currentUser.role !== "ADMIN" &&
      currentUser.role !== "MANAGER"
    ) {
      return NextResponse.json(
        {
          error: "You are not allowed to update leave requests",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const leaveId = Number(id);

    if (!Number.isInteger(leaveId)) {
      return NextResponse.json(
        { error: "Invalid leave ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Only these two actions are allowed
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        {
          error: "Status must be APPROVED or REJECTED",
        },
        { status: 400 }
      );
    }

    // Find leave request
    const leave = await prisma.leave.findUnique({
      where: {
        id: leaveId,
      },
      include: {
        employee: {
          select: {
            id: true,
            departmentId: true,
            user: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Leave does not exist
    if (!leave) {
      return NextResponse.json(
        {
          error: "Leave request not found",
        },
        { status: 404 }
      );
    }

    // Only EMPLOYEE leave requests can be approved/rejected
    if (leave.employee.user.role !== "EMPLOYEE") {
      return NextResponse.json(
        {
          error: "Only employee leave requests can be updated",
        },
        { status: 403 }
      );
    }

    // Only PENDING requests can be changed
    if (leave.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "Only pending leave requests can be updated",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // MANAGER PERMISSION CHECK
    // ==========================================

    if (currentUser.role === "MANAGER") {
      const department = await prisma.department.findUnique({
        where: {
          managerId: currentUser.id,
        },
        select: {
          id: true,
        },
      });

      // Manager has no assigned department
      if (!department) {
        return NextResponse.json(
          {
            error: "You are not assigned to a department",
          },
          { status: 403 }
        );
      }

      // Leave employee must belong to manager's department
      if (leave.employee.departmentId !== department.id) {
        return NextResponse.json(
          {
            error:
              "You can only manage leaves from your department",
          },
          { status: 403 }
        );
      }
    }

    // ==========================================
    // UPDATE LEAVE
    // ==========================================

    const updatedLeave = await prisma.leave.update({
      where: {
        id: leaveId,
      },
      data: {
        status,
        approvedBy: currentUser.id,
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

    return NextResponse.json({
      message:
        status === "APPROVED"
          ? "Leave approved successfully"
          : "Leave rejected successfully",

      leave: updatedLeave,
    });
  } catch (error) {
    console.error("Update leave error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update leave request",
      },
      { status: 500 }
    );
  }
}