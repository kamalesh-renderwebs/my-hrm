export default function SettingsPage() {
  return (
    <main>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your account and HRMS settings
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl border shadow-sm mt-8">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Profile Settings
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your personal information
          </p>
        </div>

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                defaultValue="Admin User"
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                defaultValue="admin@hrms.com"
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>

              <input
                type="text"
                defaultValue="ADMIN"
                disabled
                className="w-full mt-2 border rounded-lg px-4 py-3 bg-gray-100 text-black"
              />
            </div>

          </div>

          <div className="mt-6">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
              Save Profile
            </button>
          </div>

        </div>

      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border shadow-sm mt-6">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your account password
          </p>
        </div>

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>

              <input
                type="password"
                placeholder="Enter current password"
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

          </div>

          <div className="mt-6">
            <button className="bg-gray-800 text-white px-5 py-3 rounded-lg hover:bg-gray-900">
              Change Password
            </button>
          </div>

        </div>

      </div>

      {/* System Settings */}
      <div className="bg-white rounded-xl border shadow-sm mt-6">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            System Settings
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Configure basic HRMS preferences
          </p>
        </div>

        <div className="p-6 space-y-5">

          <div className="flex items-center justify-between border-b pb-5">
            <div>
              <h3 className="font-medium text-gray-800">
                Email Notifications
              </h3>

              <p className="text-sm text-gray-500">
                Receive notifications about HR activities
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between border-b pb-5">
            <div>
              <h3 className="font-medium text-gray-800">
                Leave Notifications
              </h3>

              <p className="text-sm text-gray-500">
                Get notified about leave requests
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">
                Attendance Notifications
              </h3>

              <p className="text-sm text-gray-500">
                Receive attendance related notifications
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5"
            />
          </div>

        </div>

      </div>

    </main>
  );
}