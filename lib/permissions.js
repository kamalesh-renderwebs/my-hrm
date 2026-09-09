
const ROLE_ACCESS = {
  ADMIN: [
    "/dashboard",
    "/dashboard/employees",
    "/dashboard/departments",
    "/dashboard/designations",
    "/dashboard/attendance",
    "/dashboard/leave",
    "/dashboard/reports",
    "/dashboard/settings",
  ],

  MANAGER: [
    "/dashboard",
    "/dashboard/team",
    "/dashboard/attendance",
    "/dashboard/leave",
  ],

  EMPLOYEE: [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/attendance",
    "/dashboard/leave",
  ],
};

export function canAccessRoute(role, pathname) {
  const allowedRoutes = ROLE_ACCESS[role];

  if (!allowedRoutes) {
    return false;
  }

  return allowedRoutes.some((route) => {
    // Dashboard home should match ONLY /dashboard
    if (route === "/dashboard") {
      return pathname === "/dashboard";
    }

    // Other routes can have child routes
    return (
      pathname === route ||
      pathname.startsWith(`${route}/`)
    );
  });
}


export { ROLE_ACCESS };