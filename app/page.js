import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] transition-colors duration-300 dark:bg-[#0F172A] dark:text-[#F8FAFC]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur transition-colors duration-300 dark:border-slate-800 dark:bg-[#0F172A]/95">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">

          <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
  <img
    src="/logo.png.webp"
    alt="HRMS Logo"
    className="h-full w-full object-contain p-1"
  />
</div>
            <div>
              <h1 className="text-lg font-bold text-[#0F172A] dark:text-white">
                HRMS
              </h1>

              <p className="hidden text-[10px] text-[#64748B] dark:text-slate-400 sm:block">
                Human Resource Management
              </p>
            </div>

          </Link>


          {/* NAVIGATION */}
          <nav className="hidden items-center gap-8 md:flex">

            <Link
              href="/"
              className="text-sm font-medium text-[#2563EB]"
            >
              Home
            </Link>

            <a
              href="#features"
              className="text-sm font-medium text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
            >
              About
            </a>

            <Link
              href="/contact"
              className="text-sm font-medium text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
            >
              Contact
            </Link>

          </nav>


          {/* LOGIN */}
          <Link
            href="/login"
            className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            Login
          </Link>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/10" />


        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* HERO CONTENT */}
          <div>

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-[#2563EB] dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2563EB]" />

              Smart HR Management System

            </div>


            {/* Heading */}
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#0F172A] dark:text-white sm:text-5xl lg:text-6xl">

              Manage Your{" "}

              <span className="text-[#2563EB]">
                People
              </span>{" "}

              Better.

            </h1>


            {/* Description */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#64748B] dark:text-slate-400">

              A simple and powerful Human Resource Management System
              to manage employees, attendance, leave, departments,
              designations and HR operations in one place.

            </p>


            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/login"
                className="rounded-lg bg-[#2563EB] px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#1D4ED8] hover:shadow-blue-500/30"
              >
                Get Started →
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-[#E2E8F0] bg-white px-6 py-3.5 text-center font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                Explore Features
              </a>

            </div>


            {/* STATS */}
            <div className="mt-10 flex flex-wrap gap-8">

              <HeroStat
                number="100%"
                text="Digital Management"
              />

              <HeroStat
                number="24/7"
                text="Easy Access"
              />

              <HeroStat
                number="1"
                text="Unified Platform"
              />

            </div>

          </div>


          {/* =================================================
              DASHBOARD PREVIEW
          ================================================= */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-700/20" />


            {/* Browser */}
            <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xl shadow-slate-300/30 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">

              {/* Browser header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 dark:border-slate-700">

                <div className="flex gap-1.5">

                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />

                </div>

                <div className="h-2 w-32 rounded-full bg-[#E2E8F0] dark:bg-slate-700" />

              </div>


              {/* Dashboard */}
              <div className="grid grid-cols-[65px_1fr] gap-4 pt-4">

                {/* SIDEBAR */}
                <div className="rounded-xl bg-[#0F172A] p-3">

                  <div className="mb-5 flex justify-center">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                      H
                    </div>

                  </div>


                  <div className="space-y-3">

                    <div className="h-7 rounded-lg bg-[#2563EB]" />

                    <div className="h-2 rounded bg-slate-600" />
                    <div className="h-2 rounded bg-slate-600" />
                    <div className="h-2 rounded bg-slate-600" />
                    <div className="h-2 rounded bg-slate-600" />

                  </div>

                </div>


                {/* CONTENT */}
                <div>

                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">

                    <div>

                      <div className="h-4 w-32 rounded bg-[#0F172A] dark:bg-slate-200" />

                      <div className="mt-2 h-2 w-20 rounded bg-[#E2E8F0] dark:bg-slate-700" />

                    </div>

                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950" />

                  </div>


                  {/* Cards */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                    <PreviewCard
                      label="Employees"
                      value="124"
                      color="dark"
                    />

                    <PreviewCard
                      label="Present"
                      value="112"
                      color="blue"
                    />

                    <PreviewCard
                      label="Leave"
                      value="08"
                      color="green"
                    />

                    <PreviewCard
                      label="Pending"
                      value="04"
                      color="yellow"
                    />

                  </div>


                  {/* Chart */}
                  <div className="mt-4 rounded-lg border border-[#E2E8F0] p-4 dark:border-slate-700">

                    <div className="mb-5 h-3 w-28 rounded bg-[#0F172A] dark:bg-slate-200" />

                    <div className="flex h-32 items-end justify-between gap-2">

                      <div className="h-[35%] w-full rounded-t bg-blue-200 dark:bg-blue-900" />
                      <div className="h-[55%] w-full rounded-t bg-blue-300 dark:bg-blue-800" />
                      <div className="h-[45%] w-full rounded-t bg-blue-400 dark:bg-blue-700" />
                      <div className="h-[75%] w-full rounded-t bg-[#2563EB]" />
                      <div className="h-[60%] w-full rounded-t bg-blue-300 dark:bg-blue-800" />
                      <div className="h-[85%] w-full rounded-t bg-[#2563EB]" />
                      <div className="h-[70%] w-full rounded-t bg-blue-400 dark:bg-blue-700" />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section
        id="features"
        className="border-y border-[#E2E8F0] bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
      >

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#0F172A] dark:text-white sm:text-4xl">
              Everything You Need to Manage HR
            </h2>

            <p className="mt-4 text-[#64748B] dark:text-slate-400">
              Manage your organization's complete employee lifecycle
              through one simple platform.
            </p>

          </div>


          {/* Feature Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon="👥"
              title="Employee Management"
              description="Create, update and manage employee information from one centralized system."
            />

            <FeatureCard
              icon="⏰"
              title="Attendance Tracking"
              description="Track employee check-in, check-out and attendance history easily."
            />

            <FeatureCard
              icon="📅"
              title="Leave Management"
              description="Employees can apply for leave while managers can approve or reject requests."
            />

            <FeatureCard
              icon="🏢"
              title="Departments"
              description="Organize employees into departments and assign department managers."
            />

            <FeatureCard
              icon="💼"
              title="Designations"
              description="Manage employee designations and maintain a clear organizational structure."
            />

            <FeatureCard
              icon="📊"
              title="Reports & Dashboard"
              description="View important HR statistics and get a clear overview of your organization."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}
      <section
        id="about"
        className="bg-[#F8FAFC] transition-colors duration-300 dark:bg-[#0F172A]"
      >

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* About Visual */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="grid grid-cols-2 gap-4">

              <AboutBox
                number="01"
                title="Simple"
                text="Easy-to-use interface"
              />

              <AboutBox
                number="02"
                title="Secure"
                text="Role-based access"
              />

              <AboutBox
                number="03"
                title="Scalable"
                text="Built for growing teams"
              />

              <AboutBox
                number="04"
                title="Responsive"
                text="Works across devices"
              />

            </div>

          </div>


          {/* About Content */}
          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
              About HRMS
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#0F172A] dark:text-white sm:text-4xl">
              One Platform for Your Entire HR Workflow
            </h2>

            <p className="mt-5 leading-7 text-[#64748B] dark:text-slate-400">
              Our HRMS is designed to simplify everyday HR operations.
              From employee management and attendance to leave
              approvals and organizational management, everything
              can be handled from a single platform.
            </p>

            <p className="mt-4 leading-7 text-[#64748B] dark:text-slate-400">
              With role-based access, administrators, managers and
              employees get the right tools and information they need.
            </p>

            <div className="mt-8">

              <Link
                href="/login"
                className="inline-flex rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                Start Managing →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="bg-[#0F172A] dark:bg-slate-950">

        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Get Started
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Ready to Simplify Your HR Operations?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Manage employees, attendance and leave from one
              centralized HR management platform.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex rounded-lg bg-[#2563EB] px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-[#1D4ED8]"
            >
              Get Started →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="bg-white transition-colors duration-300 dark:bg-slate-900">

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">

          {/* BRAND */}
          <div className="md:col-span-2">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] font-bold text-white">
                H
              </div>

              <span className="text-lg font-bold text-[#0F172A] dark:text-white">
                HRMS
              </span>

            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#64748B] dark:text-slate-400">
              A modern Human Resource Management System designed
              to make HR operations simple, organized and efficient.
            </p>

          </div>


          {/* QUICK LINKS */}
          <div>

            <h3 className="font-semibold text-[#0F172A] dark:text-white">
              Quick Links
            </h3>

            <div className="mt-4 space-y-3">

              <Link
                href="/"
                className="block text-sm text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
              >
                Home
              </Link>

              <a
                href="#about"
                className="block text-sm text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
              >
                About
              </a>

              <a
                href="#features"
                className="block text-sm text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
              >
                Features
              </a>

              <Link
                href="/contact"
                className="block text-sm text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
              >
                Contact
              </Link>

            </div>

          </div>


          {/* ACCOUNT */}
          <div>

            <h3 className="font-semibold text-[#0F172A] dark:text-white">
              Account
            </h3>

            <div className="mt-4 space-y-3">

              <Link
                href="/login"
                className="block text-sm text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
              >
                Login
              </Link>

              <Link
                href="/login"
                className="block text-sm text-[#64748B] transition hover:text-[#2563EB] dark:text-slate-400"
              >
                Get Started
              </Link>

            </div>

          </div>

        </div>


        {/* COPYRIGHT */}
        <div className="border-t border-[#E2E8F0] dark:border-slate-800">

          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-[#64748B] dark:text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

            <p>
              © 2026 HRMS. All rights reserved.
            </p>

            <p>
              Powered by Render web solutions.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({ number, text }) {
  return (
    <div>
      <p className="text-2xl font-bold text-[#0F172A] dark:text-white">
        {number}
      </p>

      <p className="text-sm text-[#64748B] dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-xl border border-[#E2E8F0] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-800">

      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl dark:bg-blue-950/50">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#0F172A] dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#64748B] dark:text-slate-400">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   ABOUT BOX
========================================================= */

function AboutBox({ number, title, text }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition-colors dark:border-slate-700 dark:bg-slate-800">

      <span className="text-xs font-bold text-[#2563EB]">
        {number}
      </span>

      <h3 className="mt-3 font-semibold text-[#0F172A] dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   DASHBOARD PREVIEW CARD
========================================================= */

function PreviewCard({ label, value, color }) {

  const valueColor = {
    dark: "text-[#0F172A] dark:text-white",
    blue: "text-[#2563EB]",
    green: "text-[#10B981]",
    yellow: "text-[#F59E0B]",
  };

  return (
    <div className="rounded-lg border border-[#E2E8F0] p-3 dark:border-slate-700">

      <div className="h-2 w-12 rounded bg-[#94A3B8]" />

      <p className="mt-2 text-[10px] text-[#64748B] dark:text-slate-500">
        {label}
      </p>

      <div
        className={`mt-1 text-lg font-bold ${valueColor[color]}`}
      >
        {value}
      </div>

    </div>
  );
}