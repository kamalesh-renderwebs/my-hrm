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

      // Remove deleted designation from UI
      setDesignations((prev) =>
        prev.filter((designation) => designation.id !== id)
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
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Designations
          </h1>

          <p className="text-gray-500 mt-1">
            Manage employee designations
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          + Add Designation
        </button>

      </div>


      {/* =========================
          ADD DESIGNATION FORM
      ========================= */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">

          <h2 className="text-lg font-semibold text-gray-800">
            Add Designation
          </h2>

          <form
            onSubmit={handleAddDesignation}
            className="mt-4 flex flex-col md:flex-row gap-3"
          >

            <input
              type="text"
              placeholder="Enter designation name"
              value={designationName}
              onChange={(e) =>
                setDesignationName(e.target.value)
              }
              className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
              className="border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-50"
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
        <div className="bg-white p-6 rounded-xl border shadow-sm">

          <h2 className="text-lg font-semibold text-gray-800">
            Edit Designation
          </h2>

          <form
            onSubmit={handleEditDesignation}
            className="mt-4 flex flex-col md:flex-row gap-3"
          >

            <input
              type="text"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
              placeholder="Enter designation name"
              className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />

            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
              className="border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

          </form>

        </div>
      )}


      {/* =========================
          STATISTICS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Designations */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">

          <p className="text-gray-500 text-sm">
            Total Designations
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {designations.length}
          </h2>

        </div>


        {/* Total Employees */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">

          <p className="text-gray-500 text-sm">
            Total Employees
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {totalEmployees}
          </h2>

        </div>


        {/* Active Designations */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">

          <p className="text-gray-500 text-sm">
            Active Designations
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {designations.length}
          </h2>

        </div>

      </div>


      {/* =========================
          SEARCH
      ========================= */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">

        <input
          type="text"
          placeholder="Search designation..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-96 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

      </div>


      {/* =========================
          DESIGNATION TABLE
      ========================= */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-lg font-semibold text-gray-800">
            Designation List
          </h2>

        </div>


        {/* Loading */}
        {loading ? (

          <div className="p-6 text-gray-500">
            Loading designations...
          </div>

        ) : filteredDesignations.length === 0 ? (

          /* No Data */
          <div className="p-6 text-gray-500">
            No designations found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              {/* Table Header */}
              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    ID
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Designation
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Employees
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
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
                      className="border-b hover:bg-gray-50"
                    >

                      {/* ID */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {designation.id}
                      </td>


                      {/* Designation */}
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {designation.name}
                      </td>


                      {/* Employees */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {designation.employeeCount || 0}
                      </td>


                      {/* Status */}
                      <td className="px-6 py-4">

                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
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
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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