"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileSidebar({ role, email, logout }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
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
        items: [{ name: "Dashboard", href: "/dashboard", icon: "▦" }],
      },
      {
        section: "PEOPLE",
        items: [
          { name: "Employees", href: "/dashboard/employees", icon: "👥" },
          { name: "Departments", href: "/dashboard/departments", icon: "▤" },
          { name: "Designations", href: "/dashboard/designations", icon: "▣" },
        ],
      },
      {
        section: "MANAGEMENT",
        items: [
          { name: "Activity record", href: "/dashboard/history", icon: "📥" },
          { name: "Attendance", href: "/dashboard/attendance", icon: "◷" },
          { name: "Leave", href: "/dashboard/leave", icon: "▤" },
        ],
      },
    ],

    MANAGER: [
      {
        section: "OVERVIEW",
        items: [{ name: "Dashboard", href: "/dashboard", icon: "▦" }],
      },
      {
        section: "TEAM",
        items: [
          { name: "My Team", href: "/dashboard/team", icon: "👥" },
          { name: "Attendance", href: "/dashboard/attendance", icon: "◷" },
          { name: "Leave Approval", href: "/dashboard/leave", icon: "▤" },
        ],
      },
    ],

    EMPLOYEE: [
      {
        section: "OVERVIEW",
        items: [{ name: "Dashboard", href: "/dashboard", icon: "▦" }],
      },
      {
        section: "MY WORK",
        items: [
          { name: "My Profile", href: "/dashboard/profile", icon: "👤" },
          { name: "Attendance", href: "/dashboard/attendance", icon: "◷" },
          { name: "My Leave", href: "/dashboard/leave", icon: "▤" },
        ],
      },
    ],
  };

  const sections = menu[role] || [];

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
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

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] font-bold text-white">
              H
            </div>

            <div>
              <p className="font-bold text-slate-900">HRMS</p>
              <p className="text-xs text-slate-500">Human Resources</p>
            </div>
          </div>

          <button
            onClick={closeMenu}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {sections.map((section) => (
            <div key={section.section} className="mb-6">
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
                    <span className="w-5 text-center">
                      {item.icon}
                    </span>

                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 rounded-xl bg-slate-50 p-3">
            <p className="truncate text-sm font-medium text-slate-900">
              {email}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {role}
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <span>↪</span>
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}