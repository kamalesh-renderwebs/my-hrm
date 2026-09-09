"use client";

import { useEffect, useState } from "react";

export default function MyTeamPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyTeam() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/employees");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch team");
        }

        setEmployees(data);
      } catch (error) {
        console.error("My team error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyTeam();
  }, []);

  function getInitials(name) {
    if (!name) return "EM";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            My Team
          </h1>

          <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center">
            <p className="text-sm text-[#64748B]">
              Loading your team...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            My Team
          </h1>

          <div className="mt-6 rounded-2xl border border-red-100 bg-white p-8 text-center">
            <p className="text-sm text-[#EF4444]">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
            My Team
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Employees in your department
          </p>
        </div>

        {/* Team Count */}

        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#64748B]">
            Team Members
          </p>

          <p className="mt-1 text-2xl font-bold text-[#0F172A]">
            {employees.length}
          </p>
        </div>

        {/* Empty State */}

        {employees.length === 0 && (
          <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
              👥
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#0F172A]">
              No team members
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              There are no employees assigned to your department.
            </p>
          </div>
        )}

        {/* Desktop Table */}

        {employees.length > 0 && (
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm md:block">

            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h2 className="font-semibold text-[#0F172A]">
                Team Members
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Employee ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Designation
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">

                  {employees.map((employee) => {
                    const name =
                      employee.user?.name || "Unknown";

                    return (
                      <tr
                        key={employee.id}
                        className="transition hover:bg-[#F8FAFC]"
                      >

                        {/* Employee */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                              {getInitials(name)}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-[#0F172A]">
                                {name}
                              </p>

                              <p className="text-xs text-[#64748B]">
                                {employee.user?.role === "MANAGER"
                                  ? "Manager"
                                  : "Employee"}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Employee ID */}

                        <td className="px-6 py-4 text-sm text-[#0F172A]">
                          {employee.employeeCode}
                        </td>

                        {/* Designation */}

                        <td className="px-6 py-4 text-sm text-[#64748B]">
                          {employee.designation?.name || "-"}
                        </td>

                        {/* Email */}

                        <td className="px-6 py-4 text-sm text-[#64748B]">
                          {employee.user?.email || "-"}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#10B981]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                            Active
                          </span>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards */}

        {employees.length > 0 && (
          <div className="mt-6 space-y-3 md:hidden">

            {employees.map((employee) => {
              const name =
                employee.user?.name || "Unknown";

              return (
                <div
                  key={employee.id}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                      {getInitials(name)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-[#0F172A]">
                        {name}
                      </h3>

                      <p className="text-xs text-[#64748B]">
                        {employee.employeeCode}
                      </p>
                    </div>

                    <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#10B981]">
                      Active
                    </span>

                  </div>

                  <div className="mt-4 space-y-2 border-t border-[#E2E8F0] pt-4">

                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-[#64748B]">
                        Designation
                      </span>

                      <span className="text-right text-sm font-medium text-[#0F172A]">
                        {employee.designation?.name || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-[#64748B]">
                        Email
                      </span>

                      <span className="max-w-[60%] truncate text-right text-sm text-[#0F172A]">
                        {employee.user?.email || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-[#64748B]">
                        Department
                      </span>

                      <span className="text-sm font-medium text-[#0F172A]">
                        {employee.department?.name || "-"}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}