"use client";

import { useEffect, useMemo, useState } from "react";

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");

  // =====================================================
  // FETCH ACTIVITY HISTORY
  // =====================================================

  useEffect(() => {
    fetchActivityHistory();
  }, []);

  async function fetchActivityHistory() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/activity-history",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        setLogs([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch activity history");
      }

      const data = await response.json();

      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Fetch activity history error:",
        error
      );

      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // FILTER LOGS
  // =====================================================

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchText = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        log.description
          ?.toLowerCase()
          .includes(searchText) ||
        log.user?.name
          ?.toLowerCase()
          .includes(searchText) ||
        log.user?.email
          ?.toLowerCase()
          .includes(searchText) ||
        log.action
          ?.toLowerCase()
          .includes(searchText) ||
        log.module
          ?.toLowerCase()
          .includes(searchText);

      const matchesAction =
        actionFilter === "ALL" ||
        log.action === actionFilter;

      const matchesModule =
        moduleFilter === "ALL" ||
        log.module === moduleFilter;

      return (
        matchesSearch &&
        matchesAction &&
        matchesModule
      );
    });
  }, [
    logs,
    search,
    actionFilter,
    moduleFilter,
  ]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  // =====================================================
  // FORMAT TIME
  // =====================================================

  function formatTime(date) {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // =====================================================
  // ACTION BADGE
  // =====================================================

  function getActionStyle(action) {
    switch (action) {
      case "CREATE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "UPDATE":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "DELETE":
        return "bg-red-50 text-red-700 border-red-200";

      case "APPROVE":
        return "bg-green-50 text-green-700 border-green-200";

      case "REJECT":
        return "bg-orange-50 text-orange-700 border-orange-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  // =====================================================
  // MODULE BADGE
  // =====================================================

  function getModuleStyle(module) {
    switch (module) {
      case "EMPLOYEE":
        return "bg-blue-50 text-blue-700";

      case "DEPARTMENT":
        return "bg-purple-50 text-purple-700";

      case "DESIGNATION":
        return "bg-indigo-50 text-indigo-700";

      case "ATTENDANCE":
        return "bg-amber-50 text-amber-700";

      case "LEAVE":
        return "bg-cyan-50 text-cyan-700";

      case "AUTH":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-slate-50 text-slate-700";
    }
  }

  // =====================================================
  // STATS
  // =====================================================

  const totalActivities = logs.length;

  const createCount = logs.filter(
    (log) => log.action === "CREATE"
  ).length;

  const updateCount = logs.filter(
    (log) => log.action === "UPDATE"
  ).length;

  const approvalCount = logs.filter(
    (log) =>
      log.action === "APPROVE" ||
      log.action === "REJECT"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Activity History
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Track important activities performed in your HRMS.
          </p>
        </div>

        <button
          onClick={fetchActivityHistory}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] shadow-sm transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>

          Refresh
        </button>

      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">
            Total Activities
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0F172A]">
            {totalActivities}
          </p>
        </div>

        {/* Create */}

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">
            Created
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {createCount}
          </p>
        </div>

        {/* Update */}

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">
            Updated
          </p>

          <p className="mt-2 text-2xl font-bold text-[#2563EB]">
            {updateCount}
          </p>
        </div>

        {/* Approval */}

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">
            Approvals
          </p>

          <p className="mt-2 text-2xl font-bold text-[#8B5CF6]">
            {approvalCount}
          </p>
        </div>

      </div>

      {/* =================================================
          FILTER SECTION
      ================================================= */}

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">

        <div className="grid gap-4 md:grid-cols-4">

          {/* Search */}

          <div className="md:col-span-2">

            <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
              Search
            </label>

            <div className="relative">

              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search activity, user, module..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* Action */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
              Action
            </label>

            <select
              value={actionFilter}
              onChange={(e) =>
                setActionFilter(e.target.value)
              }
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">
                All Actions
              </option>

              <option value="CREATE">
                Create
              </option>

              <option value="UPDATE">
                Update
              </option>

              <option value="DELETE">
                Delete
              </option>

              <option value="APPROVE">
                Approve
              </option>

              <option value="REJECT">
                Reject
              </option>
            </select>

          </div>

          {/* Module */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
              Module
            </label>

            <select
              value={moduleFilter}
              onChange={(e) =>
                setModuleFilter(e.target.value)
              }
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">
                All Modules
              </option>

              <option value="EMPLOYEE">
                Employee
              </option>

              <option value="DEPARTMENT">
                Department
              </option>

              <option value="DESIGNATION">
                Designation
              </option>

              <option value="ATTENDANCE">
                Attendance
              </option>

              <option value="LEAVE">
                Leave
              </option>

              <option value="AUTH">
                Authentication
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      <div className="hidden overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm md:block">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Action
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Module
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Description
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Performed By
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Date & Time
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">

              {loading ? (

                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-[#64748B]"
                  >
                    Loading activity history...
                  </td>
                </tr>

              ) : filteredLogs.length === 0 ? (

                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center"
                  >

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFC]">

                      <svg
                        className="h-6 w-6 text-[#94A3B8]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
                        />
                      </svg>

                    </div>

                    <p className="mt-3 text-sm font-medium text-[#0F172A]">
                      No activities found
                    </p>

                    <p className="mt-1 text-sm text-[#64748B]">
                      Try changing your search or filters.
                    </p>

                  </td>
                </tr>

              ) : (

                filteredLogs.map((log) => (

                  <tr
                    key={log.id}
                    className="transition hover:bg-[#F8FAFC]"
                  >

                    {/* Action */}

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getActionStyle(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>

                    </td>

                    {/* Module */}

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getModuleStyle(
                          log.module
                        )}`}
                      >
                        {log.module}
                      </span>

                    </td>

                    {/* Description */}

                    <td className="max-w-[320px] px-5 py-4">

                      <p className="truncate text-sm font-medium text-[#0F172A]">
                        {log.description}
                      </p>

                    </td>

                    {/* User */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-sm font-semibold text-[#2563EB]">
                          {log.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-[#0F172A]">
                            {log.user?.name || "Unknown"}
                          </p>

                          <p className="truncate text-xs text-[#64748B]">
                            {log.user?.email || "—"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Date */}

                    <td className="whitespace-nowrap px-5 py-4">

                      <p className="text-sm font-medium text-[#0F172A]">
                        {formatDate(log.createdAt)}
                      </p>

                      <p className="text-xs text-[#64748B]">
                        {formatTime(log.createdAt)}
                      </p>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          MOBILE CARDS
      ================================================= */}

      <div className="space-y-3 md:hidden">

        {loading ? (

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center text-sm text-[#64748B] shadow-sm">
            Loading activity history...
          </div>

        ) : filteredLogs.length === 0 ? (

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">

            <p className="text-sm font-medium text-[#0F172A]">
              No activities found
            </p>

            <p className="mt-1 text-sm text-[#64748B]">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          filteredLogs.map((log) => (

            <div
              key={log.id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
            >

              {/* Top */}

              <div className="flex items-start justify-between gap-3">

                <div className="flex flex-wrap gap-2">

                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getActionStyle(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getModuleStyle(
                      log.module
                    )}`}
                  >
                    {log.module}
                  </span>

                </div>

                <span className="text-xs text-[#94A3B8]">
                  #{log.id}
                </span>

              </div>

              {/* Description */}

              <p className="mt-3 text-sm font-medium leading-6 text-[#0F172A]">
                {log.description}
              </p>

              {/* User */}

              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-sm font-semibold text-[#2563EB]">
                  {log.user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-medium text-[#0F172A]">
                    {log.user?.name || "Unknown"}
                  </p>

                  <p className="truncate text-xs text-[#64748B]">
                    {log.user?.email || "—"}
                  </p>

                </div>

              </div>

              {/* Date */}

              <div className="mt-4 border-t border-[#E2E8F0] pt-3">

                <p className="text-xs text-[#64748B]">
                  {formatDate(log.createdAt)} at{" "}
                  {formatTime(log.createdAt)}
                </p>

              </div>

            </div>

          ))

        )}

      </div>

      {/* =================================================
          RESULT COUNT
      ================================================= */}

      {!loading && (
        <div className="text-sm text-[#64748B]">
          Showing{" "}
          <span className="font-medium text-[#0F172A]">
            {filteredLogs.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#0F172A]">
            {logs.length}
          </span>{" "}
          activities
        </div>
      )}

    </div>
  );
}