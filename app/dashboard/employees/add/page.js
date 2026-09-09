
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEmployeePage() {
  const router = useRouter();

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    employeeCode: "",
    dateOfJoining: "",
    departmentId: "",
    designationId: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
  });

  // --------------------------------------------------
  // FETCH DEPARTMENTS & DESIGNATIONS
  // --------------------------------------------------

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();

      setDepartments(data);
    } catch (error) {
      console.error("Fetch departments error:", error);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await fetch("/api/designations");

      if (!response.ok) {
        throw new Error("Failed to fetch designations");
      }

      const data = await response.json();

      setDesignations(data);
    } catch (error) {
      console.error("Fetch designations error:", error);
      setError("Failed to load designations");
    }
  };

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  // --------------------------------------------------
  // SUBMIT FORM
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Required fields
    if (!formData.name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!formData.employeeCode.trim()) {
      setError("Employee ID is required.");
      return;
    }

    if (!formData.dateOfJoining) {
      setError("Date of joining is required.");
      return;
    }

    if (!formData.departmentId) {
      setError("Please select a department.");
      return;
    }

    if (!formData.role) {
      setError("Please select a role.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/employees", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),

          dateOfBirth: formData.dateOfBirth || null,

          employeeCode: formData.employeeCode.trim(),

          dateOfJoining: formData.dateOfJoining,

          departmentId: Number(formData.departmentId),

          designationId: formData.designationId
            ? Number(formData.designationId)
            : null,

          password: formData.password,

          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create employee"
        );
      }

      alert(data.message);

      // Redirect to employee list
      router.push("/dashboard/employees");
    } catch (error) {
      console.error("Create employee error:", error);

      setError(
        error.message || "Failed to create employee"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // CANCEL
  // --------------------------------------------------

  const handleCancel = () => {
    router.push("/dashboard/employees");
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-[#64748B]">
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 text-sm font-medium text-[#64748B] transition hover:text-[#2563EB]"
          >
            ← Back to Employees
          </button>

          <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
            Add Employee
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Create a new employee or manager account.
          </p>
        </div>

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-[#EF4444]">
              {error}
            </p>
          </div>
        )}

        {/* ==========================================
            FORM
        ========================================== */}

        <form onSubmit={handleSubmit}>

          {/* ========================================
              PERSONAL INFORMATION
          ======================================== */}

          <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                Basic information about the employee.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Full Name
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Email
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </div>

          {/* ========================================
              JOB INFORMATION
          ======================================== */}

          <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Job Information
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                Set the employee&apos;s role, department and position.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Employee ID
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  placeholder="EMP001"
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Role
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="EMPLOYEE">
                    Employee
                  </option>

                  <option value="MANAGER">
                    Manager
                  </option>
                </select>

                <p className="mt-1.5 text-xs text-[#64748B]">
                  Managers can manage employees in their assigned department.
                </p>
              </div>

              {/* Date of Joining */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Date of Joining
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Department
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Designation
                </label>

                <select
                  name="designationId"
                  value={formData.designationId}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select designation
                  </option>

                  {designations.map((designation) => (
                    <option
                      key={designation.id}
                      value={designation.id}
                    >
                      {designation.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* MANAGER INFORMATION */}
            {formData.role === "MANAGER" && (
              <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8B5CF6] text-sm text-white">
                    M
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">
                      Manager Role
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#64748B]">
                      This user will be created as a manager and
                      automatically assigned as the manager of the
                      selected department.
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* ========================================
              ACCOUNT INFORMATION
          ======================================== */}

          <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                Login credentials for the employee.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Password
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A]">
                  Confirm Password
                  <span className="ml-1 text-[#EF4444]">
                    *
                  </span>
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </div>

          {/* ========================================
              ACTION BUTTONS
          ======================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving
                ? "Creating..."
                : formData.role === "MANAGER"
                ? "Create Manager"
                : "Create Employee"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

