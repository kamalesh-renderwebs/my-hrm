"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const [selectedDate, setSelectedDate] =
    useState(getTodayDate());

  const [userLoading, setUserLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // TODAY
  // ==========================================

  function getTodayDate() {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // ==========================================
  // LOAD USER
  // ==========================================

  async function loadUser() {
    try {
      setUserLoading(true);

      const response = await fetch(
        "/api/auth/me",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return null;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load user"
        );
      }

      const data =
        await response.json();

      /*
        Supports both:

        {
          id,
          role,
          email
        }

        and:

        {
          user: {
            id,
            role,
            email
          }
        }
      */

      const currentUser =
        data.user || data;

      console.log(
        "Current User:",
        currentUser
      );

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      console.error(
        "Load user error:",
        error
      );

      setError(
        "Failed to load user."
      );

      return null;
    } finally {
      setUserLoading(false);
    }
  }

  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  async function loadAttendance(
    date = selectedDate
  ) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/attendance?date=${date}`,
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to fetch attendance"
        );
      }

      setAttendance(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Attendance error:",
        error
      );

      setError(
        error.message ||
          "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    async function initialize() {
      const currentUser =
        await loadUser();

      if (currentUser) {
        await loadAttendance(
          getTodayDate()
        );
      }
    }

    initialize();
  }, []);

  // ==========================================
  // DATE CHANGE
  // ==========================================

  function handleDateChange(event) {
    const date =
      event.target.value;

    setSelectedDate(date);
    setError("");
    setSuccess("");

    loadAttendance(date);
  }

  // ==========================================
  // CHECK IN
  // ==========================================

  async function handleCheckIn() {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response =
        await fetch(
          "/api/attendance/check-in",
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Check-in failed"
        );
      }

      setSuccess(
        "Check-in successful."
      );

      await loadAttendance(
        selectedDate
      );
    } catch (error) {
      setError(
        error.message ||
          "Check-in failed."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ==========================================
  // CHECK OUT
  // ==========================================

  async function handleCheckOut() {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response =
        await fetch(
          "/api/attendance/check-out",
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Check-out failed"
        );
      }

      setSuccess(
        "Check-out successful."
      );

      await loadAttendance(
        selectedDate
      );
    } catch (error) {
      setError(
        error.message ||
          "Check-out failed."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ==========================================
  // FIND MY ATTENDANCE
  // ==========================================

  const myAttendance =
    useMemo(() => {
      if (!user) {
        return null;
      }

      return attendance.find(
        (item) =>
          item.employee?.user?.id ===
          user.id
      );
    }, [attendance, user]);

  // ==========================================
  // TEAM ATTENDANCE
  // ==========================================

  const teamAttendance =
    useMemo(() => {
      if (
        user?.role !== "MANAGER"
      ) {
        return attendance;
      }

      /*
        Remove manager's own
        attendance from team list.
      */

      return attendance.filter(
        (item) =>
          item.employee?.user?.id !==
          user.id
      );
    }, [attendance, user]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalRecords =
    teamAttendance.length;

  const totalPresent =
    teamAttendance.filter(
      (item) =>
        item.status?.toUpperCase() ===
        "PRESENT"
    ).length;

  const totalAbsent =
    teamAttendance.filter(
      (item) =>
        item.status?.toUpperCase() ===
        "ABSENT"
    ).length;

  const totalLate =
    teamAttendance.filter(
      (item) =>
        item.status?.toUpperCase() ===
        "LATE"
    ).length;

  // ==========================================
  // TODAY?
  // ==========================================

  const isToday =
    selectedDate ===
    getTodayDate();

  // ==========================================
  // LOADING
  // ==========================================

  if (userLoading) {
    return (
      <div className="
        min-h-screen
        bg-[#F8FAFC]
        flex
        items-center
        justify-center
      ">
        <div className="text-center">

          <div className="
            w-10
            h-10
            border-4
            border-[#2563EB]
            border-t-transparent
            rounded-full
            animate-spin
            mx-auto
          " />

          <p className="
            mt-4
            text-sm
            text-[#64748B]
          ">
            Loading attendance...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-[#F8FAFC]
      p-4
      sm:p-6
      lg:p-8
    ">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
        mb-7
      ">

        <div>

          <p className="
            text-sm
            font-medium
            text-[#2563EB]
            mb-1
          ">
            Attendance Management
          </p>

          <h1 className="
            text-2xl
            sm:text-3xl
            font-bold
            text-[#0F172A]
          ">
            {user?.role === "ADMIN"
              ? "Organization Attendance"
              : user?.role === "MANAGER"
              ? "Team Attendance"
              : "My Attendance"}
          </h1>

          <p className="
            text-sm
            text-[#64748B]
            mt-2
          ">
            Track attendance,
            check-in and check-out
            records.
          </p>

        </div>

        {/* DATE */}

        <div className="
          flex
          flex-col
          sm:flex-row
          gap-3
        ">

          <div>

            <label className="
              block
              text-xs
              font-medium
              text-[#64748B]
              mb-1
            ">
              Select Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={
                handleDateChange
              }
              className="
                h-11
                w-full
                sm:w-[180px]
                px-3
                rounded-lg
                border
                border-[#E2E8F0]
                bg-white
                text-sm
                text-[#0F172A]
                outline-none
                focus:ring-2
                focus:ring-[#2563EB]/20
                focus:border-[#2563EB]
              "
            />

          </div>

          <button
            onClick={() =>
              loadAttendance(
                selectedDate
              )
            }
            disabled={loading}
            className="
              self-end
              h-11
              px-5
              rounded-lg
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              text-white
              text-sm
              font-semibold
              transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>
      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="
          mb-5
          rounded-xl
          border
          border-[#EF4444]/20
          bg-[#EF4444]/5
          px-4
          py-3
          text-sm
          text-[#EF4444]
        ">
          {error}
        </div>
      )}

      {/* ======================================
          SUCCESS
      ====================================== */}

      {success && (
        <div className="
          mb-5
          rounded-xl
          border
          border-[#10B981]/20
          bg-[#10B981]/5
          px-4
          py-3
          text-sm
          text-[#10B981]
        ">
          {success}
        </div>
      )}

      {/* ======================================
          MANAGER
      ====================================== */}

      {user?.role === "MANAGER" && (
        <>

          {/* MY ATTENDANCE */}

          <div className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            shadow-sm
            p-5
            sm:p-6
            mb-6
          ">

            <div className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-6
            ">

              {/* LEFT */}

              <div>

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    w-11
                    h-11
                    rounded-xl
                    bg-[#2563EB]/10
                    flex
                    items-center
                    justify-center
                  ">
                    <span className="
                      text-[#2563EB]
                      text-lg
                    ">
                      ✓
                    </span>
                  </div>

                  <div>

                    <p className="
                      text-xs
                      font-medium
                      text-[#64748B]
                    ">
                      Manager Attendance
                    </p>

                    <h2 className="
                      text-lg
                      font-semibold
                      text-[#0F172A]
                    ">
                      My Attendance
                    </h2>

                  </div>

                </div>

                <p className="
                  text-sm
                  text-[#64748B]
                  mt-4
                ">
                  {formatDate(
                    selectedDate
                  )}
                </p>

                <div className="mt-3">
                  {myAttendance ? (
                    <StatusBadge
                      status={
                        myAttendance.status
                      }
                    />
                  ) : (
                    <span className="
                      inline-flex
                      px-3
                      py-1
                      rounded-full
                      bg-[#F8FAFC]
                      text-[#64748B]
                      text-xs
                      font-semibold
                    ">
                      NOT MARKED
                    </span>
                  )}
                </div>

              </div>

              {/* TIMES */}

              <div className="
                grid
                grid-cols-2
                gap-4
                lg:min-w-[300px]
              ">

                <div className="
                  bg-[#F8FAFC]
                  rounded-xl
                  p-4
                ">

                  <p className="
                    text-xs
                    text-[#64748B]
                  ">
                    Check In
                  </p>

                  <p className="
                    text-xl
                    font-bold
                    text-[#0F172A]
                    mt-1
                  ">
                    {myAttendance
                      ? formatTime(
                          myAttendance.checkIn
                        )
                      : "--:--"}
                  </p>

                  <p className="
                    text-[11px]
                    text-[#64748B]
                    mt-1
                  ">
                    24-hour time
                  </p>

                </div>

                <div className="
                  bg-[#F8FAFC]
                  rounded-xl
                  p-4
                ">

                  <p className="
                    text-xs
                    text-[#64748B]
                  ">
                    Check Out
                  </p>

                  <p className="
                    text-xl
                    font-bold
                    text-[#0F172A]
                    mt-1
                  ">
                    {myAttendance
                      ? formatTime(
                          myAttendance.checkOut
                        )
                      : "--:--"}
                  </p>

                  <p className="
                    text-[11px]
                    text-[#64748B]
                    mt-1
                  ">
                    24-hour time
                  </p>

                </div>

              </div>

              {/* BUTTONS */}

              {isToday && (
                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  lg:flex-col
                  gap-3
                ">

                  <button
                    onClick={
                      handleCheckIn
                    }
                    disabled={
                      actionLoading ||
                      Boolean(
                        myAttendance?.checkIn
                      )
                    }
                    className="
                      px-5
                      py-3
                      rounded-lg
                      bg-[#2563EB]
                      hover:bg-[#1D4ED8]
                      text-white
                      text-sm
                      font-semibold
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {myAttendance?.checkIn
                      ? "Checked In"
                      : actionLoading
                      ? "Processing..."
                      : "Check In"}
                  </button>

                  <button
                    onClick={
                      handleCheckOut
                    }
                    disabled={
                      actionLoading ||
                      !myAttendance?.checkIn ||
                      Boolean(
                        myAttendance?.checkOut
                      )
                    }
                    className="
                      px-5
                      py-3
                      rounded-lg
                      border
                      border-[#E2E8F0]
                      bg-white
                      hover:bg-[#F8FAFC]
                      text-[#0F172A]
                      text-sm
                      font-semibold
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {myAttendance?.checkOut
                      ? "Checked Out"
                      : "Check Out"}
                  </button>

                </div>
              )}

            </div>
          </div>

          {/* TEAM STATISTICS */}

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-6
          ">

            <StatCard
              title="Team Present"
              value={totalPresent}
              subtitle={`Present on ${formatDate(
                selectedDate
              )}`}
            />

            <StatCard
              title="Team Absent"
              value={totalAbsent}
              subtitle={`Absent on ${formatDate(
                selectedDate
              )}`}
            />

            <StatCard
              title="Team Late"
              value={totalLate}
              subtitle={`Late on ${formatDate(
                selectedDate
              )}`}
            />

            <StatCard
              title="Team Records"
              value={totalRecords}
              subtitle={`Records on ${formatDate(
                selectedDate
              )}`}
            />

          </div>

          {/* TEAM TABLE */}

          <TeamAttendanceTable
            attendance={
              teamAttendance
            }
            loading={loading}
          />

        </>
      )}

      {/* ======================================
          ADMIN
      ====================================== */}

      {user?.role === "ADMIN" && (
        <>
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-6
          ">

            <StatCard
              title="Total Present"
              value={totalPresent}
              subtitle="Present"
            />

            <StatCard
              title="Total Absent"
              value={totalAbsent}
              subtitle="Absent"
            />

            <StatCard
              title="Total Late"
              value={totalLate}
              subtitle="Late"
            />

            <StatCard
              title="Attendance Records"
              value={totalRecords}
              subtitle="Records"
            />

          </div>

          <TeamAttendanceTable
            attendance={
              attendance
            }
            loading={loading}
          />
        </>
      )}

      {/* ======================================
          EMPLOYEE
      ====================================== */}

      {user?.role === "EMPLOYEE" && (
        <>

          <div className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            p-5
            mb-6
            shadow-sm
          ">

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            ">

              <div>

                <p className="
                  text-sm
                  text-[#64748B]
                ">
                  Attendance for
                </p>

                <h2 className="
                  text-xl
                  font-semibold
                  text-[#0F172A]
                  mt-1
                ">
                  {formatDate(
                    selectedDate
                  )}
                </h2>

                <div className="mt-3">

                  {myAttendance ? (
                    <StatusBadge
                      status={
                        myAttendance.status
                      }
                    />
                  ) : (
                    <p className="
                      text-sm
                      text-[#64748B]
                    ">
                      No attendance
                      record.
                    </p>
                  )}

                </div>

              </div>

              {isToday && (
                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  gap-3
                ">

                  <button
                    onClick={
                      handleCheckIn
                    }
                    disabled={
                      actionLoading ||
                      Boolean(
                        myAttendance?.checkIn
                      )
                    }
                    className="
                      px-5
                      py-3
                      rounded-lg
                      bg-[#2563EB]
                      hover:bg-[#1D4ED8]
                      text-white
                      text-sm
                      font-semibold
                      disabled:opacity-50
                    "
                  >
                    {myAttendance?.checkIn
                      ? "Checked In"
                      : "Check In"}
                  </button>

                  <button
                    onClick={
                      handleCheckOut
                    }
                    disabled={
                      actionLoading ||
                      !myAttendance?.checkIn ||
                      Boolean(
                        myAttendance?.checkOut
                      )
                    }
                    className="
                      px-5
                      py-3
                      rounded-lg
                      border
                      border-[#E2E8F0]
                      bg-white
                      text-[#0F172A]
                      text-sm
                      font-semibold
                      disabled:opacity-50
                    "
                  >
                    {myAttendance?.checkOut
                      ? "Checked Out"
                      : "Check Out"}
                  </button>

                </div>
              )}

            </div>
          </div>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
            mb-6
          ">

            <StatCard
              title="Check In"
              value={
                myAttendance
                  ? formatTime(
                      myAttendance.checkIn
                    )
                  : "--:--"
              }
              subtitle="24-hour time"
            />

            <StatCard
              title="Check Out"
              value={
                myAttendance
                  ? formatTime(
                      myAttendance.checkOut
                    )
                  : "--:--"
              }
              subtitle="24-hour time"
            />

            <StatCard
              title="Status"
              value={
                myAttendance?.status ||
                "Not Marked"
              }
              subtitle={formatDate(
                selectedDate
              )}
            />

          </div>

          <SimpleAttendanceTable
            attendance={
              attendance
            }
            loading={loading}
          />

        </>
      )}

    </div>
  );
}

/* ==================================================
   TEAM ATTENDANCE TABLE
================================================== */

function TeamAttendanceTable({
  attendance,
  loading,
}) {
  return (
    <div className="
      bg-white
      border
      border-[#E2E8F0]
      rounded-2xl
      shadow-sm
      overflow-hidden
    ">

      <div className="
        px-5
        py-4
        border-b
        border-[#E2E8F0]
      ">

        <h2 className="
          text-base
          font-semibold
          text-[#0F172A]
        ">
          Team Attendance
        </h2>

        <p className="
          text-xs
          text-[#64748B]
          mt-1
        ">
          View attendance records
          for your team.
        </p>

      </div>

      {loading ? (
        <LoadingBox />
      ) : attendance.length === 0 ? (
        <EmptyState />
      ) : (
        <>

          {/* DESKTOP */}

          <div className="
            hidden
            lg:block
            overflow-x-auto
          ">

            <table className="w-full">

              <thead className="bg-[#F8FAFC]">

                <tr className="
                  text-left
                  text-xs
                  text-[#64748B]
                ">

                  <th className="px-5 py-3">
                    Employee
                  </th>

                  <th className="px-5 py-3">
                    Code
                  </th>

                  <th className="px-5 py-3">
                    Department
                  </th>

                  <th className="px-5 py-3">
                    Designation
                  </th>

                  <th className="px-5 py-3">
                    Check In
                  </th>

                  <th className="px-5 py-3">
                    Check Out
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="
                divide-y
                divide-[#E2E8F0]
              ">

                {attendance.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="
                        hover:bg-[#F8FAFC]
                      "
                    >

                      <td className="px-5 py-4">

                        <p className="
                          text-sm
                          font-semibold
                          text-[#0F172A]
                        ">
                          {item.employee
                            ?.user
                            ?.name ||
                            "Unknown"}
                        </p>

                        <p className="
                          text-xs
                          text-[#64748B]
                          mt-1
                        ">
                          {item.employee
                            ?.user
                            ?.email ||
                            "-"}
                        </p>

                      </td>

                      <td className="
                        px-5
                        py-4
                        text-sm
                        text-[#64748B]
                      ">
                        {item.employee
                          ?.employeeCode ||
                          "-"}
                      </td>

                      <td className="
                        px-5
                        py-4
                        text-sm
                        text-[#64748B]
                      ">
                        {item.employee
                          ?.department
                          ?.name ||
                          "-"}
                      </td>

                      <td className="
                        px-5
                        py-4
                        text-sm
                        text-[#64748B]
                      ">
                        {item.employee
                          ?.designation
                          ?.name ||
                          "-"}
                      </td>

                      <td className="
                        px-5
                        py-4
                        text-sm
                        font-semibold
                        text-[#0F172A]
                      ">
                        {formatTime(
                          item.checkIn
                        )}
                      </td>

                      <td className="
                        px-5
                        py-4
                        text-sm
                        font-semibold
                        text-[#0F172A]
                      ">
                        {formatTime(
                          item.checkOut
                        )}
                      </td>

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={
                            item.status
                          }
                        />

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE */}

          <div className="
            lg:hidden
            divide-y
            divide-[#E2E8F0]
          ">

            {attendance.map(
              (item) => (
                <div
                  key={item.id}
                  className="p-5"
                >

                  <div className="
                    flex
                    justify-between
                    gap-3
                    mb-4
                  ">

                    <div>

                      <p className="
                        font-semibold
                        text-[#0F172A]
                      ">
                        {item.employee
                          ?.user
                          ?.name ||
                          "Unknown"}
                      </p>

                      <p className="
                        text-xs
                        text-[#64748B]
                        mt-1
                      ">
                        {item.employee
                          ?.employeeCode ||
                          "-"}
                      </p>

                    </div>

                    <StatusBadge
                      status={
                        item.status
                      }
                    />

                  </div>

                  <div className="
                    grid
                    grid-cols-2
                    gap-4
                  ">

                    <InfoItem
                      label="Department"
                      value={
                        item.employee
                          ?.department
                          ?.name ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Designation"
                      value={
                        item.employee
                          ?.designation
                          ?.name ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Check In"
                      value={formatTime(
                        item.checkIn
                      )}
                    />

                    <InfoItem
                      label="Check Out"
                      value={formatTime(
                        item.checkOut
                      )}
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </>
      )}
    </div>
  );
}

/* ==================================================
   SIMPLE EMPLOYEE TABLE
================================================== */

function SimpleAttendanceTable({
  attendance,
  loading,
}) {
  if (loading) {
    return <LoadingBox />;
  }

  if (attendance.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="
      bg-white
      border
      border-[#E2E8F0]
      rounded-2xl
      overflow-hidden
      shadow-sm
    ">

      <div className="
        px-5
        py-4
        border-b
        border-[#E2E8F0]
      ">

        <h2 className="
          font-semibold
          text-[#0F172A]
        ">
          My Attendance
        </h2>

      </div>

      <div className="
        divide-y
        divide-[#E2E8F0]
      ">

        {attendance.map(
          (item) => (
            <div
              key={item.id}
              className="
                p-5
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div>

                <p className="
                  text-sm
                  font-medium
                  text-[#0F172A]
                ">
                  {formatDate(
                    item.date
                  )}
                </p>

                <div className="
                  flex
                  gap-5
                  mt-2
                ">

                  <InfoItem
                    label="Check In"
                    value={formatTime(
                      item.checkIn
                    )}
                  />

                  <InfoItem
                    label="Check Out"
                    value={formatTime(
                      item.checkOut
                    )}
                  />

                </div>

              </div>

              <StatusBadge
                status={
                  item.status
                }
              />

            </div>
          )
        )}

      </div>
    </div>
  );
}

/* ==================================================
   STAT CARD
================================================== */

function StatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="
      bg-white
      border
      border-[#E2E8F0]
      rounded-2xl
      p-5
      shadow-sm
    ">

      <p className="
        text-sm
        text-[#64748B]
      ">
        {title}
      </p>

      <p className="
        text-2xl
        font-bold
        text-[#0F172A]
        mt-2
      ">
        {value}
      </p>

      <p className="
        text-xs
        text-[#64748B]
        mt-1
      ">
        {subtitle}
      </p>

    </div>
  );
}

/* ==================================================
   STATUS BADGE
================================================== */

function StatusBadge({
  status,
}) {
  const normalized =
    status?.toUpperCase() ||
    "UNKNOWN";

  let className =
    "bg-[#F8FAFC] text-[#64748B]";

  if (normalized === "PRESENT") {
    className =
      "bg-[#10B981]/10 text-[#10B981]";
  }

  if (normalized === "ABSENT") {
    className =
      "bg-[#EF4444]/10 text-[#EF4444]";
  }

  if (normalized === "LATE") {
    className =
      "bg-[#F59E0B]/10 text-[#F59E0B]";
  }

  return (
    <span className={`
      inline-flex
      px-2.5
      py-1
      rounded-full
      text-xs
      font-semibold
      ${className}
    `}>
      {normalized}
    </span>
  );
}

/* ==================================================
   INFO
================================================== */

function InfoItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="
        text-[10px]
        uppercase
        tracking-wide
        text-[#64748B]
      ">
        {label}
      </p>

      <p className="
        text-sm
        font-medium
        text-[#0F172A]
        mt-1
      ">
        {value}
      </p>

    </div>
  );
}

/* ==================================================
   FORMAT TIME
================================================== */

function formatTime(value) {
  if (!value) {
    return "--:--";
  }

  return new Date(
    value
  ).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );
}

/* ==================================================
   FORMAT DATE
================================================== */

function formatDate(value) {
  if (!value) {
    return "-";
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    const [
      year,
      month,
      day,
    ] = value.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return new Date(
    value
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* ==================================================
   LOADING BOX
================================================== */

function LoadingBox() {
  return (
    <div className="
      py-16
      flex
      justify-center
    ">

      <div className="text-center">

        <div className="
          w-8
          h-8
          border-4
          border-[#2563EB]
          border-t-transparent
          rounded-full
          animate-spin
          mx-auto
        " />

        <p className="
          mt-3
          text-sm
          text-[#64748B]
        ">
          Loading attendance...
        </p>

      </div>

    </div>
  );
}

/* ==================================================
   EMPTY
================================================== */

function EmptyState() {
  return (
    <div className="
      py-16
      text-center
      px-5
    ">

      <div className="
        w-12
        h-12
        rounded-full
        bg-[#F8FAFC]
        flex
        items-center
        justify-center
        mx-auto
      ">
        📅
      </div>

      <h3 className="
        text-sm
        font-semibold
        text-[#0F172A]
        mt-4
      ">
        No attendance records
      </h3>

      <p className="
        text-sm
        text-[#64748B]
        mt-1
      ">
        No attendance was recorded
        for this date.
      </p>

    </div>
  );
}