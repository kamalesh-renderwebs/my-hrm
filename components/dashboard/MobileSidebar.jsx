"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileSidebar({ role, email }) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-5 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Overlay */}
      {open && (
        <button
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#0F172A] text-white transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] font-bold">
              H
            </div>

            <div>
              <h1 className="font-bold">HRMS</h1>
              <p className="text-[11px] text-slate-400">
                People Management
              </p>
            </div>
          </div>

          <button
            onClick={closeMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="mb-1 flex items-center gap-3 rounded-xl bg-[#2563EB] px-3 py-3 text-sm font-medium"
          >
            <span>▦</span>
            Dashboard
          </Link>

          {/* ADMIN */}
          {role === "ADMIN" && (
            <>
              <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                PEOPLE
              </p>

              <MobileLink
                href="/dashboard/employees"
                onClick={closeMenu}
                icon="♙"
                text="Employees"
              />

              <MobileLink
                href="/dashboard/departments"
                onClick={closeMenu}
                icon="▤"
                text="Departments"
              />

              <MobileLink
                href="/dashboard/designations"
                onClick={closeMenu}
                icon="◈"
                text="Designations"
              />

              <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                WORKFORCE
              </p>

              <MobileLink
                href="/dashboard/attendance"
                onClick={closeMenu}
                icon="◷"
                text="Attendance"
              />

              <MobileLink
                href="/dashboard/leave"
                onClick={closeMenu}
                icon="▱"
                text="Leave"
              />

              <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                SYSTEM
              </p>

              <MobileLink
                href="/dashboard/reports"
                onClick={closeMenu}
                icon="▥"
                text="Reports"
              />

              <MobileLink
                href="/dashboard/settings"
                onClick={closeMenu}
                icon="⚙"
                text="Settings"
              />
            </>
          )}

          {/* MANAGER */}
          {role === "MANAGER" && (
            <>
              <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                TEAM
              </p>

              <MobileLink
                href="/dashboard/team"
                onClick={closeMenu}
                icon="♙"
                text="My Team"
              />

              <MobileLink
                href="/dashboard/attendance"
                onClick={closeMenu}
                icon="◷"
                text="Attendance"
              />

              <MobileLink
                href="/dashboard/leave"
                onClick={closeMenu}
                icon="▱"
                text="Leave Approval"
              />
            </>
          )}

          {/* EMPLOYEE */}
          {role === "EMPLOYEE" && (
            <>
              <p className="mb-3 mt-7 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                MY HR
              </p>

              <MobileLink
                href="/dashboard/profile"
                onClick={closeMenu}
                icon="♙"
                text="My Profile"
              />

              <MobileLink
                href="/dashboard/attendance"
                onClick={closeMenu}
                icon="◷"
                text="My Attendance"
              />

              <MobileLink
                href="/dashboard/leave"
                onClick={closeMenu}
                icon="▱"
                text="My Leave"
              />
            </>
          )}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
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
        </div>
      </aside>
    </>
  );
}

function MobileLink({ href, onClick, icon, text }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
        {icon}
      </span>

      {text}
    </Link>
  );
}