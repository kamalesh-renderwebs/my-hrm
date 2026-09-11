"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  function isActive(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Logout request failed:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Close mobile sidebar
      setMobileOpen(false);

      // Force browser navigation.
      // This prevents mobile browsers from keeping
      // the previous dashboard page in memory.
      window.location.href = "/login";
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-72
          bg-[#0F172A]
          text-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          lg:translate-x-0

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">

          {/* =========================
              HEADER
          ========================= */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">

            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3"
            >
              {/* Logo */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#2563EB] text-lg font-bold shadow-lg shadow-blue-500/20">
                H
              </div>

              {/* Brand */}
              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  HRMS
                </p>

                <p className="text-[11px] text-slate-400">
                  People Management
                </p>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-white/10
                hover:text-white
                lg:hidden
              "
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* =========================
              NAVIGATION
          ========================= */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">

            {menuSections.map((section) => (
              <div
                key={section.title}
                className="mb-7"
              >
                {/* Section title */}
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
                          group
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-sm
                          font-medium
                          transition-all
                          duration-200

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
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-base
                            transition

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

                        {/* Active indicator */}
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

          {/* =========================
              USER + LOGOUT
          ========================= */}
          <div className="shrink-0 border-t border-white/10 p-4">

            {/* User profile */}
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Admin User
                </p>

                <p className="truncate text-xs text-slate-400">
                  Administrator
                </p>
              </div>

              <span className="ml-auto text-slate-500">
                •••
              </span>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                mt-3
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-sm
                font-medium
                text-slate-400
                transition-all
                duration-200
                hover:bg-red-500/10
                hover:text-red-400
                active:scale-[0.98]
              "
            >
              {/* Logout icon */}
              <span
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-white/5
                  text-base
                "
              >
                ↪
              </span>

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