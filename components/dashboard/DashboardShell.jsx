"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesktopSidebar({ role, email, logout }) {
  const pathname = usePathname();

  const isActive = (href) => {
    // Dashboard should only be active on /dashboard
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    // Other pages can also have nested routes
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getLinkClass = (href) => {
    const active = isActive(href);

    return `
      mb-1 flex items-center gap-3 rounded-xl px-3 py-3
      text-sm font-medium transition
      ${
        active
          ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }
    `;
  };

  const getIconClass = (href) => {
    const active = isActive(href);

    return `
      flex h-8 w-8 items-center justify-center rounded-lg
      ${
        active
          ? "bg-white/15 text-white"
          : "bg-white/5 text-slate-400"
      }
    `;
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-[#0F172A] text-white lg:flex lg:flex-col">

      {/* ================= LOGO ================= */}

      <div className="flex h-20 items-center border-b border-white/10 px-6">

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-lg font-bold">
            H
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              HRMS
            </h1>

            <p className="text-[11px] text-slate-400">
              People Management
            </p>
          </div>

        </Link>

      </div>


      {/* ================= MENU ================= */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        {/* ================= OVERVIEW ================= */}

        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
          OVERVIEW
        </p>

        <Link
          href="/dashboard"
          className={getLinkClass("/dashboard")}
        >
          <span className={getIconClass("/dashboard")}>
            ▦
          </span>

          Dashboard
        </Link>


        {/* ================= ADMIN ================= */}

        {role === "ADMIN" && (
          <>

            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              PEOPLE
            </p>

            <Link
              href="/dashboard/employees"
              className={getLinkClass("/dashboard/employees")}
            >
              <span className={getIconClass("/dashboard/employees")}>
                ♙
              </span>

              Employees
            </Link>


            <Link
              href="/dashboard/departments"
              className={getLinkClass("/dashboard/departments")}
            >
              <span className={getIconClass("/dashboard/departments")}>
                ▤
              </span>

              Departments
            </Link>


            <Link
              href="/dashboard/designations"
              className={getLinkClass("/dashboard/designations")}
            >
              <span className={getIconClass("/dashboard/designations")}>
                ◈
              </span>

              Designations
            </Link>


            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              WORKFORCE
            </p>


            <Link
              href="/dashboard/attendance"
              className={getLinkClass("/dashboard/attendance")}
            >
              <span className={getIconClass("/dashboard/attendance")}>
                ◷
              </span>

              Attendance
            </Link>


            <Link
              href="/dashboard/leave"
              className={getLinkClass("/dashboard/leave")}
            >
              <span className={getIconClass("/dashboard/leave")}>
                ▱
              </span>

              Leave
            </Link>


            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              SYSTEM
            </p>


            <Link
              href="/dashboard/reports"
              className={getLinkClass("/dashboard/reports")}
            >
              <span className={getIconClass("/dashboard/reports")}>
                ▥
              </span>

              Reports
            </Link>


            <Link
              href="/dashboard/settings"
              className={getLinkClass("/dashboard/settings")}
            >
              <span className={getIconClass("/dashboard/settings")}>
                ⚙
              </span>

              Settings
            </Link>

          </>
        )}


        {/* ================= MANAGER ================= */}

        {role === "MANAGER" && (
          <>

            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              TEAM
            </p>


            <Link
              href="/dashboard/team"
              className={getLinkClass("/dashboard/team")}
            >
              <span className={getIconClass("/dashboard/team")}>
                ♙
              </span>

              My Team
            </Link>


            <Link
              href="/dashboard/attendance"
              className={getLinkClass("/dashboard/attendance")}
            >
              <span className={getIconClass("/dashboard/attendance")}>
                ◷
              </span>

              Attendance
            </Link>


            <Link
              href="/dashboard/leave"
              className={getLinkClass("/dashboard/leave")}
            >
              <span className={getIconClass("/dashboard/leave")}>
                ▱
              </span>

              Leave Approval
            </Link>

          </>
        )}


        {/* ================= EMPLOYEE ================= */}

        {role === "EMPLOYEE" && (
          <>

            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              MY HR
            </p>


            <Link
              href="/dashboard/profile"
              className={getLinkClass("/dashboard/profile")}
            >
              <span className={getIconClass("/dashboard/profile")}>
                ♙
              </span>

              My Profile
            </Link>


            <Link
              href="/dashboard/attendance"
              className={getLinkClass("/dashboard/attendance")}
            >
              <span className={getIconClass("/dashboard/attendance")}>
                ◷
              </span>

              My Attendance
            </Link>


            <Link
              href="/dashboard/leave"
              className={getLinkClass("/dashboard/leave")}
            >
              <span className={getIconClass("/dashboard/leave")}>
                ▱
              </span>

              My Leave
            </Link>

          </>
        )}

      </nav>


      {/* ================= USER + LOGOUT ================= */}

      <div className="border-t border-white/10 p-1">

        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold">
            {email?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold">
              {email}
            </p>

            <p className="text-xs text-slate-400">
              {role}
            </p>

          </div>

        </div>


        <form action={logout}>

          <button
            type="submit"
            className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="mr-3">
              ↪
            </span>

            Logout
          </button>

        </form>

      </div>

    </aside>
  );
}