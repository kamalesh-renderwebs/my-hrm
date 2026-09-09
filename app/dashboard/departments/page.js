
"use client";

import { useEffect, useState } from "react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add Department states
  const [showAddForm, setShowAddForm] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit Department states
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Delete Department state
  const [deletingId, setDeletingId] = useState(null);

  // Manager assignment state
  const [assigningManagerId, setAssigningManagerId] = useState(null);

  // Fetch departments
  async function fetchDepartments() {
    try {
      const response = await fetch("/api/departments");

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();

      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Fetch managers
  async function fetchManagers() {
    try {
      const response = await fetch("/api/users/managers");

      if (!response.ok) {
        throw new Error("Failed to fetch managers");
      }

      const data = await response.json();

      setManagers(data);
    } catch (error) {
      console.error("Error fetching managers:", error);
      alert(error.message);
    }
  }

  // Fetch data
  useEffect(() => {
    fetchDepartments();
    fetchManagers();
  }, []);

  // Add Department
  async function handleAddDepartment(e) {
    e.preventDefault();

    if (!departmentName.trim()) {
      alert("Department name is required");
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
        throw new Error(data.error || "Failed to create department");
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

      alert("Department created successfully!");
    } catch (error) {
      console.error("Add department error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  // Start Edit
  async function handleEdit(departmentId) {
    try {
      setEditLoading(true);

      const response = await fetch(`/api/departments/${departmentId}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch department");
      }

      setEditingId(departmentId);
      setEditName(data.name);
    } catch (error) {
      console.error("Edit department error:", error);
      alert(error.message);
    } finally {
      setEditLoading(false);
    }
  }

  // Update Department
  async function handleUpdateDepartment(e) {
    e.preventDefault();

    if (!editName.trim()) {
      alert("Department name is required");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(`/api/departments/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update department");
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

      alert("Department updated successfully!");
    } catch (error) {
      console.error("Update department error:", error);
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  }

  // Cancel Edit
  function handleCancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  // Delete Department
  async function handleDelete(departmentId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(departmentId);

      const response = await fetch(`/api/departments/${departmentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete department");
      }

      setDepartments((prev) =>
        prev.filter((department) => department.id !== departmentId)
      );

      if (editingId === departmentId) {
        setEditingId(null);
        setEditName("");
      }

      alert("Department deleted successfully!");
    } catch (error) {
      console.error("Delete department error:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  // Assign Manager
  async function handleAssignManager(departmentId, managerId) {
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
            managerId: managerId ? Number(managerId) : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign manager");
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

      alert(data.message);
    } catch (error) {
      console.error("Assign manager error:", error);
      alert(error.message);

      // Reload departments if assignment fails
      fetchDepartments();
    } finally {
      setAssigningManagerId(null);
    }
  }

  // Search filter
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(search.toLowerCase())
  );

  // Total employees
  const totalEmployees = departments.reduce(
    (total, department) => total + (department.employeeCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Departments
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage departments and assign department managers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Department
        </button>
      </div>

      {/* Add Department Form */}
      {showAddForm && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Add Department
          </h2>

          <form
            onSubmit={handleAddDepartment}
            className="mt-4 flex flex-col md:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Department"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setDepartmentName("");
              }}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Edit Department Form */}
      {editingId !== null && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Department
          </h2>

          <form
            onSubmit={handleUpdateDepartment}
            className="mt-4 flex flex-col md:flex-row gap-3"
          >
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Department"}
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Departments
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {departments.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Employees
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-2">
            {totalEmployees}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Active Departments
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {departments.length}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border rounded-xl p-5">
        <input
          type="text"
          placeholder="Search department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>

      {/* Department Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Department List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Department ID
                </th>

                <th className="px-6 py-4">
                  Manager
                </th>

                <th className="px-6 py-4">
                  Employees
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading departments...
                  </td>
                </tr>
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No departments found.
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="hover:bg-gray-50"
                  >
                    {/* Department */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          🏢
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {department.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Organization department
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department ID */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      DEPT
                      {String(department.id).padStart(3, "0")}
                    </td>

                    {/* Manager */}
                    <td className="px-6 py-4">
                      <select
                        value={department.managerId || ""}
                        onChange={(e) =>
                          handleAssignManager(
                            department.id,
                            e.target.value
                          )
                        }
                        disabled={
                          assigningManagerId === department.id ||
                          managers.length === 0
                        }
                        className="w-full min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                        <p className="text-xs text-gray-500 mt-1">
                          {department.manager.email}
                        </p>
                      )}
                    </td>

                    {/* Employees */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {department.employeeCount || 0}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleEdit(department.id)}
                          disabled={
                            editLoading ||
                            deletingId === department.id
                          }
                          className="text-blue-600 hover:underline text-sm disabled:opacity-50"
                        >
                          {editLoading &&
                          editingId === department.id
                            ? "Loading..."
                            : "Edit"}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(department.id)
                          }
                          disabled={
                            deletingId === department.id
                          }
                          className="text-red-600 hover:underline text-sm disabled:opacity-50"
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
    </div>
  );
}

