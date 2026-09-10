import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createActivityLog } from "@/lib/activityLog";

// ==================================================
// GET Employees
// ==================================================


export async function GET() {
  try {
    // Get logged-in user from JWT
    const currentUser = await requireAuth();

    let where = {};

    // -----------------------------------------------
    // ADMIN
    // Can see all employees
    // -----------------------------------------------
    if (currentUser.role === "ADMIN") {
      where = {};
    }

    // -----------------------------------------------
    // MANAGER
    // Can see employees from their department
    // -----------------------------------------------
    else if (currentUser.role === "MANAGER") {
      const department = await prisma.department.findUnique({
        where: {
          managerId: currentUser.id,
        },
        select: {
          id: true,
        },
      });

      // Manager has no department
      if (!department) {
        return NextResponse.json([]);
      }

      where = {
        departmentId: department.id,

        // Don't show manager themselves
        user: {
          role: "EMPLOYEE",
        },
      };
    }

    // -----------------------------------------------
    // EMPLOYEE
    // Can see only themselves
    // -----------------------------------------------
    else if (currentUser.role === "EMPLOYEE") {
      where = {
        userId: currentUser.id,
      };
    }

    // -----------------------------------------------
    // Unknown role
    // -----------------------------------------------
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

    // -----------------------------------------------
    // Get employees
    // -----------------------------------------------

    const employees = await prisma.employee.findMany({
      where,

      orderBy: {
        id: "desc",
      },

      include: {
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

        // Get today's attendance
        attendance: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
          },

          select: {
            status: true,
          },

          take: 1,
        },
      },
    });

    // -----------------------------------------------
    // Add ACTIVE status
    // -----------------------------------------------

    const employeesWithStatus = employees.map((employee) => {
      const todayAttendance = employee.attendance[0];

      return {
        ...employee,

        status:
          todayAttendance?.status === "PRESENT"
            ? "ACTIVE"
            : null,

        // Don't send attendance array to frontend
        attendance: undefined,
      };
    });

    return NextResponse.json(employeesWithStatus);
  } catch (error) {
    console.error("Get employees error:", error);

    if (error.message === "UNAUTHORIZED") {
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
        error: "Failed to fetch employees",
      },
      {
        status: 500,
      }
    );
  }
}
// ==================================================
// CREATE Employee / Manager
// ==================================================


export async function POST(request) {
  try {
    // -----------------------------------------------
    // AUTHENTICATION
    // -----------------------------------------------

    const user = await requireAuth();

    // Only ADMIN can create employees
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Only administrators can create employees",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      dateOfJoining,
      employeeCode,
      departmentId,
      designationId,
      role,
    } = body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    if (!employeeCode || !employeeCode.trim()) {
      return NextResponse.json(
        { error: "Employee code is required" },
        { status: 400 }
      );
    }

    if (!dateOfJoining) {
      return NextResponse.json(
        { error: "Date of joining is required" },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // ROLE
    // -----------------------------------------------

    const selectedRole = role || "EMPLOYEE";

    if (!["EMPLOYEE", "MANAGER"].includes(selectedRole)) {
      return NextResponse.json(
        {
          error: "Invalid role. Use EMPLOYEE or MANAGER",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // DEPARTMENT
    // -----------------------------------------------

    if (!departmentId) {
      return NextResponse.json(
        { error: "Department is required" },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // CHECK EXISTING USER
    // -----------------------------------------------

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // -----------------------------------------------
    // CHECK EMPLOYEE CODE
    // -----------------------------------------------

    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          employeeCode: employeeCode.trim(),
        },
      });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee code already exists" },
        { status: 409 }
      );
    }

    // -----------------------------------------------
    // CHECK DEPARTMENT
    // -----------------------------------------------

    const department = await prisma.department.findUnique({
      where: {
        id: Number(departmentId),
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // -----------------------------------------------
    // MANAGER CHECK
    // -----------------------------------------------

    if (selectedRole === "MANAGER") {
      if (department.managerId) {
        return NextResponse.json(
          {
            error:
              "This department already has a manager. Remove the existing manager first.",
          },
          { status: 409 }
        );
      }
    }

    // -----------------------------------------------
    // CHECK DESIGNATION
    // -----------------------------------------------

    let designation = null;

    if (designationId) {
      designation = await prisma.designation.findUnique({
        where: {
          id: Number(designationId),
        },
      });

      if (!designation) {
        return NextResponse.json(
          { error: "Designation not found" },
          { status: 404 }
        );
      }
    }

    // -----------------------------------------------
    // HASH PASSWORD
    // -----------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -----------------------------------------------
    // CREATE USER + EMPLOYEE
    // -----------------------------------------------

    const result = await prisma.$transaction(
      async (tx) => {
        // -------------------------------------------
        // CREATE USER
        // -------------------------------------------

        const newUser = await tx.user.create({
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: selectedRole,
          },
        });

        // -------------------------------------------
        // CREATE EMPLOYEE
        // -------------------------------------------

        const employee = await tx.employee.create({
          data: {
            userId: newUser.id,

            employeeCode: employeeCode.trim(),

            phone: phone?.trim() || null,

            dateOfBirth: dateOfBirth
              ? new Date(dateOfBirth)
              : null,

            dateOfJoining: new Date(dateOfJoining),

            departmentId: Number(departmentId),

            designationId: designationId
              ? Number(designationId)
              : null,
          },

          include: {
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
        });

        // -------------------------------------------
        // ASSIGN MANAGER TO DEPARTMENT
        // -------------------------------------------

        if (selectedRole === "MANAGER") {
          await tx.department.update({
            where: {
              id: Number(departmentId),
            },

            data: {
              managerId: newUser.id,
            },
          });
        }

        return employee;
      }
    );

    // -----------------------------------------------
    // ACTIVITY LOG
    // -----------------------------------------------

    await createActivityLog({
      userId: user.id,
      action: "CREATE",
      module: "EMPLOYEE",

      description:
        selectedRole === "MANAGER"
          ? `Created manager ${result.user.name} and assigned to ${result.department.name} department`
          : `Created employee ${result.user.name}`,
    });

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return NextResponse.json(
      {
        message:
          selectedRole === "MANAGER"
            ? "Manager created and assigned successfully"
            : "Employee created successfully",

        employee: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create employee error:", error);

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
        error: "Failed to create employee",
      },
      { status: 500 }
    );
  }
}