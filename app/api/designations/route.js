import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all designations
export async function GET() {
  try {
    const designations = await prisma.designation.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        employees: true,
      },
    });

    const formattedDesignations = designations.map((designation) => ({
      id: designation.id,
      name: designation.name,
      employeeCount: designation.employees.length,
      createdAt: designation.createdAt,
    }));

    return NextResponse.json(formattedDesignations);
  } catch (error) {
    console.error("Get designations error:", error);

    return NextResponse.json(
      { error: "Failed to fetch designations" },
      { status: 500 }
    );
  }
}

// POST create designation
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Designation name is required" },
        { status: 400 }
      );
    }

    const existingDesignation = await prisma.designation.findUnique({
      where: {
        name: name.trim(),
      },
    });

    if (existingDesignation) {
      return NextResponse.json(
        { error: "Designation already exists" },
        { status: 409 }
      );
    }

    const designation = await prisma.designation.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Designation created successfully",
        designation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create designation error:", error);

    return NextResponse.json(
      { error: "Failed to create designation" },
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