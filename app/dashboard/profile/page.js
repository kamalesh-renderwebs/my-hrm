"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load profile");
        }

        setEmployee(data);
      } catch (error) {
        console.error("Profile error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">
          My Profile
        </h1>

        <p className="mt-4 text-[#64748B]">
          Loading profile...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">
          My Profile
        </h1>

        <p className="mt-4 text-[#EF4444]">
          {error}
        </p>
      </main>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            View your personal and work information
          </p>
        </div>

        {/* Profile Header */}

        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB] text-xl font-bold text-white">
              {employee.user?.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {employee.user?.name}
              </h2>

              <p className="text-sm text-[#64748B]">
                {employee.employeeCode}
              </p>
            </div>

            <div className="sm:ml-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#10B981]">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                Active
              </span>
            </div>

          </div>
        </div>

        {/* Personal Information */}

        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-[#0F172A]">
            Personal Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <ProfileItem
              label="Full Name"
              value={employee.user?.name}
            />

            <ProfileItem
              label="Email"
              value={employee.user?.email}
            />

            <ProfileItem
              label="Phone"
              value={employee.phone}
            />

            <ProfileItem
              label="Date of Birth"
              value={
                employee.dateOfBirth
                  ? new Date(
                      employee.dateOfBirth
                    ).toLocaleDateString()
                  : "-"
              }
            />

          </div>
        </div>

        {/* Work Information */}

        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-[#0F172A]">
            Work Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <ProfileItem
              label="Employee ID"
              value={employee.employeeCode}
            />

            <ProfileItem
              label="Department"
              value={employee.department?.name}
            />

            <ProfileItem
              label="Designation"
              value={employee.designation?.name}
            />

            <ProfileItem
              label="Date of Joining"
              value={
                employee.dateOfJoining
                  ? new Date(
                      employee.dateOfJoining
                    ).toLocaleDateString()
                  : "-"
              }
            />

          </div>
        </div>

      </div>
    </main>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[#0F172A]">
        {value || "-"}
      </p>
    </div>
  );
}