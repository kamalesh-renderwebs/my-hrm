"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesktopSidebar({ role, email, logout }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (href) => {
    return `mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
      isActive(href)
        ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;
  };

  const iconClass = (href) => {
    return `flex h-8 w-8 items-center justify-center rounded-lg ${
      isActive(href)
        ? "bg-white/15 text-white"
        : "bg-white/5"
    }`;
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-[#0F172A] text-white lg:flex lg:flex-col">

      {/* LOGO */}

      <div className="flex h-20 items-center border-b border-white/10 px-6">

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >

          <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
  <img
    src="/logo.png.webp"
    alt="HRMS Logo"
    className="h-full w-full object-contain p-1"
  />
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


      {/* MENU */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        {/* OVERVIEW */}

        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
          OVERVIEW
        </p>

        <Link
          href="/dashboard"
          className={linkClass("/dashboard")}
        >
          <span className={iconClass("/dashboard")}>
            ▦
          </span>

          Dashboard
        </Link>


        {/* ADMIN */}

        {role === "ADMIN" && (
          <>

            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              PEOPLE
            </p>

            <Link
              href="/dashboard/employees"
              className={linkClass("/dashboard/employees")}
            >
              <span className={iconClass("/dashboard/employees")}>
                ♙
              </span>
              Employees
            </Link>

            <Link
              href="/dashboard/departments"
              className={linkClass("/dashboard/departments")}
            >
              <span className={iconClass("/dashboard/departments")}>
                ▤
              </span>
              Departments
            </Link>

            <Link
              href="/dashboard/designations"
              className={linkClass("/dashboard/designations")}
            >
              <span className={iconClass("/dashboard/designations")}>
                ◈
              </span>
              Designations
            </Link>


            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              WORKFORCE
            </p>

            <Link
              href="/dashboard/attendance"
              className={linkClass("/dashboard/attendance")}
            >
              <span className={iconClass("/dashboard/attendance")}>
                ◷
              </span>
              Attendance
            </Link>

            <Link
              href="/dashboard/leave"
              className={linkClass("/dashboard/leave")}
            >
              <span className={iconClass("/dashboard/leave")}>
                ▱
              </span>
              Leave
            </Link>
            <Link
              href="/dashboard/history"
              className={linkClass("/dashboard/history")}
            >
              <span className={iconClass("/dashboard/history")}>
                📥
              </span>
              Activity record
            </Link>

          </>
        )}


        {/* MANAGER */}

        {role === "MANAGER" && (
          <>

            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              TEAM
            </p>

            <Link
              href="/dashboard/team"
              className={linkClass("/dashboard/team")}
            >
              <span className={iconClass("/dashboard/team")}>
                ♙
              </span>
              My Team
            </Link>

            <Link
              href="/dashboard/attendance"
              className={linkClass("/dashboard/attendance")}
            >
              <span className={iconClass("/dashboard/attendance")}>
                ◷
              </span>
              Attendance
            </Link>

            <Link
              href="/dashboard/leave"
              className={linkClass("/dashboard/leave")}
            >
              <span className={iconClass("/dashboard/leave")}>
                ▱
              </span>
              Leave Approval
            </Link>

          </>
        )}


        {/* EMPLOYEE */}

        {role === "EMPLOYEE" && (
          <>

            <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              MY HR
            </p>

            <Link
              href="/dashboard/profile"
              className={linkClass("/dashboard/profile")}
            >
              <span className={iconClass("/dashboard/profile")}>
                ♙
              </span>
              My Profile
            </Link>

            <Link
              href="/dashboard/attendance"
              className={linkClass("/dashboard/attendance")}
            >
              <span className={iconClass("/dashboard/attendance")}>
                ◷
              </span>
              My Attendance
            </Link>

            <Link
              href="/dashboard/leave"
              className={linkClass("/dashboard/leave")}
            >
              <span className={iconClass("/dashboard/leave")}>
                ▱
              </span>
              My Leave
            </Link>

          </>
        )}

      </nav>


      {/* USER */}

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


        {/* LOGOUT */}

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