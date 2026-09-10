"use client";

import { useEffect, useState } from "react";

export default function DesignationsPage() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // ADD DESIGNATION
  // =========================
  const [showAddForm, setShowAddForm] = useState(false);
  const [designationName, setDesignationName] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================
  // EDIT DESIGNATION
  // =========================
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [updating, setUpdating] = useState(false);

  // =========================
  // DELETE DESIGNATION
  // =========================
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // SEARCH
  // =========================
  const [search, setSearch] = useState("");

  // =========================
  // FETCH DESIGNATIONS
  // =========================
  useEffect(() => {
    fetchDesignations();
  }, []);

  async function fetchDesignations() {
    try {
      setLoading(true);

      const response = await fetch("/api/designations");

      if (!response.ok) {
        throw new Error("Failed to fetch designations");
      }

      const data = await response.json();

      setDesignations(data);
    } catch (error) {
      console.error("Fetch designations error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // ADD DESIGNATION
  // =========================
  async function handleAddDesignation(e) {
    e.preventDefault();

    if (!designationName.trim()) {
      alert("Designation name is required");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/designations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: designationName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create designation"
        );
      }

      setDesignations((prev) => [
        ...prev,
        {
          ...data.designation,
          employeeCount: 0,
        },
      ]);

      setDesignationName("");
      setShowAddForm(false);

      alert("Designation created successfully!");
    } catch (error) {
      console.error("Add designation error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // EDIT DESIGNATION
  // =========================
  async function handleEditDesignation(e) {
    e.preventDefault();

    if (!editName.trim()) {
      alert("Designation name is required");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `/api/designations/${editingId}`,
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
          data.error || "Failed to update designation"
        );
      }

      setDesignations((prev) =>
        prev.map((designation) =>
          designation.id === editingId
            ? {
                ...designation,
                name: data.designation.name,
              }
            : designation
        )
      );

      setEditingId(null);
      setEditName("");

      alert("Designation updated successfully!");
    } catch (error) {
      console.error("Edit designation error:", error);
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  }

  // =========================
  // DELETE DESIGNATION
  // =========================
  async function handleDelete(id) {
    const designation = designations.find(
      (item) => item.id === id
    );

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${designation?.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/designations/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete designation"
        );
      }

      setDesignations((prev) =>
        prev.filter(
          (designation) => designation.id !== id
        )
      );

      alert("Designation deleted successfully!");
    } catch (error) {
      console.error("Delete designation error:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  // =========================
  // SEARCH
  // =========================
  const filteredDesignations = designations.filter(
    (designation) =>
      designation.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // =========================
  // TOTAL EMPLOYEES
  // =========================
  const totalEmployees = designations.reduce(
    (total, designation) =>
      total + (designation.employeeCount || 0),
    0
  );

  // =========================
  // UI
  // =========================
  return (
    <main className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Designations
          </h1>

          <p className="mt-1 text-[#64748B] dark:text-[#94A3B8]">
            Manage employee designations
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
          }}
          className="w-full rounded-lg bg-[#2563EB] px-5 py-3 font-medium text-white transition hover:bg-[#1D4ED8] sm:w-auto"
        >
          + Add Designation
        </button>

      </div>

      {/* =========================
          ADD DESIGNATION FORM
      ========================= */}
      {showAddForm && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">

          <h2 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Add Designation
          </h2>

          <form
            onSubmit={handleAddDesignation}
            className="mt-4 flex flex-col gap-3 md:flex-row"
          >

            <input
              type="text"
              placeholder="Enter designation name"
              value={designationName}
              onChange={(e) =>
                setDesignationName(e.target.value)
              }
              className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB] dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B]"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#2563EB] px-5 py-3 font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Designation"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setDesignationName("");
              }}
              className="rounded-lg border border-[#E2E8F0] px-5 py-3 font-medium text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#475569] dark:text-[#CBD5E1] dark:hover:bg-[#0F172A]"
            >
              Cancel
            </button>

          </form>

        </div>
      )}

      {/* =========================
          EDIT DESIGNATION FORM
      ========================= */}
      {editingId !== null && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">

          <h2 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Edit Designation
          </h2>

          <form
            onSubmit={handleEditDesignation}
            className="mt-4 flex flex-col gap-3 md:flex-row"
          >

            <input
              type="text"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
              placeholder="Enter designation name"
              className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB] dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B]"
            />

            <button
              type="submit"
              disabled={updating}
              className="rounded-lg bg-[#2563EB] px-5 py-3 font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
                ? "Updating..."
                : "Update Designation"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setEditName("");
              }}
              className="rounded-lg border border-[#E2E8F0] px-5 py-3 font-medium text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#475569] dark:text-[#CBD5E1] dark:hover:bg-[#0F172A]"
            >
              Cancel
            </button>

          </form>

        </div>
      )}

      {/* =========================
          STATISTICS
      ========================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* Total Designations */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">

          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Total Designations
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            {designations.length}
          </h2>

        </div>

        {/* Total Employees */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">

          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Total Employees
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            {totalEmployees}
          </h2>

        </div>

        {/* Active Designations */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">

          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Active Designations
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#10B981] dark:text-[#34D399]">
            {designations.length}
          </h2>

        </div>

      </div>

      {/* =========================
          SEARCH
      ========================= */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">

        <input
          type="text"
          placeholder="Search designation..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB] md:w-96 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B]"
        />

      </div>

      {/* =========================
          DESIGNATION TABLE
      ========================= */}
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">

        <div className="border-b border-[#E2E8F0] p-6 dark:border-[#334155]">

          <h2 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Designation List
          </h2>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="p-6 text-[#64748B] dark:text-[#94A3B8]">
            Loading designations...
          </div>

        ) : filteredDesignations.length === 0 ? (

          <div className="p-6 text-[#64748B] dark:text-[#94A3B8]">
            No designations found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-left">

              {/* Table Header */}
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#0F172A]">

                <tr>

                  <th className="px-6 py-4 text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
                    ID
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
                    Designation
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
                    Employees
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
                    Action
                  </th>

                </tr>

              </thead>

              {/* Table Body */}
              <tbody>

                {filteredDesignations.map(
                  (designation) => (

                    <tr
                      key={designation.id}
                      className="border-b border-[#E2E8F0] transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:hover:bg-[#0F172A]"
                    >

                      {/* ID */}
                      <td className="px-6 py-4 text-sm text-[#64748B] dark:text-[#94A3B8]">
                        {designation.id}
                      </td>

                      {/* Designation */}
                      <td className="px-6 py-4 font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                        {designation.name}
                      </td>

                      {/* Employees */}
                      <td className="px-6 py-4 text-sm text-[#64748B] dark:text-[#94A3B8]">
                        {designation.employeeCount || 0}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(
                                designation.id
                              );

                              setEditName(
                                designation.name
                              );

                              setShowAddForm(false);
                              setDesignationName("");
                            }}
                            className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                designation.id
                              )
                            }
                            disabled={
                              deletingId ===
                              designation.id
                            }
                            className="text-sm font-medium text-[#EF4444] hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {deletingId === designation.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}