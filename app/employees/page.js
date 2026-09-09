import Link from "next/link";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employees
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage all employees in your organization.
          </p>
        </div>

        <Link
          href="/dashboard/employees/add"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
        >
          + Add Employee
        </Link>
      </div>


      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Employees
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            120
          </h2>
        </div>


        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Active
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            105
          </h2>
        </div>


        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            On Leave
          </p>

          <h2 className="text-2xl font-bold text-orange-500 mt-2">
            8
          </h2>
        </div>


        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Inactive
          </p>

          <h2 className="text-2xl font-bold text-red-500 mt-2">
            7
          </h2>
        </div>

      </div>


      {/* Search and Filter */}
      <div className="bg-white border rounded-xl p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search employee..."
            className="flex-1 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            className="border rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="">All Departments</option>
            <option value="development">Development</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
          </select>

          <select
            className="border rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>

        </div>

      </div>


      {/* Employee Table */}
      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Employee List
          </h2>
        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left text-sm text-gray-500">

                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  Employee ID
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Designation
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y">

              {/* Employee 1 */}
              <tr className="hover:bg-gray-50">

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      AK
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        Arun Kumar
                      </p>

                      <p className="text-sm text-gray-500">
                        arun@company.com
                      </p>
                    </div>

                  </div>

                </td>


                <td className="px-6 py-4 text-sm">
                  EMP001
                </td>

                <td className="px-6 py-4 text-sm">
                  Development
                </td>

                <td className="px-6 py-4 text-sm">
                  Software Engineer
                </td>

                <td className="px-6 py-4">

                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Active
                  </span>

                </td>

                <td className="px-6 py-4">

                  <Link
                    href="/dashboard/employees/1"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>

                </td>

              </tr>


              {/* Employee 2 */}
              <tr className="hover:bg-gray-50">

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                      PS
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        Priya Sharma
                      </p>

                      <p className="text-sm text-gray-500">
                        priya@company.com
                      </p>
                    </div>

                  </div>

                </td>


                <td className="px-6 py-4 text-sm">
                  EMP002
                </td>

                <td className="px-6 py-4 text-sm">
                  HR
                </td>

                <td className="px-6 py-4 text-sm">
                  HR Executive
                </td>

                <td className="px-6 py-4">

                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Active
                  </span>

                </td>

                <td className="px-6 py-4">

                  <Link
                    href="/dashboard/employees/2"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>

                </td>

              </tr>


              {/* Employee 3 */}
              <tr className="hover:bg-gray-50">

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                      RK
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        Ravi Kumar
                      </p>

                      <p className="text-sm text-gray-500">
                        ravi@company.com
                      </p>
                    </div>

                  </div>

                </td>


                <td className="px-6 py-4 text-sm">
                  EMP003
                </td>

                <td className="px-6 py-4 text-sm">
                  Finance
                </td>

                <td className="px-6 py-4 text-sm">
                  Accountant
                </td>

                <td className="px-6 py-4">

                  <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                    On Leave
                  </span>

                </td>

                <td className="px-6 py-4">

                  <Link
                    href="/dashboard/employees/3"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}