import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

import { logout } from "./actions";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import DesktopSidebar from "@/components/dashboard/DesktopSidebar";
import ThemeToggle from "@/components/ThemeToggle";


export default async function DashboardLayout({ children }) {

  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;


  // ================= AUTH =================

  if (!token) {
    redirect("/login");
  }


  let role;
  let email;


  try {

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );


    const { payload } = await jwtVerify(
      token,
      secret
    );


    role = payload.role;
    email = payload.email;

  } catch (error) {

    console.error("JWT ERROR:", error);

    redirect("/login");
  }


  return (

    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors duration-200 dark:bg-[#090D16] dark:text-slate-100">

      {/* ================= MOBILE SIDEBAR ================= */}

      <MobileSidebar
        role={role}
        email={email}
      />


      {/* ================= DESKTOP SIDEBAR ================= */}

      <DesktopSidebar
        role={role}
        email={email}
        logout={logout}
      />


      {/* ================= MAIN ================= */}

      <div className="lg:pl-72">


        {/* ================= HEADER ================= */}

        <header className="sticky top-0 z-30 h-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur transition-colors duration-200 dark:border-slate-800/80 dark:bg-[#111827]/95">

          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">


            {/* ================= MOBILE LOGO ================= */}

            <div className="flex items-center gap-3 lg:hidden">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white">
                H
              </div>

              <span className="font-bold text-[#0F172A] dark:text-white">
                HRMS
              </span>

            </div>


            {/* ================= DESKTOP TITLE ================= */}

            <div className="hidden lg:block">

              <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white">
                HRMS Dashboard
              </h2>

              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Manage your workforce efficiently
              </p>

            </div>


            {/* ================= RIGHT SIDE ================= */}

            <div className="flex items-center gap-3">

              {/* Theme Toggle Button */}

              <ThemeToggle />


              {/* Notification */}



              {/* Divider */}

              <div className="hidden h-8 w-px bg-[#E2E8F0] dark:bg-slate-800 sm:block" />


              {/* Profile */}

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                  {email?.charAt(0)?.toUpperCase()}
                </div>


                <div className="hidden sm:block">

                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                    {email}
                  </p>

                  <p className="text-xs text-[#64748B] dark:text-slate-400">
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