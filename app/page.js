export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-800">
            HRMS
          </h1>

          <p className="text-sm text-gray-500">
            Human Resource Management System
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to HRMS
        </h2>

        <p className="text-gray-600 mt-2">
          Manage employees, attendance and leave in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white p-10 rounded-xl border shadow-sm">
            <h3 className="text-xl font-semibold">
              Employee Management
            </h3>

            <p className="text-gray-500 mt-2">
              Manage employee profiles and information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-xl font-semibold">
              Attendance
            </h3>

            <p className="text-gray-500 mt-2">
              Manage check-in, check-out and attendance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-xl font-semibold">
              Leave Management
            </h3>

            <p className="text-gray-500 mt-2">
              Apply and manage employee leaves.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}