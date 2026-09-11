"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "▦",
    },
    {
      label: "Employees",
      href: "/dashboard/employees",
      icon: "♙",
    },
    {
      label: "Departments",
      href: "/dashboard/departments",
      icon: "▤",
    },
    {
      label: "Designations",
      href: "/dashboard/designations",
      icon: "▥",
    },
    {
      label: "Attendance",
      href: "/dashboard/attendance",
      icon: "◷",
    },
    {
      label: "Leave",
      href: "/dashboard/leave",
      icon: "▱",
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: "▥",
    },
    {
      label: "Activity History",
      href: "/dashboard/history",
      icon: "◴",
    },
  ];

  const handleNavigation = (href) => {
    setMobileOpen(false);
    router.push(href);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    console.log("Logout button clicked");

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.replace("/login");
    }
  };

  return (
    <>
      {/* ================================
          MOBILE BACKDROP
      ================================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================================
          SIDEBAR
      ================================= */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-[9999]
          h-screen
          w-72
          bg-[#0F172A]
          text-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out

          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ================================
            SIDEBAR CONTAINER
        ================================= */}
        <div className="flex h-full min-h-0 flex-col">

          {/* ================================
              LOGO / HEADER
          ================================= */}
          <div
            className="
              relative
              z-[10000]
              flex
              h-20
              shrink-0
              items-center
              justify-between
              border-b
              border-slate-700
              px-5
            "
          >
            {/* Logo */}
            <button
              type="button"
              onClick={() => handleNavigation("/dashboard")}
              className="flex cursor-pointer items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#2563EB] shadow-lg">
                <img
                  src="/logo.png.webp"
                  alt="HRMS Logo"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div className="text-left">
                <h1 className="text-base font-bold tracking-tight text-white">
                  HRMS
                </h1>

                <p className="text-[11px] text-slate-400">
                  Human Resource System
                </p>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                flex
                h-10
                w-10
                cursor-pointer
                items-center
                justify-center
                rounded-xl
                border
                border-slate-700
                text-lg
                text-slate-300
                transition
                hover:bg-slate-800
                hover:text-white
                lg:hidden
              "
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {/* ================================
              NAVIGATION
          ================================= */}
          <nav
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-4
              py-6
            "
          >
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Main Menu
            </p>

            <div className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href + "/"));

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      group
                      flex
                      min-h-11
                      w-full
                      cursor-pointer
                      touch-manipulation
                      select-none
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      text-left
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    {/* Icon */}
                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-base
                        transition

                        ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-slate-800/70 text-slate-400 group-hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span className="truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ================================
              USER / LOGOUT
          ================================= */}
          <div
            className="
              relative
              z-[10000]
              shrink-0
              border-t
              border-slate-700
              bg-[#0F172A]
              p-4
            "
          >
            {/* User Information */}
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/70 p-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#2563EB]
                  text-sm
                  font-bold
                  text-white
                "
              >
                A
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  Admin User
                </p>

                <p className="truncate text-xs text-slate-400">
                  Administrator
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              disabled={loggingOut}
              onClick={handleLogout}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onTouchStart={(event) => {
                event.stopPropagation();
              }}
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
                px-4
                py-3
                text-left
                text-sm
                font-medium
                text-red-400
                transition-all
                duration-200
                hover:bg-red-500/10
                hover:text-red-300
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-base">
                ↪
              </span>

              <span>
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}