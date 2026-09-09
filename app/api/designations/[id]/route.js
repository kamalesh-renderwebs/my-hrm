import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single designation
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const designationId = Number(id);

    const designation = await prisma.designation.findUnique({
      where: {
        id: designationId,
      },
    });

    if (!designation) {
      return NextResponse.json(
        { error: "Designation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(designation);
  } catch (error) {
    console.error("Get designation error:", error);

    return NextResponse.json(
      { error: "Failed to fetch designation" },
      { status: 500 }
    );
  }
}

// UPDATE designation
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const designationId = Number(id);

    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Designation name is required" },
        { status: 400 }
      );
    }

    const existingDesignation =
      await prisma.designation.findUnique({
        where: {
          id: designationId,
        },
      });

    if (!existingDesignation) {
      return NextResponse.json(
        { error: "Designation not found" },
        { status: 404 }
      );
    }

    const duplicateDesignation =
      await prisma.designation.findFirst({
        where: {
          name: name.trim(),
          NOT: {
            id: designationId,
          },
        },
      });

    if (duplicateDesignation) {
      return NextResponse.json(
        { error: "Designation already exists" },
        { status: 409 }
      );
    }

    const updatedDesignation =
      await prisma.designation.update({
        where: {
          id: designationId,
        },
        data: {
          name: name.trim(),
        },
      });

    return NextResponse.json({
      message: "Designation updated successfully",
      designation: updatedDesignation,
    });
  } catch (error) {
    console.error("Update designation error:", error);

    return NextResponse.json(
      { error: "Failed to update designation" },
      { status: 500 }
    );
  }
}
// DELETE designation
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const designationId = Number(id);

    const designation = await prisma.designation.findUnique({
      where: {
        id: designationId,
      },
      include: {
        employees: true,
      },
    });

    if (!designation) {
      return NextResponse.json(
        { error: "Designation not found" },
        { status: 404 }
      );
    }

    // Don't delete if employees are using this designation
    if (designation.employees.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete designation because employees are assigned to it.",
        },
        { status: 400 }
      );
    }

    await prisma.designation.delete({
      where: {
        id: designationId,
      },
    });

    return NextResponse.json({
      message: "Designation deleted successfully",
    });
  } catch (error) {
    console.error("Delete designation error:", error);

    return NextResponse.json(
      { error: "Failed to delete designation" },
      { status: 500 }
    );
  }
}