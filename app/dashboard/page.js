import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";


export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    user = payload;
  } catch (error) {
    redirect("/login");
  }

  // ADMIN DASHBOARD
  if (user.role === "ADMIN") {
    return (

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome, Admin
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-gray-500">Total Employees</p>
            <h2 className="text-3xl font-bold mt-2">120</h2>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-gray-500">Present Today</p>
            <h2 className="text-3xl font-bold mt-2">105</h2>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-gray-500">On Leave</p>
            <h2 className="text-3xl font-bold mt-2">8</h2>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-gray-500">Absent</p>
            <h2 className="text-3xl font-bold mt-2">7</h2>
          </div>

        </div>
      </div>
    );
  }

  // MANAGER DASHBOARD
  if (user.role === "MANAGER") {
    return (
          <main>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Manager Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your team and monitor their activities
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">
            My Team
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            25
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Total team members
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">
            Present Today
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            21
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Team members present
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">
            On Leave
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            2
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Team members on leave
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Leaves
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            2
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Requests awaiting approval
          </p>
        </div>

      </div>

      {/* Team Overview */}
      <div className="bg-white rounded-xl border shadow-sm mt-8">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            My Team
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overview of your team members
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Employee
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Designation
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Attendance
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>

            </thead>

            <tbody className="divide-y">

              <tr>
                <td className="px-6 py-4 font-medium">
                  Arun Kumar
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Development
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Software Engineer
                </td>

                <td className="px-6 py-4 text-green-600">
                  Present
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-medium">
                  Priya Sharma
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Development
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Software Engineer
                </td>

                <td className="px-6 py-4 text-green-600">
                  Present
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-medium">
                  Ravi Kumar
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Development
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Junior Developer
                </td>

                <td className="px-6 py-4 text-orange-600">
                  On Leave
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700">
                    On Leave
                  </span>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-medium">
                  Suresh Kumar
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Development
                </td>

                <td className="px-6 py-4 text-gray-500">
                  Team Lead
                </td>

                <td className="px-6 py-4 text-red-600">
                  Absent
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                    Absent
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* Pending Leave Requests */}
      <div className="bg-white rounded-xl border shadow-sm mt-8">

        <div className="p-6 border-b flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Leave Requests
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Leave requests waiting for your approval
            </p>
          </div>

          <button className="text-blue-600 hover:underline">
            View All
          </button>

        </div>

        <div className="divide-y">

          <div className="p-6 flex items-center justify-between">

            <div>
              <h3 className="font-medium text-gray-800">
                Ravi Kumar
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Casual Leave • 05 Sep 2026 - 06 Sep 2026
              </p>
            </div>

            <div className="flex gap-3">

              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Approve
              </button>

              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Reject
              </button>

            </div>

          </div>

          <div className="p-6 flex items-center justify-between">

            <div>
              <h3 className="font-medium text-gray-800">
                Divya Raj
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Sick Leave • 08 Sep 2026 - 09 Sep 2026
              </p>
            </div>

            <div className="flex gap-3">

              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Approve
              </button>

              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Reject
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
    );
  }

  // EMPLOYEE DASHBOARD
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Employee Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome, Employee
      </p>
    </div>
  );
}