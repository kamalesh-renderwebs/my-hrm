import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const departmentId = Number(id);

    if (!Number.isInteger(departmentId)) {
      return NextResponse.json(
        { error: "Invalid department ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { managerId } = body;

    // Allow null to remove the current manager
    if (managerId !== null && !Number.isInteger(Number(managerId))) {
      return NextResponse.json(
        { error: "Invalid manager ID" },
        { status: 400 }
      );
    }

    // Check department
    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // Remove manager
    if (managerId === null) {
      const updatedDepartment = await prisma.department.update({
        where: {
          id: departmentId,
        },
        data: {
          managerId: null,
        },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return NextResponse.json({
        message: "Manager removed successfully",
        department: updatedDepartment,
      });
    }

    const manager = await prisma.user.findUnique({
      where: {
        id: Number(managerId),
      },
    });

    if (!manager) {
      return NextResponse.json(
        { error: "Manager not found" },
        { status: 404 }
      );
    }

    if (manager.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Selected user is not a manager" },
        { status: 400 }
      );
    }

    // Check whether this manager is already assigned
    const existingDepartment = await prisma.department.findFirst({
      where: {
        managerId: Number(managerId),
        NOT: {
          id: departmentId,
        },
      },
    });

    if (existingDepartment) {
      return NextResponse.json(
        {
          error: "This manager is already assigned to another department",
        },
        { status: 400 }
      );
    }

    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        managerId: Number(managerId),
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Manager assigned successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Assign manager error:", error);

    return NextResponse.json(
      { error: "Failed to assign manager" },
      { status: 500 }
    );
  }
}