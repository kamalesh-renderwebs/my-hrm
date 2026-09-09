
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // --------------------------------------------------
  // Fetch Employee
  // --------------------------------------------------

  useEffect(() => {
    async function fetchEmployee() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/employees/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Employee not found");
        }

        setEmployee(data);

        setFormData({
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("Fetch employee error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // --------------------------------------------------
  // Update Employee
  // --------------------------------------------------

  async function handleSave() {
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update employee");
      }

      setEmployee(data);

      setFormData({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.phone || "",
      });

      setIsEditing(false);

      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // Cancel Editing
  // --------------------------------------------------

  function handleCancel() {
    setIsEditing(false);

    setFormData({
      name: employee.user?.name || "",
      email: employee.user?.email || "",
      phone: employee.phone || "",
    });
  }

  // --------------------------------------------------
  // Delete Employee
  // --------------------------------------------------

  async function handleDelete() {
    const employeeName = employee.user?.name || "this employee";

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employeeName}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete employee");
      }

      alert("Employee deleted successfully!");

      router.push("/dashboard/employees");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  function getInitials(name) {
    if (!name) {
      return "EM";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getRoleLabel(role) {
    if (role === "MANAGER") {
      return "Manager";
    }

    if (role === "ADMIN") {
      return "Admin";
    }

    return "Employee";
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-slate-200" />
            <div className="h-32 rounded-2xl bg-white border border-[#E2E8F0]" />
            <div className="h-80 rounded-2xl bg-white border border-[#E2E8F0]" />
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Error / Not Found
  // --------------------------------------------------

  if (!employee) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-7 w-7 text-[#EF4444]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">
              Employee not found
            </h2>

            <p className="mt-2 text-sm text-[#64748B]">
              {error || "We couldn't find this employee."}
            </p>

            <button
              onClick={() => router.push("/dashboard/employees")}
              className="mt-6 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
            >
              Back to Employees
            </button>
          </div>
        </div>
      </main>
    );
  }

  const name = employee.user?.name || "Unknown Employee";
  const email = employee.user?.email || "-";
  const role = employee.user?.role || "EMPLOYEE";

  const department = employee.department?.name || "-";
  const designation = employee.designation?.name || "-";

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==============================================
            PAGE HEADER
        =============================================== */}

        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/employees")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#2563EB]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Employees
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                Employee Details
              </h1>

              <p className="mt-1 text-sm text-[#64748B]">
                View and manage employee information
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>

                  Edit Employee
                </button>
              )}

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#EF4444] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10"
                  />
                </svg>

                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        {/* ==============================================
            PROFILE HEADER
        =============================================== */}

        <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">

          <div className="h-24 bg-[#0F172A] sm:h-28" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* Avatar */}

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#2563EB] text-xl font-bold text-white shadow-sm sm:h-24 sm:w-24 sm:text-2xl">
                  {getInitials(name)}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2 lg:mt-15">
                    <h2 className="text-xl   font-bold text-[#0F172A] sm:text-2xl">
                      {name}
                    </h2>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#10B981]">
                      Active
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[#64748B]">
                    {designation}
                  </p>
                </div>
              </div>

              {/* Role */}

              <div className="flex items-center gap-2 pb-1">
                <span className="text-sm text-[#64748B]">
                  Role
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    role === "MANAGER"
                      ? "bg-purple-50 text-[#8B5CF6]"
                      : "bg-blue-50 text-[#2563EB]"
                  }`}
                >
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================
            MAIN CONTENT
        =============================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ============================================
              PERSONAL INFORMATION
          ============================================= */}

          <section className="lg:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">

            <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
              <h3 className="text-base font-semibold text-[#0F172A]">
                Personal Information
              </h3>

              <p className="mt-1 text-xs text-[#64748B]">
                Basic employee contact information
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

              {/* Name */}

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Full Name
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="mt-2 text-sm font-medium text-[#0F172A]">
                    {name}
                  </p>
                )}
              </div>

              {/* Email */}

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Email Address
                </label>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="mt-2 break-all text-sm font-medium text-[#0F172A]">
                    {email}
                  </p>
                )}
              </div>

              {/* Phone */}

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Phone Number
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="mt-2 text-sm font-medium text-[#0F172A]">
                    {employee.phone || "-"}
                  </p>
                )}
              </div>

              {/* Employee ID */}

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Employee ID
                </label>

                <p className="mt-2 text-sm font-medium text-[#0F172A]">
                  {employee.employeeCode}
                </p>
              </div>

              {/* Date of Birth */}

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Date of Birth
                </label>

                <p className="mt-2 text-sm font-medium text-[#0F172A]">
                  {formatDate(employee.dateOfBirth)}
                </p>
              </div>

              {/* Date of Joining */}

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Date of Joining
                </label>

                <p className="mt-2 text-sm font-medium text-[#0F172A]">
                  {formatDate(employee.dateOfJoining)}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================
              WORK INFORMATION
          ============================================= */}

          <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">

            <div className="border-b border-[#E2E8F0] px-5 py-4">
              <h3 className="text-base font-semibold text-[#0F172A]">
                Work Information
              </h3>

              <p className="mt-1 text-xs text-[#64748B]">
                Employee organization details
              </p>
            </div>

            <div className="space-y-5 p-5">

              {/* Department */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Department
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-medium text-[#0F172A]">
                    {department}
                  </p>
                </div>
              </div>

              {/* Designation */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Designation
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-[#8B5CF6]">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 12c0 5.591 3.824 10.29 9 11.622C17.176 22.29 21 17.591 21 12c0-1.04-.133-2.049-.382-3.016"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-medium text-[#0F172A]">
                    {designation}
                  </p>
                </div>
              </div>

              {/* Role */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Role
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-[#64748B]">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-medium text-[#0F172A]">
                    {getRoleLabel(role)}
                  </p>
                </div>
              </div>

              {/* Status */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Status
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                  </div>

                  <p className="text-sm font-medium text-[#10B981]">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ==============================================
            EDIT ACTION BAR
        =============================================== */}

        {isEditing && (
          <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  You are editing this employee
                </p>

                <p className="mt-1 text-xs text-[#64748B]">
                  Review the changes before saving.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#64748B] transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==============================================
            QUICK SUMMARY
        =============================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Employee ID
            </p>

            <p className="mt-2 text-lg font-bold text-[#0F172A]">
              {employee.employeeCode}
            </p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Department
            </p>

            <p className="mt-2 text-lg font-bold text-[#0F172A]">
              {department}
            </p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Joined
            </p>

            <p className="mt-2 text-lg font-bold text-[#0F172A]">
              {formatDate(employee.dateOfJoining)}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

