import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const departmentId = Number(id);

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

    return NextResponse.json(department);
  } catch (error) {
    console.error("Get department error:", error);

    return NextResponse.json(
      { error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const departmentId = Number(id);

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
        id: departmentId,
      },
    });

    if (!existingDepartment) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Update department error:", error);

    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const departmentId = Number(id);

    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
      include: {
        employees: true,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // Don't allow deletion if employees are assigned
    if (department.employees.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete department because employees are assigned to it.",
        },
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: {
        id: departmentId,
      },
    });

    return NextResponse.json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete department error:", error);

    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}