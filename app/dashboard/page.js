import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    user = payload;
  } catch (error) {
    console.error("Dashboard JWT error:", error);
    redirect("/login");
  }

  // Get dashboard statistics
  let stats;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/dashboard/stats`,
      {
        headers: {
          Cookie: `auth_token=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard statistics");
    }

    const data = await response.json();

    stats = data.stats;
  } catch (error) {
    console.error("Dashboard stats error:", error);

    stats = {
      totalEmployees: 0,
      presentToday: 0,
      onLeave: 0,
      absentToday: 0,
      pendingLeaves: 0,
    };
  }

  // --------------------------------------------------
  // ADMIN DASHBOARD
  // --------------------------------------------------

  if (user.role === "ADMIN") {
    return (
      <main className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Welcome, {user.name}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          {/* Total Employees */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Total Employees
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {stats.totalEmployees}
            </h2>
          </div>

          {/* Present Today */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Present Today
            </p>

            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {stats.presentToday}
            </h2>
          </div>

          {/* On Leave */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              On Leave
            </p>

            <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {stats.onLeave}
            </h2>
          </div>

          {/* Absent */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Absent
            </p>

            <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2">
              {stats.absentToday}
            </h2>
          </div>

        </div>

        {/* Attendance Overview */}
        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors">

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Attendance Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Today's attendance summary
          </p>

          <div className="mt-6 space-y-5">

            {/* Present */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Present
                </span>

                <span className="text-sm font-semibold text-[#10B981] dark:text-emerald-400">
                  {stats.presentToday}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                <div
                  className="h-full rounded-full bg-[#10B981]"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.presentToday /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>
            </div>

            {/* Absent */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Absent
                </span>

                <span className="text-sm font-semibold text-[#EF4444] dark:text-rose-400">
                  {stats.absentToday}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                <div
                  className="h-full rounded-full bg-[#EF4444]"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.absentToday /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>
            </div>

            {/* On Leave */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  On Leave
                </span>

                <span className="text-sm font-semibold text-[#F59E0B] dark:text-amber-400">
                  {stats.onLeave}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                <div
                  className="h-full rounded-full bg-[#F59E0B]"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.onLeave /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>
            </div>

          </div>

        </div>

      </main>
    );
  }

  // --------------------------------------------------
  // MANAGER DASHBOARD
  // --------------------------------------------------

  if (user.role === "MANAGER") {
    return (
      <main className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Manager Dashboard
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Welcome, {user.name}
          </p>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your team and monitor their activities
          </p>
        </div>

        {/* Manager Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          {/* My Team */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              My Team
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {stats.totalEmployees}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Total team members
            </p>

          </div>

          {/* Present Today */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Present Today
            </p>

            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {stats.presentToday}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Team members present
            </p>

          </div>

          {/* On Leave */}
          <div className="bg-[#FFFBEB] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              On Leave
            </p>

            <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {stats.onLeave}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Team members on leave
            </p>

          </div>

          {/* Pending Leaves */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Pending Leaves
            </p>

            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {stats.pendingLeaves}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Requests awaiting approval
            </p>

          </div>

        </div>

        {/* Team Attendance Overview */}
        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors">

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Team Attendance Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Today's team attendance summary
          </p>

          <div className="mt-6 space-y-5">

            {/* Present */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Present
                </span>

                <span className="text-sm font-semibold text-[#10B981] dark:text-emerald-400">
                  {stats.presentToday}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                <div
                  className="h-full rounded-full bg-[#10B981]"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.presentToday /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

            {/* Absent */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Absent
                </span>

                <span className="text-sm font-semibold text-[#EF4444] dark:text-rose-400">
                  {stats.absentToday}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                <div
                  className="h-full rounded-full bg-[#EF4444]"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.absentToday /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

            {/* On Leave */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  On Leave
                </span>

                <span className="text-sm font-semibold text-[#F59E0B] dark:text-amber-400">
                  {stats.onLeave}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                <div
                  className="h-full rounded-full bg-[#F59E0B]"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.onLeave /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </main>
    );
  }

  // --------------------------------------------------
  // EMPLOYEE DASHBOARD
  // --------------------------------------------------

  return (
    <main className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Employee Dashboard
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Welcome, {user.name}
        </p>
      </div>

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

        {/* Attendance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

          <p className="text-slate-500 dark:text-slate-400 font-medium">
            My Attendance
          </p>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.presentToday}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Present today
          </p>

        </div>

        {/* On Leave */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

          <p className="text-slate-500 dark:text-slate-400 font-medium">
            On Leave
          </p>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.onLeave}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Today's leave status
          </p>

        </div>

        {/* Pending Leaves */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Pending Leaves
          </p>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.pendingLeaves}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Awaiting approval
          </p>

        </div>

        {/* Attendance Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs transition-colors">

          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Attendance Status
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.presentToday > 0
              ? "Present"
              : stats.onLeave > 0
              ? "On Leave"
              : "Not Marked"}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Today's status
          </p>

        </div>

      </div>

      {/* My Attendance Overview */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors">

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          My Attendance
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Today's attendance summary
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Present */}
          <div className="rounded-xl bg-[#F0FDF4] dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 p-4">

            <p className="text-sm text-slate-600 dark:text-emerald-300 font-medium">
              Present Today
            </p>

            <p className="mt-2 text-2xl font-bold text-[#10B981] dark:text-emerald-400">
              {stats.presentToday}
            </p>

          </div>

          {/* On Leave */}
          <div className="rounded-xl bg-[#FFFBEB] dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 p-4">

            <p className="text-sm text-slate-600 dark:text-amber-300 font-medium">
              On Leave
            </p>

            <p className="mt-2 text-2xl font-bold text-[#F59E0B] dark:text-amber-400">
              {stats.onLeave}
            </p>

          </div>

          {/* Status */}
          <div className="rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 p-4">

            <p className="text-sm text-slate-600 dark:text-blue-300 font-medium">
              Status
            </p>

            <p className="mt-2 text-lg font-bold text-[#2563EB] dark:text-blue-400">
              {stats.presentToday > 0
                ? "Present"
                : stats.onLeave > 0
                ? "On Leave"
                : "Not Marked"}
            </p>

          </div>

        </div>

        <div className="mt-6">

          <a
            href="/dashboard/attendance"
            className="inline-flex rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
          >
            View My Attendance
          </a>

        </div>

      </div>

    </main>
  );
}