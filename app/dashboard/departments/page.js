"use client";

import { useEffect, useMemo, useState } from "react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add
  const [showAddForm, setShowAddForm] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState(null);

  // Manager
  const [assigningManagerId, setAssigningManagerId] = useState(null);

  // Notification
  const [notification, setNotification] = useState(null);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    departmentId: null,
    departmentName: "",
  });

  function showNotification(type, message) {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }

  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================

  async function fetchDepartments() {
    try {
      setLoading(true);

      const response = await fetch("/api/departments", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch departments"
        );
      }

      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);

      showNotification(
        "error",
        error.message || "Failed to fetch departments"
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // FETCH MANAGERS
  // =====================================================

  async function fetchManagers() {
    try {
      const response = await fetch("/api/users/managers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch managers"
        );
      }

      setManagers(data);
    } catch (error) {
      console.error("Error fetching managers:", error);

      showNotification(
        "error",
        error.message || "Failed to fetch managers"
      );
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDepartments();
    fetchManagers();
  }, []);

  // =====================================================
  // ADD DEPARTMENT
  // =====================================================

  async function handleAddDepartment(e) {
    e.preventDefault();

    if (!departmentName.trim()) {
      showNotification(
        "error",
        "Department name is required"
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: departmentName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create department"
        );
      }

      setDepartments((prev) => [
        ...prev,
        {
          ...data.department,
          employeeCount: 0,
          manager: null,
        },
      ]);

      setDepartmentName("");
      setShowAddForm(false);

      showNotification(
        "success",
        "Department created successfully"
      );
    } catch (error) {
      console.error("Add department error:", error);

      showNotification(
        "error",
        error.message || "Failed to create department"
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // EDIT DEPARTMENT
  // =====================================================

  async function handleEdit(departmentId) {
    try {
      setEditLoading(true);

      const response = await fetch(
        `/api/departments/${departmentId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch department"
        );
      }

      setEditingId(departmentId);
      setEditName(data.name);

      setShowAddForm(false);
    } catch (error) {
      console.error("Edit department error:", error);

      showNotification(
        "error",
        error.message || "Failed to load department"
      );
    } finally {
      setEditLoading(false);
    }
  }

  // =====================================================
  // UPDATE DEPARTMENT
  // =====================================================

  async function handleUpdateDepartment(e) {
    e.preventDefault();

    if (!editName.trim()) {
      showNotification(
        "error",
        "Department name is required"
      );
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `/api/departments/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update department"
        );
      }

      setDepartments((prev) =>
        prev.map((department) =>
          department.id === editingId
            ? {
                ...department,
                name: data.department.name,
              }
            : department
        )
      );

      setEditingId(null);
      setEditName("");

      showNotification(
        "success",
        "Department updated successfully"
      );
    } catch (error) {
      console.error("Update department error:", error);

      showNotification(
        "error",
        error.message || "Failed to update department"
      );
    } finally {
      setUpdating(false);
    }
  }

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  function handleCancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  // =====================================================
  // DELETE MODAL
  // =====================================================

  function openDeleteModal(department) {
    setDeleteModal({
      open: true,
      departmentId: department.id,
      departmentName: department.name,
    });
  }

  function closeDeleteModal() {
    setDeleteModal({
      open: false,
      departmentId: null,
      departmentName: "",
    });
  }

  // =====================================================
  // DELETE DEPARTMENT
  // =====================================================

  async function handleDelete() {
    const departmentId = deleteModal.departmentId;

    if (!departmentId) return;

    try {
      setDeletingId(departmentId);

      const response = await fetch(
        `/api/departments/${departmentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete department"
        );
      }

      setDepartments((prev) =>
        prev.filter(
          (department) => department.id !== departmentId
        )
      );

      if (editingId === departmentId) {
        setEditingId(null);
        setEditName("");
      }

      closeDeleteModal();

      showNotification(
        "success",
        "Department deleted successfully"
      );
    } catch (error) {
      console.error("Delete department error:", error);

      showNotification(
        "error",
        error.message || "Failed to delete department"
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // ASSIGN MANAGER
  // =====================================================

  async function handleAssignManager(
    departmentId,
    managerId
  ) {
    try {
      setAssigningManagerId(departmentId);

      const response = await fetch(
        `/api/departments/${departmentId}/manager`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            managerId: managerId
              ? Number(managerId)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to assign manager"
        );
      }

      setDepartments((prev) =>
        prev.map((department) =>
          department.id === departmentId
            ? {
                ...department,
                managerId: data.department.managerId,
                manager: data.department.manager,
              }
            : department
        )
      );

      showNotification(
        "success",
        data.message || "Manager updated successfully"
      );
    } catch (error) {
      console.error("Assign manager error:", error);

      showNotification(
        "error",
        error.message || "Failed to assign manager"
      );

      fetchDepartments();
    } finally {
      setAssigningManagerId(null);
    }
  }

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) =>
      department.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [departments, search]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalEmployees = departments.reduce(
    (total, department) =>
      total + (department.employeeCount || 0),
    0
  );

  const activeDepartments = departments.length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-700 rounded mt-3 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded mt-4" />
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 animate-pulse">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-12 w-full bg-slate-100 dark:bg-slate-700 rounded-xl mt-5" />
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-16 bg-slate-100 dark:bg-slate-700" />
          <div className="h-16 border-t border-slate-200 dark:border-slate-700" />
          <div className="h-16 border-t border-slate-200 dark:border-slate-700" />
          <div className="h-16 border-t border-slate-200 dark:border-slate-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">

      {/* =====================================================
          NOTIFICATION
      ===================================================== */}

      {notification && (
        <div className="fixed top-5 right-5 z-[100] w-[calc(100%-40px)] sm:w-auto sm:min-w-[320px]">
          <div
            className={`rounded-xl border px-4 py-3 shadow-lg flex items-start gap-3 ${
              notification.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                notification.type === "success"
                  ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300"
                  : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
              }`}
            >
              {notification.type === "success"
                ? "✓"
                : "!"}
            </div>

            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  notification.type === "success"
                    ? "text-emerald-800 dark:text-emerald-300"
                    : "text-red-800 dark:text-red-300"
                }`}
              >
                {notification.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-xl">
              🏢
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Departments
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage departments and assign department
                managers.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
          }}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
        >
          <span className="text-lg leading-none">+</span>
          Add Department
        </button>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Total Departments */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Departments
              </p>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {departments.length}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-xl">
              🏢
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Organization departments
          </p>
        </div>

        {/* Total Employees */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Employees
              </p>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {totalEmployees}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-xl">
              👥
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Employees across departments
          </p>
        </div>

        {/* Active Departments */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Active Departments
              </p>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {activeDepartments}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-xl">
              ✓
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Currently active
          </p>
        </div>
      </div>

      {/* =====================================================
          ADD DEPARTMENT
      ===================================================== */}

      {showAddForm && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Add Department
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Create a new organization department.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setDepartmentName("");
              }}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 text-xl"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleAddDepartment}
            className="p-5 sm:p-6"
          >
            <div className="max-w-xl">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Department Name
              </label>

              <input
                type="text"
                placeholder="e.g. Development"
                value={departmentName}
                onChange={(e) =>
                  setDepartmentName(e.target.value)
                }
                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/40 transition"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setDepartmentName("");
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving
                  ? "Saving..."
                  : "Save Department"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          EDIT DEPARTMENT
      ===================================================== */}

      {editingId !== null && (
        <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Edit Department
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Update the department information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 text-xl"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleUpdateDepartment}
            className="p-5 sm:p-6"
          >
            <div className="max-w-xl">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Department Name
              </label>

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/40 transition"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-5">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {updating
                  ? "Updating..."
                  : "Update Department"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Department Directory
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search and manage your organization departments.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/40 transition"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden lg:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Department List
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {filteredDepartments.length} department
              {filteredDepartments.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Department
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Department ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Manager
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Employees
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-14 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
                        🏢
                      </div>

                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-4">
                        No departments found
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Try changing your search or add a
                        new department.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
                  >
                    {/* Department */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-lg shrink-0">
                          🏢
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {department.name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Organization department
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department ID */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-medium">
                        DEPT-
                        {String(department.id).padStart(
                          3,
                          "0"
                        )}
                      </span>
                    </td>

                    {/* Manager */}
                    <td className="px-6 py-4">
                      <div className="min-w-[190px]">
                        <select
                          value={
                            department.managerId || ""
                          }
                          onChange={(e) =>
                            handleAssignManager(
                              department.id,
                              e.target.value
                            )
                          }
                          disabled={
                            assigningManagerId ===
                              department.id ||
                            managers.length === 0
                          }
                          className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/40 disabled:opacity-50 transition"
                        >
                          <option value="">
                            {assigningManagerId ===
                            department.id
                              ? "Updating..."
                              : "No Manager"}
                          </option>

                          {managers.map((manager) => (
                            <option
                              key={manager.id}
                              value={manager.id}
                            >
                              {manager.name}
                            </option>
                          ))}
                        </select>

                        {department.manager && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 truncate max-w-[200px]">
                            {department.manager.email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Employees */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {department.employeeCount || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(department.id)
                          }
                          disabled={
                            editLoading ||
                            deletingId === department.id
                          }
                          className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 disabled:opacity-50 transition"
                        >
                          {editLoading &&
                          editingId === department.id
                            ? "Loading..."
                            : "Edit"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openDeleteModal(department)
                          }
                          disabled={
                            deletingId === department.id
                          }
                          className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-50 transition"
                        >
                          {deletingId === department.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          MOBILE CARDS
      ===================================================== */}

      <div className="lg:hidden space-y-4">

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Department List
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filteredDepartments.length} department
            {filteredDepartments.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        </div>

        {filteredDepartments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl mx-auto">
              🏢
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-4">
              No departments found
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Try changing your search or add a new
              department.
            </p>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <div
              key={department.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-xl shrink-0">
                    🏢
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {department.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      DEPT-
                      {String(department.id).padStart(
                        3,
                        "0"
                      )}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              {/* Details */}
              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 space-y-4">

                {/* Manager */}
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Manager
                  </p>

                  <select
                    value={department.managerId || ""}
                    onChange={(e) =>
                      handleAssignManager(
                        department.id,
                        e.target.value
                      )
                    }
                    disabled={
                      assigningManagerId ===
                        department.id ||
                      managers.length === 0
                    }
                    className="w-full mt-2 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/40 disabled:opacity-50 transition"
                  >
                    <option value="">
                      {assigningManagerId === department.id
                        ? "Updating..."
                        : "No Manager"}
                    </option>

                    {managers.map((manager) => (
                      <option
                        key={manager.id}
                        value={manager.id}
                      >
                        {manager.name}
                      </option>
                    ))}
                  </select>

                  {department.manager && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                      {department.manager.email}
                    </p>
                  )}
                </div>

                {/* Employee Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Employees
                  </span>

                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {department.employeeCount || 0}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(department.id)
                  }
                  disabled={
                    editLoading ||
                    deletingId === department.id
                  }
                  className="px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-950/50 disabled:opacity-50 transition"
                >
                  {editLoading &&
                  editingId === department.id
                    ? "Loading..."
                    : "Edit"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openDeleteModal(department)
                  }
                  disabled={
                    deletingId === department.id
                  }
                  className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-50 transition"
                >
                  {deletingId === department.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteModal.open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">

              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-xl mb-4">
                🗑️
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Delete Department?
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {deleteModal.departmentName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deletingId !== null}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deletingId !== null}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {deletingId !== null
                    ? "Deleting..."
                    : "Delete Department"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}