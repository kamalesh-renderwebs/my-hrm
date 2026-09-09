import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        department: true,
        designation: true,
        attendance: true,
        leaves: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Get employee error:", error);

    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const employeeId = Number(id);

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const updatedEmployee = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: employee.userId,
        },
        data: {
          name: body.name,
          email: body.email,
        },
      });

      const updatedEmployeeData = await tx.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          phone: body.phone,
        },
        include: {
          user: true,
          department: true,
          designation: true,
        },
      });

      return updatedEmployeeData;
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Update employee error:", error);

    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const employeeId = Number(id);

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Delete related attendance records
    await prisma.attendance.deleteMany({
      where: {
        employeeId: employeeId,
      },
    });

    // Delete related leave records
    await prisma.leave.deleteMany({
      where: {
        employeeId: employeeId,
      },
    });

    // Delete employee
    await prisma.employee.delete({
      where: {
        id: employeeId,
      },
    });

    // Delete associated user account
    await prisma.user.delete({
      where: {
        id: employee.userId,
      },
    });

    return NextResponse.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete employee error:", error);

    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}