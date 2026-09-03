import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // =========================
  // Fetch Users
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setError("Please login as an admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/users/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users || []);
      setError("");
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Update User Role
  // =========================

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole) {
      return;
    }

    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.put(
        `http://localhost:5000/api/users/admin/${selectedUser._id}/role`,
        {
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedUser(null);
      setSelectedRole("");

      await fetchUsers();

      alert("User role updated successfully.");
    } catch (error) {
      console.error("Failed to update role:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update user role."
      );
    }
  };

  // =========================
  // Delete User
  // =========================

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.delete(
        `http://localhost:5000/api/users/admin/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (item) => item._id !== user._id
        )
      );

      if (selectedUser?._id === user._id) {
        setSelectedUser(null);
        setSelectedRole("");
      }

      alert("User deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  // =========================
  // Filter Users
  // =========================

  const filteredUsers = users.filter((user) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      user.name
        ?.toLowerCase()
        .includes(searchText) ||
      user.email
        ?.toLowerCase()
        .includes(searchText) ||
      user.phone
        ?.toLowerCase()
        .includes(searchText) ||
      user.location
        ?.toLowerCase()
        .includes(searchText);

    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-xl p-5 sm:p-8 text-center max-w-md w-full shadow-sm">
          <div className="text-4xl sm:text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Unable to Load Users
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-2 break-words">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchUsers}
            className="
              mt-5
              w-full
              sm:w-auto
              px-5
              py-2.5
              bg-blue-600
              text-white
              text-sm
              sm:text-base
              rounded-lg
              hover:bg-blue-700
              transition
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">
      {/* =========================
          Page Header
      ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manage Users
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            View and manage all FixNear users.
          </p>
        </div>

        <div
          className="
            w-full
            sm:w-auto
            px-4
            py-2.5
            bg-blue-50
            text-blue-600
            rounded-lg
            font-medium
            text-sm
            text-center
            whitespace-nowrap
          "
        >
          Total Users: {users.length}
        </div>
      </div>

      {/* =========================
          Search & Filter
      ========================= */}

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, email or phone..."
              className="
                w-full
                px-3
                sm:px-4
                py-2.5
                sm:py-3
                text-sm
                sm:text-base
                border
                border-gray-300
                rounded-lg
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
              "
            />
          </div>

          {/* Role Filter */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="
                w-full
                px-3
                sm:px-4
                py-2.5
                sm:py-3
                text-sm
                sm:text-base
                border
                border-gray-300
                rounded-lg
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                bg-white
              "
            >
              <option value="all">
                All Roles
              </option>

              <option value="user">
                Users
              </option>

              <option value="professional">
                Professionals
              </option>

              <option value="admin">
                Admins
              </option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {users.length}
            </span>{" "}
            users
          </p>

          {(search || roleFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 text-left"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* =========================
          Users Table
      ========================= */}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            All Users
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage accounts and user roles.
          </p>
        </div>

        {/* Horizontal Scroll Only Inside Table */}

        <div className="w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  User
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Phone
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Location
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Role
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Joined
                </th>

                <th className="text-right px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center"
                  >
                    <div className="text-4xl mb-3">
                      👥
                    </div>

                    <p className="text-sm sm:text-base text-gray-500">
                      No users found.
                    </p>

                    {(search ||
                      roleFilter !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setRoleFilter("all");
                        }}
                        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* User */}

                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3 min-w-[230px]">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold shrink-0">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base text-gray-800 truncate max-w-[180px]">
                            {user.name ||
                              "Unnamed User"}
                          </p>

                          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[210px]">
                            {user.email ||
                              "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}

                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      <span className="whitespace-nowrap">
                        {user.phone ||
                          "Not provided"}
                      </span>
                    </td>

                    {/* Location */}

                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      <span className="break-words">
                        {user.location ||
                          "Not provided"}
                      </span>
                    </td>

                    {/* Role */}

                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`
                          inline-flex
                          px-2.5
                          sm:px-3
                          py-1
                          rounded-full
                          text-[10px]
                          sm:text-xs
                          font-medium
                          capitalize
                          whitespace-nowrap
                          ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : user.role ===
                                "professional"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        `}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    {/* Joined */}

                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      <span className="whitespace-nowrap">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-2 min-w-[170px]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setSelectedRole(
                              user.role
                            );
                          }}
                          className="
                            min-h-10
                            px-3
                            py-2
                            text-xs
                            sm:text-sm
                            bg-blue-50
                            text-blue-600
                            rounded-lg
                            hover:bg-blue-100
                            transition
                            whitespace-nowrap
                          "
                        >
                          Edit Role
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteUser(user)
                          }
                          className="
                            min-h-10
                            px-3
                            py-2
                            text-xs
                            sm:text-sm
                            bg-red-50
                            text-red-600
                            rounded-lg
                            hover:bg-red-100
                            transition
                            whitespace-nowrap
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Scroll Hint */}

        {filteredUsers.length > 0 && (
          <div className="lg:hidden px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              ← Swipe left/right to view table →
            </p>
          </div>
        )}
      </div>

      {/* =========================
          Edit Role Modal
      ========================= */}

      {selectedUser && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            flex
            items-center
            justify-center
            p-3
            sm:p-4
          "
          onClick={() => {
            setSelectedUser(null);
            setSelectedRole("");
          }}
        >
          <div
            className="
              bg-white
              rounded-xl
              shadow-xl
              w-full
              max-w-md
              max-h-[90vh]
              overflow-y-auto
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-gray-200">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Change User Role
                </h2>

                <p className="text-sm text-gray-500 mt-1 truncate">
                  {selectedUser.name}
                </p>

                <p className="text-xs text-gray-400 mt-0.5 break-all">
                  {selectedUser.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedRole("");
                }}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  shrink-0
                  rounded-full
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-600
                  transition
                "
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}

            <div className="p-4 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>

              <select
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(
                    event.target.value
                  )
                }
                className="
                  w-full
                  px-3
                  sm:px-4
                  py-2.5
                  sm:py-3
                  text-sm
                  sm:text-base
                  border
                  border-gray-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  bg-white
                "
              >
                <option value="user">
                  User
                </option>

                <option value="professional">
                  Professional
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-700 leading-relaxed">
                  Changing a user's role may
                  change the areas of FixNear
                  they can access.
                </p>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedRole("");
                }}
                className="
                  w-full
                  sm:w-auto
                  px-4
                  py-2.5
                  border
                  border-gray-300
                  text-gray-700
                  text-sm
                  sm:text-base
                  rounded-lg
                  hover:bg-gray-50
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRoleUpdate}
                className="
                  w-full
                  sm:w-auto
                  px-4
                  py-2.5
                  bg-blue-600
                  text-white
                  text-sm
                  sm:text-base
                  rounded-lg
                  hover:bg-blue-700
                  transition
                "
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;