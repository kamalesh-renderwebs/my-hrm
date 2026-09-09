"use client";

import { useEffect, useState } from "react";

export default function LeavePage() {
  // ==================================================
  // STATE
  // ==================================================

  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingLeaveId, setUpdatingLeaveId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  // Professional confirmation modal
  const [confirmation, setConfirmation] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // ==================================================
  // SAFE JSON RESPONSE
  // ==================================================

  async function getResponseData(response) {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Invalid JSON response:", text);

      throw new Error(
        `Server returned an invalid response (${response.status})`
      );
    }
  }

  // ==================================================
  // GET CURRENT USER
  // ==================================================

  async function fetchCurrentUser() {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return null;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to get current user"
        );
      }

      const currentUser = data?.user || data;

      if (!currentUser) {
        throw new Error("User information was not returned");
      }

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      console.error("User fetch error:", error);
      setError(error.message);

      return null;
    }
  }

  // ==================================================
  // FETCH LEAVES
  // ==================================================

  async function fetchLeaves() {
    try {
      setLoading(true);

      const response = await fetch("/api/leaves", {
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to fetch leaves"
        );
      }

      setLeaves(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Leave fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    async function loadPage() {
      setError("");

      const currentUser = await fetchCurrentUser();

      if (currentUser) {
        await fetchLeaves();
      } else {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  // ==================================================
  // FORM CHANGE
  // ==================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ==================================================
  // APPLY LEAVE
  // ==================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.leaveType ||
      !form.fromDate ||
      !form.toDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.fromDate > form.toDate) {
      setError("From date cannot be after To date.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to apply leave"
        );
      }

      setMessage(
        data?.message ||
          "Leave applied successfully."
      );

      setForm({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      setShowForm(false);

      await fetchLeaves();
    } catch (error) {
      console.error("Apply leave error:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  // ==================================================
  // OPEN CONFIRMATION MODAL
  // ==================================================

  function openConfirmation(leave, status) {
    setMessage("");
    setError("");

    setConfirmation({
      leave,
      status,
    });
  }

  // ==================================================
  // CLOSE CONFIRMATION MODAL
  // ==================================================

  function closeConfirmation() {
    if (updatingLeaveId !== null) {
      return;
    }

    setConfirmation(null);
  }

  // ==================================================
  // APPROVE / REJECT LEAVE
  // ==================================================

  async function updateLeaveStatus(leaveId, status) {
    const action =
      status === "APPROVED"
        ? "approve"
        : "reject";

    try {
      setMessage("");
      setError("");
      setUpdatingLeaveId(leaveId);

      const response = await fetch(
        `/api/leaves/${leaveId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Failed to ${action} leave request`
        );
      }

      setMessage(
        status === "APPROVED"
          ? "Leave approved successfully."
          : "Leave rejected successfully."
      );

      setConfirmation(null);

      await fetchLeaves();
    } catch (error) {
      console.error(
        "Update leave error:",
        error
      );

      setError(error.message);
    } finally {
      setUpdatingLeaveId(null);
    }
  }

  // ==================================================
  // DATE FORMAT
  // ==================================================

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ==================================================
  // STATUS STYLE
  // ==================================================

  function getStatusStyle(status) {
    if (status === "APPROVED") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  }

  // ==================================================
  // LEAVE TYPE LABEL
  // ==================================================

  function getLeaveTypeLabel(type) {
    const labels = {
      CASUAL: "Casual Leave",
      SICK: "Sick Leave",
      ANNUAL: "Annual Leave",
      PERSONAL: "Personal Leave",
      OTHER: "Other",
    };

    return labels[type] || type || "—";
  }

  // ==================================================
  // ROLE
  // ==================================================

  const role = user?.role;

  // ==================================================
  // STATISTICS
  // ==================================================

  const totalLeaves = leaves.length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  const rejectedLeaves = leaves.filter(
    (leave) => leave.status === "REJECTED"
  ).length;

  // ==================================================
  // PAGE TITLE
  // ==================================================

  function getPageTitle() {
    if (role === "MANAGER") {
      return "Leave Approval";
    }

    if (role === "ADMIN") {
      return "Leave Management";
    }

    return "My Leave";
  }

  // ==================================================
  // PAGE DESCRIPTION
  // ==================================================

  function getPageDescription() {
    if (role === "MANAGER") {
      return "Review and manage leave requests from your team.";
    }

    if (role === "ADMIN") {
      return "View and manage all employee leave requests.";
    }

    return "Apply for leave and track your leave requests.";
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading leave management...
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-bold text-slate-900">
              {getPageTitle()}
            </h1>

            {role && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {role}
              </span>
            )}

          </div>

          <p className="mt-1 text-sm text-slate-500">
            {getPageDescription()}
          </p>

        </div>

        {role === "EMPLOYEE" && (
          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setMessage("");
              setError("");
            }}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            {showForm
              ? "Close Form"
              : "+ Apply Leave"}
          </button>
        )}

      </div>

      {/* ==================================================
          SUCCESS MESSAGE
      ================================================== */}

      {message && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">

          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

          <span>{message}</span>

        </div>
      )}

      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.5M12 16h.01M10.29 3.86l-7.82 13.5A1 1 0 003.34 19h17.32a1 1 0 00.87-1.64l-7.82-13.5a1.98 1.98 0 00-3.42 0z"
            />
          </svg>

          <span>{error}</span>

        </div>
      )}

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatCard
          title="Total"
          value={totalLeaves}
          description={
            role === "EMPLOYEE"
              ? "All your requests"
              : "All leave requests"
          }
        />

        <StatCard
          title="Pending"
          value={pendingLeaves}
          description="Waiting for approval"
        />

        <StatCard
          title="Approved"
          value={approvedLeaves}
          description="Approved leaves"
        />

        <StatCard
          title="Rejected"
          value={rejectedLeaves}
          description="Rejected requests"
        />

      </div>

      {/* ==================================================
          APPLY FORM
      ================================================== */}

      {role === "EMPLOYEE" && showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Apply for Leave
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Submit your leave request for manager approval.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* LEAVE TYPE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Leave Type
              </label>

              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select leave type
                </option>

                <option value="CASUAL">
                  Casual Leave
                </option>

                <option value="SICK">
                  Sick Leave
                </option>

                <option value="ANNUAL">
                  Annual Leave
                </option>

                <option value="PERSONAL">
                  Personal Leave
                </option>

                <option value="OTHER">
                  Other
                </option>

              </select>

            </div>

            {/* DATES */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  From Date
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  To Date
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* REASON */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Reason
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={4}
                placeholder="Enter the reason for your leave..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Leave"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ==================================================
          LEAVE LIST
      ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* CARD HEADER */}

        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">

          <h2 className="text-lg font-semibold text-slate-900">
            {role === "EMPLOYEE"
              ? "Leave History"
              : role === "MANAGER"
              ? "Team Leave Requests"
              : "All Leave Requests"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {role === "EMPLOYEE"
              ? "Your submitted leave requests."
              : role === "MANAGER"
              ? "Review leave requests from employees in your department."
              : "View and manage leave requests across the organization."}
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Loading leave requests...
          </div>
        )}

        {/* EMPTY */}

        {!loading && leaves.length === 0 && (
          <div className="px-6 py-12 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              📅
            </div>

            <h3 className="font-semibold text-slate-900">
              {role === "EMPLOYEE"
                ? "No leave requests"
                : "No leave requests found"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {role === "EMPLOYEE"
                ? "You haven't applied for any leave yet."
                : "There are currently no leave requests to display."}
            </p>

          </div>
        )}

        {/* ==================================================
            DESKTOP TABLE
        ================================================== */}

        {!loading && leaves.length > 0 && (
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full text-left">

              <thead className="bg-slate-50">

                <tr className="border-b border-slate-200">

                  {role !== "EMPLOYEE" && (
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Employee
                    </th>
                  )}

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Leave Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    From
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    To
                  </th>

                  {role !== "EMPLOYEE" && (
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Department
                    </th>
                  )}

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  {(role === "MANAGER" ||
                    role === "ADMIN") && (
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  )}

                </tr>

              </thead>

              <tbody>

                {leaves.map((leave) => (

                  <tr
                    key={leave.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    {/* EMPLOYEE */}

                    {role !== "EMPLOYEE" && (
                      <td className="px-6 py-4">

                        <div>

                          <p className="text-sm font-semibold text-slate-900">
                            {leave.employee?.user?.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {leave.employee?.employeeCode ||
                              "—"}
                          </p>

                        </div>

                      </td>
                    )}

                    {/* LEAVE TYPE */}

                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {getLeaveTypeLabel(
                        leave.leaveType
                      )}
                    </td>

                    {/* FROM */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(leave.fromDate)}
                    </td>

                    {/* TO */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(leave.toDate)}
                    </td>

                    {/* DEPARTMENT */}

                    {role !== "EMPLOYEE" && (
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {leave.employee?.department?.name ||
                          "—"}
                      </td>
                    )}

                    {/* REASON */}

                    <td className="max-w-xs px-6 py-4 text-sm text-slate-600">

                      <span className="block max-w-xs truncate">
                        {leave.reason || "—"}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    {(role === "MANAGER" ||
                      role === "ADMIN") && (

                      <td className="px-6 py-4">

                        {leave.status === "PENDING" ? (

                          <div className="flex gap-2">

                            {/* APPROVE */}

                            <button
                              type="button"
                              disabled={
                                updatingLeaveId ===
                                leave.id
                              }
                              onClick={() =>
                                openConfirmation(
                                  leave,
                                  "APPROVED"
                                )
                              }
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {updatingLeaveId ===
                              leave.id
                                ? "..."
                                : "Approve"}
                            </button>

                            {/* REJECT */}

                            <button
                              type="button"
                              disabled={
                                updatingLeaveId ===
                                leave.id
                              }
                              onClick={() =>
                                openConfirmation(
                                  leave,
                                  "REJECTED"
                                )
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {updatingLeaveId ===
                              leave.id
                                ? "..."
                                : "Reject"}
                            </button>

                          </div>

                        ) : (

                          <span className="text-xs text-slate-400">
                            No action
                          </span>

                        )}

                      </td>

                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

        {/* ==================================================
            MOBILE CARDS
        ================================================== */}

        {!loading && leaves.length > 0 && (
          <div className="divide-y divide-slate-100 md:hidden">

            {leaves.map((leave) => (

              <div
                key={leave.id}
                className="p-5"
              >

                {/* TOP */}

                <div className="mb-4 flex items-start justify-between gap-3">

                  <div>

                    {role !== "EMPLOYEE" && (
                      <>
                        <h3 className="font-semibold text-slate-900">
                          {leave.employee?.user?.name ||
                            "Unknown"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {leave.employee?.employeeCode ||
                            "—"}
                        </p>
                      </>
                    )}

                    {role === "EMPLOYEE" && (
                      <h3 className="font-semibold text-slate-900">
                        {getLeaveTypeLabel(
                          leave.leaveType
                        )}
                      </h3>
                    )}

                    <p className="mt-1 text-xs text-slate-500">
                      Leave Request #{leave.id}
                    </p>

                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      leave.status
                    )}`}
                  >
                    {leave.status}
                  </span>

                </div>

                {/* TYPE */}

                {role !== "EMPLOYEE" && (
                  <div className="mb-4">

                    <p className="text-xs text-slate-500">
                      Leave Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {getLeaveTypeLabel(
                        leave.leaveType
                      )}
                    </p>

                  </div>
                )}

                {/* DATES */}

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs text-slate-500">
                      From
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {formatDate(leave.fromDate)}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-slate-500">
                      To
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {formatDate(leave.toDate)}
                    </p>

                  </div>

                </div>

                {/* DEPARTMENT */}

                {role !== "EMPLOYEE" && (
                  <div className="mt-4">

                    <p className="text-xs text-slate-500">
                      Department
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {leave.employee?.department?.name ||
                        "—"}
                    </p>

                  </div>
                )}

                {/* REASON */}

                <div className="mt-4">

                  <p className="text-xs text-slate-500">
                    Reason
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {leave.reason ||
                      "No reason provided"}
                  </p>

                </div>

                {/* ACTIONS */}

                {(role === "MANAGER" ||
                  role === "ADMIN") &&
                  leave.status === "PENDING" && (

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      {/* APPROVE */}

                      <button
                        type="button"
                        disabled={
                          updatingLeaveId ===
                          leave.id
                        }
                        onClick={() =>
                          openConfirmation(
                            leave,
                            "APPROVED"
                          )
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingLeaveId ===
                        leave.id
                          ? "..."
                          : "Approve"}
                      </button>

                      {/* REJECT */}

                      <button
                        type="button"
                        disabled={
                          updatingLeaveId ===
                          leave.id
                        }
                        onClick={() =>
                          openConfirmation(
                            leave,
                            "REJECTED"
                          )
                        }
                        className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingLeaveId ===
                        leave.id
                          ? "..."
                          : "Reject"}
                      </button>

                    </div>

                  )}

              </div>

            ))}

          </div>
        )}

      </div>

      {/* ==================================================
          PROFESSIONAL CONFIRMATION MODAL
      ================================================== */}

      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeConfirmation();
            }
          }}
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

              <div className="flex items-center gap-3">

                {/* ICON */}

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                    confirmation.status === "APPROVED"
                      ? "bg-emerald-50"
                      : "bg-red-50"
                  }`}
                >

                  {confirmation.status === "APPROVED" ? (
                    <svg
                      className="h-5 w-5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}

                </div>

                {/* TITLE */}

                <div>

                  <h2
                    id="confirmation-title"
                    className="text-base font-semibold text-slate-900"
                  >
                    {confirmation.status === "APPROVED"
                      ? "Approve Leave Request"
                      : "Reject Leave Request"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    Leave Request #{confirmation.leave.id}
                  </p>

                </div>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={
                  updatingLeaveId ===
                  confirmation.leave.id
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Close confirmation"
              >

                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M6 18L18 6"
                  />
                </svg>

              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="px-6 py-6">

              <p className="text-sm leading-6 text-slate-600">

                {confirmation.status === "APPROVED"
                  ? "Are you sure you want to approve this leave request? The employee's request will be marked as approved."
                  : "Are you sure you want to reject this leave request? The employee's request will be marked as rejected."}

              </p>

              {/* EMPLOYEE CARD */}

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  {/* AVATAR */}

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {(
                      confirmation.leave.employee?.user?.name ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* EMPLOYEE */}

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {confirmation.leave.employee?.user?.name ||
                        "Unknown Employee"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {confirmation.leave.employee?.employeeCode ||
                        "—"}
                    </p>

                  </div>

                </div>

                {/* LEAVE DETAILS */}

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-200 pt-4">

                  {/* LEAVE TYPE */}

                  <div>

                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Leave Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {getLeaveTypeLabel(
                        confirmation.leave.leaveType
                      )}
                    </p>

                  </div>

                  {/* DEPARTMENT */}

                  <div>

                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-slate-800">
                      {confirmation.leave.employee?.department?.name ||
                        "—"}
                    </p>

                  </div>

                  {/* FROM */}

                  <div>

                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      From
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDate(
                        confirmation.leave.fromDate
                      )}
                    </p>

                  </div>

                  {/* TO */}

                  <div>

                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      To
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDate(
                        confirmation.leave.toDate
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* REASON */}

              {confirmation.leave.reason && (
                <div className="mt-4">

                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Reason
                  </p>

                  <p className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-5 text-slate-600">
                    {confirmation.leave.reason}
                  </p>

                </div>
              )}

              {/* WARNING */}

              <div
                className={`mt-4 rounded-xl border px-4 py-3 ${
                  confirmation.status === "APPROVED"
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-red-100 bg-red-50"
                }`}
              >

                <div className="flex items-start gap-2.5">

                  {confirmation.status === "APPROVED" ? (
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.5M12 16h.01"
                      />
                    </svg>
                  )}

                  <p
                    className={`text-xs leading-5 ${
                      confirmation.status === "APPROVED"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {confirmation.status === "APPROVED"
                      ? "This action will approve the leave request. Please make sure the dates and leave type are correct."
                      : "This action will reject the leave request. Please make sure you have reviewed the request before continuing."}
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

              {/* CANCEL */}

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={
                  updatingLeaveId ===
                  confirmation.leave.id
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              {/* CONFIRM */}

              <button
                type="button"
                disabled={
                  updatingLeaveId ===
                  confirmation.leave.id
                }
                onClick={() =>
                  updateLeaveStatus(
                    confirmation.leave.id,
                    confirmation.status
                  )
                }
                className={`w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                  confirmation.status === "APPROVED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updatingLeaveId === confirmation.leave.id
                  ? "Processing..."
                  : confirmation.status === "APPROVED"
                  ? "Approve Leave"
                  : "Reject Leave"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// ==================================================
// STAT CARD
// ==================================================

function StatCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}