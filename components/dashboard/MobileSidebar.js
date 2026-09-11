"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileSidebar({ role, email, logout }) {
  const pathname = usePathname();

  // Mobile sidebar state
  const [open, setOpen] = useState(false);

  // Logout loading state
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const linkClass = (href) => {
    return `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
      isActive(href)
        ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const menu = {
    ADMIN: [
      {
        section: "OVERVIEW",
        items: [
          {
            name: "Dashboard",
            href: "/dashboard",
            icon: "▦",
          },
        ],
      },
      {
        section: "PEOPLE",
        items: [
          {
            name: "Employees",
            href: "/dashboard/employees",
            icon: "👥",
          },
          {
            name: "Departments",
            href: "/dashboard/departments",
            icon: "▤",
          },
          {
            name: "Designations",
            href: "/dashboard/designations",
            icon: "▣",
          },
        ],
      },
      {
        section: "MANAGEMENT",
        items: [
          {
            name: "Activity record",
            href: "/dashboard/history",
            icon: "📥",
          },
          {
            name: "Attendance",
            href: "/dashboard/attendance",
            icon: "◷",
          },
          {
            name: "Leave",
            href: "/dashboard/leave",
            icon: "▤",
          },
        ],
      },
    ],

    MANAGER: [
      {
        section: "OVERVIEW",
        items: [
          {
            name: "Dashboard",
            href: "/dashboard",
            icon: "▦",
          },
        ],
      },
      {
        section: "TEAM",
        items: [
          {
            name: "My Team",
            href: "/dashboard/team",
            icon: "👥",
          },
          {
            name: "Attendance",
            href: "/dashboard/attendance",
            icon: "◷",
          },
          {
            name: "Leave Approval",
            href: "/dashboard/leave",
            icon: "▤",
          },
        ],
      },
    ],

    EMPLOYEE: [
      {
        section: "OVERVIEW",
        items: [
          {
            name: "Dashboard",
            href: "/dashboard",
            icon: "▦",
          },
        ],
      },
      {
        section: "MY WORK",
        items: [
          {
            name: "My Profile",
            href: "/dashboard/profile",
            icon: "👤",
          },
          {
            name: "Attendance",
            href: "/dashboard/attendance",
            icon: "◷",
          },
          {
            name: "My Leave",
            href: "/dashboard/leave",
            icon: "▤",
          },
        ],
      },
    ],
  };

  const sections = menu[role] || [];

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loggingOut) {
      return;
    }

    console.log("LOGOUT BUTTON CLICKED");

    setLoggingOut(true);

    try {
      if (typeof logout === "function") {
        await logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    window.location.replace("/login");
  };

  return (
    <>
      {/* ==========================================
          MOBILE HEADER
      ========================================== */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
            <img
              src="/logo.png.webp"
              alt="HRMS Logo"
              className="h-full w-full object-contain p-1"
            />
          </div>

          <span className="text-lg font-bold text-slate-900">
            HRMS
          </span>
        </div>

        {/* Open Menu */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 cursor-pointer touch-manipulation items-center justify-center rounded-lg text-xl text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {/* ==========================================
          OVERLAY
      ========================================== */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* ==========================================
          MOBILE SIDEBAR
      ========================================== */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-[9999]
          flex
          h-screen
          w-72
          flex-col
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          lg:hidden
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ==========================================
            SIDEBAR HEADER
        ========================================== */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#2563EB]">
              <img
                src="/logo.png.webp"
                alt="HRMS Logo"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                HRMS
              </p>

              <p className="text-xs text-slate-500">
                Human Resources
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          {sections.map((section) => (
            <div
              key={section.section}
              className="mb-6"
            >
              <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-slate-400">
                {section.section}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={linkClass(item.href)}
                  >
                    <span className="flex w-5 shrink-0 items-center justify-center text-center">
                      {item.icon}
                    </span>

                    <span>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ==========================================
            USER + LOGOUT
        ========================================== */}
        <div className="relative z-[10000] shrink-0 border-t border-slate-200 bg-white p-4">
          {/* User */}
          <div className="mb-3 rounded-xl bg-slate-50 p-3">
            <p className="truncate text-sm font-medium text-slate-900">
              {email}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {role}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              relative
              z-[10001]
              flex
              min-h-12
              w-full
              cursor-pointer
              touch-manipulation
              select-none
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-left
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <span className="text-base">
              ↪
            </span>

            <span>
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}