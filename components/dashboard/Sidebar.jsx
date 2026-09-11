"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuSections = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: "▦",
      },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      {
        name: "Employees",
        href: "/dashboard/employees",
        icon: "♙",
      },
      {
        name: "Departments",
        href: "/dashboard/departments",
        icon: "▤",
      },
      {
        name: "Designations",
        href: "/dashboard/designations",
        icon: "◈",
      },
    ],
  },
  {
    title: "WORKFORCE",
    items: [
      {
        name: "Attendance",
        href: "/dashboard/attendance",
        icon: "◷",
      },
      {
        name: "Leave",
        href: "/dashboard/leave",
        icon: "▱",
      },
      {
        name: "Activity record",
        href: "/dashboard/history",
        icon: "📥",
      },
      {
        name: "Reports",
        href: "/dashboard/reports",
        icon: "▥",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: "⚙",
      },
    ],
  },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  // Logout
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Close mobile sidebar
      setMobileOpen(false);

      // Go to login page
      router.replace("/login");

      // Refresh authentication state
      router.refresh();
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72
          bg-[#0F172A] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">

          {/* ================= LOGO ================= */}
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-lg font-bold shadow-lg shadow-blue-500/20">
                H
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">
                  HRMS
                </p>

                <p className="text-[11px] text-slate-400">
                  People Management
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* ================= NAVIGATION ================= */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">

            {menuSections.map((section) => (
              <div
                key={section.title}
                className="mb-7"
              >

                {/* Section Title */}
                <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                  {section.title}
                </p>

                <div className="space-y-1">

                  {section.items.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          group flex items-center gap-3 rounded-xl px-3 py-3
                          text-sm font-medium transition-all
                          ${
                            active
                              ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }
                        `}
                      >

                        {/* Icon */}
                        <span
                          className={`
                            flex h-8 w-8 items-center justify-center rounded-lg text-base
                            ${
                              active
                                ? "bg-white/15 text-white"
                                : "bg-white/5 text-slate-400 group-hover:text-white"
                            }
                          `}
                        >
                          {item.icon}
                        </span>

                        {/* Name */}
                        <span>
                          {item.name}
                        </span>

                        {/* Active Indicator */}
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                        )}

                      </Link>
                    );
                  })}

                </div>
              </div>
            ))}

          </nav>

          {/* ================= BOTTOM PROFILE ================= */}
          <div className="border-t border-white/10 p-4">

            {/* Profile */}
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold">
                A
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-white">
                  Admin User
                </p>

                <p className="truncate text-xs text-slate-400">
                  Administrator
                </p>

              </div>

            </div>

            {/* ================= LOGOUT BUTTON ================= */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                mt-3 flex w-full items-center gap-3
                rounded-xl px-3 py-3
                text-sm font-medium
                text-slate-400
                transition-all duration-200
                hover:bg-red-500/10
                hover:text-red-400
                active:bg-red-500/20
              "
            >

              {/* Logout Icon */}
              <span
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg bg-white/5
                  text-base
                  transition
                  group-hover:bg-red-500/10
                "
              >
                ↪
              </span>

              {/* Logout Text */}
              <span>
                Logout
              </span>

            </button>

          </div>

        </div>
      </aside>
    </>
  );
}