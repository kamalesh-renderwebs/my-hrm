
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        employees: true,

        // Include assigned manager
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

    const formattedDepartments = departments.map((department) => ({
      id: department.id,
      name: department.name,
      employeeCount: department.employees.length,
      createdAt: department.createdAt,

      // Manager information
      managerId: department.managerId,
      manager: department.manager,
    }));

    return NextResponse.json(formattedDepartments);
  } catch (error) {
    console.error("Get departments error:", error);

    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    const existingDepartment = await prisma.department.findUnique({
      where: {
        name: name.trim(),
      },
    });

    if (existingDepartment) {
      return NextResponse.json(
        { error: "Department already exists" },
        { status: 409 }
      );
    }

    const department = await prisma.department.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Department created successfully",
        department,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create department error:", error);

    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
