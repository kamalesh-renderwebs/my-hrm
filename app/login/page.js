
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0F172A] dark:text-white">

      {/* =====================================================
          TOP BAR
      ===================================================== */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#2563EB] dark:text-[#94A3B8]"
        >
          <span className="text-lg transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back to Home
        </button>

        <ThemeToggle />
      </div>

      {/* =====================================================
          MAIN LOGIN AREA
      ===================================================== */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16 sm:px-6">

        {/* Background Decoration */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#2563EB]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

        {/* Main Container */}
        <div className="relative mx-auto flex w-full max-w-312.5 items-center">

          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <section className="hidden w-1/2 flex-col justify-center px-8 lg:flex xl:px-14">

            {/* Logo */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl  shadow-md">
                <img
                  src="/logo.png.webp"
                  alt="HRMS Logo"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  HRMS
                </h2>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Human Resource Management
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="max-w-lg">
              <p className="mb-1.5 text-xs font-semibold tracking-wide text-[#2563EB]">
                WELCOME BACK
              </p>

              <h1 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
                Manage your workforce
                <span className="block text-[#2563EB]">
                  smarter and easier.
                </span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-5 text-[#64748B] dark:text-[#94A3B8]">
                A centralized HR platform to manage employees, attendance,
                leave, departments and organizational activities in one place.
              </p>
            </div>

            {/* Features */}
            <div className="mt-5 grid max-w-lg grid-cols-2 gap-2.5">
              <FeatureItem
                icon="✓"
                title="Employee Management"
                description="Manage employee information"
              />

              <FeatureItem
                icon="✓"
                title="Attendance Tracking"
                description="Track daily attendance"
              />

              <FeatureItem
                icon="✓"
                title="Leave Management"
                description="Handle leave requests"
              />

              <FeatureItem
                icon="✓"
                title="Role Based Access"
                description="Secure access control"
              />
            </div>
          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}
          <section className="flex w-full items-center justify-center lg:w-1/2 lg:px-8">

            <div className="w-full max-w-md">

              {/* Login Card */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-[#334155] dark:bg-[#1E293B] dark:shadow-none sm:p-7">

                {/* Mobile Logo */}
                <div className="mb-4 flex items-center justify-center lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#2563EB]">
                    <img
                      src="/logo.png.webp"
                      alt="HRMS Logo"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                </div>

                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Welcome back
                  </h2>

                  <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
                    Sign in to continue to your HRMS dashboard.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/10 px-3 py-2 text-sm text-[#EF4444]">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* =================================================
                    LOGIN FORM
                ================================================= */}
                <form onSubmit={handleLogin} className="space-y-3.5">

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                        ✉
                      </span>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 dark:border-[#334155] dark:bg-[#0F172A] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                        🔒
                      </span>

                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 dark:border-[#334155] dark:bg-[#0F172A] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8] active:scale-[0.99]"
                  >
                    Sign In
                  </button>
                </form>

                {/* Security */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <span>🔐</span>
                  Secure access to your HRMS account
                </div>
              </div>

              {/* Footer */}
              <p className="mt-3 text-center text-xs text-[#94A3B8]">
                © {new Date().getFullYear()} HRMS. All rights reserved.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* =====================================================
   FEATURE ITEM
===================================================== */

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-[#E2E8F0] bg-white/70 p-2.5 dark:border-[#334155] dark:bg-[#1E293B]/60">

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-xs font-bold text-[#10B981]">
        {icon}
      </div>

      <div>
        <h3 className="text-xs font-semibold">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] leading-4 text-[#64748B] dark:text-[#94A3B8]">
          {description}
        </p>
      </div>
    </div>
  );
}

