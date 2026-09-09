"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filters
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // --------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  async function fetchEmployees() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/employees");

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDepartments() {
    try {
      const response = await fetch("/api/departments");

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();

      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  // --------------------------------------------------
  // FILTER EMPLOYEES
  // --------------------------------------------------

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const name = employee.user?.name || "";
      const email = employee.user?.email || "";
      const employeeCode = employee.employeeCode || "";
      const role = employee.user?.role || "EMPLOYEE";

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        employeeCode.toLowerCase().includes(searchText);

      const matchesDepartment =
        !departmentFilter ||
        String(employee.departmentId) === String(departmentFilter);

      const matchesRole =
        !roleFilter || role === roleFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesRole
      );
    });
  }, [
    employees,
    search,
    departmentFilter,
    roleFilter,
  ]);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const totalEmployees = employees.length;

  const totalManagers = employees.filter(
    (employee) => employee.user?.role === "MANAGER"
  ).length;

  const normalEmployees = employees.filter(
    (employee) =>
      !employee.user?.role ||
      employee.user?.role === "EMPLOYEE"
  ).length;

  // Only employees with today's attendance PRESENT
  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIVE"
  ).length;

  // --------------------------------------------------
  // INITIALS
  // --------------------------------------------------

  function getInitials(name) {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  // --------------------------------------------------
  // ROLE LABEL
  // --------------------------------------------------

  function getRoleLabel(role) {
    if (role === "MANAGER") {
      return "Manager";
    }

    return "Employee";
  }

  // --------------------------------------------------
  // ROLE BADGE
  // --------------------------------------------------

  function getRoleBadge(role) {
    if (role === "MANAGER") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------

  function ActiveBadge() {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-[#10B981]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
        ACTIVE
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] space-y-6">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Employees
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage employees and managers in your organization.
          </p>
        </div>

        <Link
          href="/dashboard/employees/add"
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] sm:w-auto"
        >
          + Add Employee
        </Link>

      </div>

      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm font-medium text-[#EF4444]">
            {error}
          </p>

          <button
            onClick={fetchEmployees}
            className="text-sm font-semibold text-[#EF4444] hover:underline"
          >
            Retry
          </button>

        </div>
      )}

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-[#64748B]">
            Total People
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">
            {totalEmployees}
          </h2>

          <p className="mt-1 text-xs text-[#64748B]">
            Employees + Managers
          </p>

        </div>

        {/* Employees */}

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-[#64748B]">
            Employees
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#2563EB]">
            {normalEmployees}
          </h2>

          <p className="mt-1 text-xs text-[#64748B]">
            Regular employees
          </p>

        </div>

        {/* Managers */}

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-[#64748B]">
            Managers
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#8B5CF6]">
            {totalManagers}
          </h2>

          <p className="mt-1 text-xs text-[#64748B]">
            Department managers
          </p>

        </div>

        {/* Active */}

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-[#64748B]">
            Active
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#10B981]">
            {activeEmployees}
          </h2>

          <p className="mt-1 text-xs text-[#64748B]">
            Present today
          </p>

        </div>

      </div>

      {/* ==================================================
          SEARCH & FILTER
      ================================================== */}

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

          {/* Search */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-xs font-medium text-[#64748B]">
              Search
            </label>

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or employee ID..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* Department */}

          <div>

            <label className="mb-2 block text-xs font-medium text-[#64748B]">
              Department
            </label>

            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value)
              }
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            >

              <option value="">
                All Departments
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

          {/* Role */}

          <div>

            <label className="mb-2 block text-xs font-medium text-[#64748B]">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            >

              <option value="">
                All Roles
              </option>

              <option value="EMPLOYEE">
                Employee
              </option>

              <option value="MANAGER">
                Manager
              </option>

            </select>

          </div>

        </div>

        {/* Filter result */}

        {(search || departmentFilter || roleFilter) && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-4">

            <p className="text-sm text-[#64748B]">
              Showing{" "}
              <span className="font-semibold text-[#0F172A]">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0F172A]">
                {employees.length}
              </span>{" "}
              people
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDepartmentFilter("");
                setRoleFilter("");
              }}
              className="text-sm font-medium text-[#2563EB] hover:underline"
            >
              Clear filters
            </button>

          </div>
        )}

      </div>

      {/* ==================================================
          EMPLOYEE LIST
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">

        {/* Table Header */}

        <div className="flex flex-col gap-1 border-b border-[#E2E8F0] p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-[#0F172A]">
              Employee List
            </h2>

            <p className="mt-1 text-xs text-[#64748B]">
              {filteredEmployees.length} records found
            </p>

          </div>

        </div>

        {/* ==================================================
            DESKTOP TABLE
        ================================================== */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full">

            <thead className="bg-[#F8FAFC]">

              <tr className="border-b border-[#E2E8F0] text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">

                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  ID
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Designation
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-[#64748B]"
                  >
                    Loading employees...
                  </td>

                </tr>

              ) : filteredEmployees.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFC] text-xl">
                        👤
                      </div>

                      <p className="text-sm font-medium text-[#0F172A]">
                        No employees found
                      </p>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Try changing your search or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredEmployees.map((employee) => {

                  const name =
                    employee.user?.name || "Unknown";

                  const email =
                    employee.user?.email || "-";

                  const role =
                    employee.user?.role || "EMPLOYEE";

                  const initials =
                    getInitials(name);

                  return (

                    <tr
                      key={employee.id}
                      className="transition hover:bg-[#F8FAFC]"
                    >

                      {/* Employee */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#2563EB]">
                            {initials}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-[#0F172A]">
                              {name}
                            </p>

                            <p className="truncate text-xs text-[#64748B]">
                              {email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Employee ID */}

                      <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">
                        {employee.employeeCode}
                      </td>

                      {/* Role */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRoleBadge(
                            role
                          )}`}
                        >
                          {getRoleLabel(role)}
                        </span>

                      </td>

                      {/* Department */}

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {employee.department?.name || "-"}
                      </td>

                      {/* Designation */}

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {employee.designation?.name || "-"}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        {employee.status === "ACTIVE" && (
                          <ActiveBadge />
                        )}

                      </td>

                      {/* Action */}

                      <td className="px-6 py-4">

                        <Link
                          href={`/dashboard/employees/${employee.id}`}
                          className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                        >
                          View
                        </Link>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* ==================================================
            MOBILE CARDS
        ================================================== */}

        <div className="divide-y divide-[#E2E8F0] md:hidden">

          {loading ? (

            <div className="px-5 py-12 text-center text-sm text-[#64748B]">
              Loading employees...
            </div>

          ) : filteredEmployees.length === 0 ? (

            <div className="px-5 py-12 text-center">

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFC] text-xl">
                👤
              </div>

              <p className="text-sm font-medium text-[#0F172A]">
                No employees found
              </p>

              <p className="mt-1 text-xs text-[#64748B]">
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            filteredEmployees.map((employee) => {

              const name =
                employee.user?.name || "Unknown";

              const email =
                employee.user?.email || "-";

              const role =
                employee.user?.role || "EMPLOYEE";

              return (

                <div
                  key={employee.id}
                  className="p-5"
                >

                  {/* Top */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#2563EB]">
                        {getInitials(name)}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-[#0F172A]">
                          {name}
                        </p>

                        <p className="truncate text-xs text-[#64748B]">
                          {email}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getRoleBadge(
                        role
                      )}`}
                    >
                      {getRoleLabel(role)}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="mt-4 grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">
                        Employee ID
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#0F172A]">
                        {employee.employeeCode}
                      </p>

                    </div>

                    <div>

                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">
                        Status
                      </p>

                      {employee.status === "ACTIVE" ? (
                        <div className="mt-1">
                          <ActiveBadge />
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-[#94A3B8]">
                          —
                        </p>
                      )}

                    </div>

                    <div>

                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">
                        Department
                      </p>

                      <p className="mt-1 text-sm text-[#64748B]">
                        {employee.department?.name || "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">
                        Designation
                      </p>

                      <p className="mt-1 text-sm text-[#64748B]">
                        {employee.designation?.name || "-"}
                      </p>

                    </div>

                  </div>

                  {/* View */}

                  <Link
                    href={`/dashboard/employees/${employee.id}`}
                    className="mt-4 block w-full rounded-xl border border-[#E2E8F0] py-2.5 text-center text-sm font-semibold text-[#2563EB] transition hover:bg-[#F8FAFC]"
                  >
                    View Employee
                  </Link>

                </div>

              );

            })

          )}

        </div>

      </div>

    </div>
  );
}