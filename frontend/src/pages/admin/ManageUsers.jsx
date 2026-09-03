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
        `${import.meta.env.VITE_API_URL}/users/admin/all`,
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
        error.response?.data?.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole) {
      return;
    }

    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/admin/${selectedUser._id}/role`,
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
        `${import.meta.env.VITE_API_URL}/users/admin/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((previousUsers) =>
        previousUsers.filter((item) => item._id !== user._id)
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

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.phone?.toLowerCase().includes(searchText) ||
      user.location?.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return "bg-purple-100 text-purple-700";
    }

    if (role === "professional") {
      return "bg-green-100 text-green-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-8 text-center max-w-md w-full shadow-sm">
          <div className="text-3xl sm:text-5xl mb-3 sm:mb-4">
            ⚠️
          </div>

          <h2 className="text-base sm:text-xl font-bold text-gray-800">
            Unable to Load Users
          </h2>

          <p className="text-xs sm:text-base text-gray-600 mt-2 break-words">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchUsers}
            className="mt-4 sm:mt-5 w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-3 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800 truncate">
            Manage Users
          </h1>

          <p className="text-[10px] sm:text-base text-gray-500 mt-0.5 sm:mt-1 truncate">
            View and manage all FixNear users.
          </p>
        </div>

        <div className="shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium text-[10px] sm:text-sm whitespace-nowrap">
          Total: {users.length}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
          <div>
            <label className="block text-[9px] sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Search Users
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full px-2.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[9px] sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Filter by Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full px-2.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="professional">Professionals</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-2.5 sm:mt-4 pt-2.5 sm:pt-4 border-t border-gray-100">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {users.length}
            </span>
          </p>

          {(search || roleFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="text-[10px] sm:text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
            All Users
          </h2>

          <p className="text-[9px] sm:text-sm text-gray-500 mt-0.5">
            Manage accounts and user roles.
          </p>
        </div>

        <div className="lg:hidden p-2.5 space-y-2.5">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-3xl mb-2">
                👥
              </div>

              <p className="text-xs text-gray-500">
                No users found.
              </p>

              {(search || roleFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                  }}
                  className="mt-2 text-xs font-medium text-blue-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="border border-gray-200 rounded-lg p-2.5 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold shrink-0 text-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="text-[9px] text-gray-500 truncate mt-0.5">
                          {user.email || "No email"}
                        </p>
                      </div>

                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium capitalize shrink-0 ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role || "user"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      Phone
                    </p>

                    <p className="text-[10px] text-gray-700 mt-0.5 truncate">
                      {user.phone || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      Location
                    </p>

                    <p className="text-[10px] text-gray-700 mt-0.5 truncate">
                      {user.location || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      Joined
                    </p>

                    <p className="text-[10px] text-gray-700 mt-0.5">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      User ID
                    </p>

                    <p className="text-[9px] text-gray-500 mt-0.5 truncate">
                      {user._id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedRole(user.role);
                    }}
                    className="px-2 py-1.5 text-[9px] font-medium bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                  >
                    Edit Role
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user)}
                    className="px-2 py-1.5 text-[9px] font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  User
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Phone
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Location
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Role
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Joined
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-4xl mb-3">
                      👥
                    </div>

                    <p className="text-sm text-gray-500">
                      No users found.
                    </p>

                    {(search || roleFilter !== "all") && (
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold shrink-0">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate max-w-[180px]">
                            {user.name || "Unnamed User"}
                          </p>

                          <p className="text-xs text-gray-500 truncate max-w-[210px]">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone || "Not provided"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.location || "Not provided"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setSelectedRole(user.role);
                          }}
                          className="px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition whitespace-nowrap"
                        >
                          Edit Role
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          className="px-3 py-2 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition whitespace-nowrap"
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

        <div className="px-3 sm:px-5 py-2.5 border-t border-gray-100 bg-gray-50">
          <p className="text-[9px] sm:text-xs text-gray-500 text-center">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2.5 sm:p-4"
          onClick={() => {
            setSelectedUser(null);
            setSelectedRole("");
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-3 sm:p-6 border-b border-gray-200">
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-gray-800">
                  Change User Role
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                  {selectedUser.name}
                </p>

                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 break-all">
                  {selectedUser.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedRole("");
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-3 sm:p-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>

              <select
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(event.target.value)
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="user">User</option>
                <option value="professional">
                  Professional
                </option>
                <option value="admin">Admin</option>
              </select>

              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-[10px] sm:text-xs text-yellow-700 leading-relaxed">
                  Changing a user's role may change the areas of
                  FixNear they can access.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-3 sm:p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedRole("");
                }}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRoleUpdate}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition"
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