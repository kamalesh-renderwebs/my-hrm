"use client";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Search */}
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search employees, departments..."
              className="
                h-11 w-full rounded-xl
                border border-[#E2E8F0]
                bg-[#F8FAFC]
                pl-11 pr-4
                text-sm text-[#0F172A]
                outline-none
                placeholder:text-[#94A3B8]
                focus:border-[#2563EB]
                focus:ring-4 focus:ring-blue-500/10
              "
            />

            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-[10px] text-[#94A3B8] sm:block">
              ⌘ K
            </span>

          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">

          {/* Mobile search */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] md:hidden"
            aria-label="Search"
          >
            ⌕
          </button>

          {/* Notification */}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
            aria-label="Notifications"
          >
            ♧

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#EF4444]" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#E2E8F0] sm:block" />

          {/* Profile */}
          <button className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-[#F8FAFC]">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
              A
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-[#0F172A]">
                Admin User
              </p>

              <p className="text-xs text-[#64748B]">
                Administrator
              </p>
            </div>

            <span className="hidden text-xs text-[#94A3B8] lg:block">
              ▼
            </span>

          </button>

        </div>

      </div>
    </header>
  );
}