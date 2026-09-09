import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { logout } from "./actions";
import MobileSidebar from "@/components/dashboard/MobileSidebar";


export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  // No token = not logged in
  if (!token) {
    redirect("/login");
  }

  let role;
  let email;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    role = payload.role;
    email = payload.email;
  } catch (error) {
    console.error("JWT ERROR:", error);
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileSidebar
      role={role}
      email={email}
      />

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-[#0F172A] text-white lg:flex lg:flex-col">

        {/* LOGO */}

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

          {/* OVERVIEW */}

          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
            OVERVIEW
          </p>

          <Link
            href="/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl bg-[#2563EB] px-3 py-3 text-sm font-medium text-white shadow-lg shadow-blue-900/20"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
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
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ♙
                </span>

                Employees
              </Link>


              <Link
                href="/dashboard/departments"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ▤
                </span>

                Departments
              </Link>


              <Link
                href="/dashboard/designations"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ◈
                </span>

                Designations
              </Link>


              <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                WORKFORCE
              </p>


              <Link
                href="/dashboard/attendance"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ◷
                </span>

                Attendance
              </Link>


              <Link
                href="/dashboard/leave"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ▱
                </span>

                Leave
              </Link>


              <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                SYSTEM
              </p>


              <Link
                href="/dashboard/reports"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ▥
                </span>

                Reports
              </Link>


              <Link
                href="/dashboard/settings"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
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
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ♙
                </span>

                My Team
              </Link>


              <Link
                href="/dashboard/attendance"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ◷
                </span>

                Attendance
              </Link>


              <Link
                href="/dashboard/leave"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
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
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ♙
                </span>

                My Profile
              </Link>


              <Link
                href="/dashboard/attendance"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  ◷
                </span>

                My Attendance
              </Link>


              <Link
                href="/dashboard/leave"
                className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
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


      {/* ================= MAIN ================= */}

      <div className="lg:pl-72">

        {/* ================= HEADER ================= */}

        <header className="sticky top-0 z-30 h-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">

          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Mobile logo */}

            <div className="flex items-center gap-3 lg:hidden">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white">
                H
              </div>

              <span className="font-bold text-[#0F172A]">
                HRMS
              </span>

            </div>


            {/* Desktop title */}

            <div className="hidden lg:block">

              <h2 className="text-lg font-semibold text-[#0F172A]">
                HRMS Dashboard
              </h2>

              <p className="text-xs text-[#64748B]">
                Manage your workforce efficiently
              </p>

            </div>


            {/* Right side */}

            <div className="flex items-center gap-3">

              {/* Notification */}

              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC]"
                aria-label="Notifications"
              >
                ♧

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#EF4444]" />
              </button>


              {/* Divider */}

              <div className="hidden h-8 w-px bg-[#E2E8F0] sm:block" />


              {/* Profile */}

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                  {email?.charAt(0)?.toUpperCase()}
                </div>

                <div className="hidden sm:block">

                  <p className="text-sm font-semibold text-[#0F172A]">
                    {email}
                  </p>

                  <p className="text-xs text-[#64748B]">
                    {role}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>


        {/* ================= PAGE CONTENT ================= */}

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">

          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}