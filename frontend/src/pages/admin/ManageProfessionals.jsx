import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setError("Please login as an admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/professionals/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfessionals(response.data.professionals || []);
      setError("");
    } catch (error) {
      console.error("Failed to fetch professionals:", error);

      setError(
        error.response?.data?.message || "Failed to load professionals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleVerify = async (professional) => {
    const confirmed = window.confirm(
      `Verify ${professional.name} as a professional?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/professionals/admin/${professional._id}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProfessionals();

      alert("Professional verified successfully.");
    } catch (error) {
      console.error("Failed to verify professional:", error);

      alert(
        error.response?.data?.message || "Failed to verify professional."
      );
    }
  };

  const handleUnverify = async (professional) => {
    const confirmed = window.confirm(
      `Remove verification from ${professional.name}?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/professionals/admin/${professional._id}/unverify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProfessionals();

      alert("Professional verification removed.");
    } catch (error) {
      console.error("Failed to remove verification:", error);

      alert(
        error.response?.data?.message || "Failed to update verification."
      );
    }
  };

  const handleToggleAvailability = async (professional) => {
    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/professionals/admin/${professional._id}/availability`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProfessionals();
    } catch (error) {
      console.error("Failed to update availability:", error);

      alert(
        error.response?.data?.message || "Failed to update availability."
      );
    }
  };

  const handleDelete = async (professional) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${professional.name}'s professional profile?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/professionals/admin/${professional._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfessionals((previous) =>
        previous.filter((item) => item._id !== professional._id)
      );

      if (selectedProfessional?._id === professional._id) {
        setSelectedProfessional(null);
      }

      alert("Professional deleted successfully.");
    } catch (error) {
      console.error("Failed to delete professional:", error);

      alert(
        error.response?.data?.message || "Failed to delete professional."
      );
    }
  };

  const filteredProfessionals = professionals.filter((professional) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      professional.name?.toLowerCase().includes(searchText) ||
      professional.email?.toLowerCase().includes(searchText) ||
      professional.profession?.toLowerCase().includes(searchText) ||
      professional.city?.toLowerCase().includes(searchText);

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && professional.isVerified) ||
      (verificationFilter === "unverified" && !professional.isVerified);

    return matchesSearch && matchesVerification;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-xs sm:text-base text-gray-600">
            Loading professionals...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-8 text-center max-w-md w-full shadow-sm">
          <div className="text-3xl sm:text-5xl mb-3">⚠️</div>

          <h2 className="text-base sm:text-xl font-bold text-gray-800">
            Unable to Load Professionals
          </h2>

          <p className="text-xs sm:text-base text-gray-600 mt-2 break-words">
            {error}
          </p>

          <button
            onClick={fetchProfessionals}
            className="mt-4 w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800 truncate">
            Manage Professionals
          </h1>

          <p className="text-[10px] sm:text-base text-gray-500 mt-0.5 sm:mt-1 truncate">
            Verify and manage FixNear service professionals.
          </p>
        </div>

        <div className="shrink-0 bg-blue-50 text-blue-600 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg font-medium text-[10px] sm:text-sm">
          Total: {professionals.length}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
          <div>
            <label className="block text-[9px] sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Search Professionals
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, profession, email or city..."
              className="w-full px-2.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[9px] sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Verification Status
            </label>

            <select
              value={verificationFilter}
              onChange={(event) =>
                setVerificationFilter(event.target.value)
              }
              className="w-full px-2.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Professionals</option>
              <option value="verified">Verified</option>
              <option value="unverified">Pending Verification</option>
            </select>
          </div>
        </div>

        <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredProfessionals.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {professionals.length}
            </span>
          </p>

          {(search || verificationFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setVerificationFilter("all");
              }}
              className="text-[10px] sm:text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
            Professionals
          </h2>

          <p className="text-[9px] sm:text-sm text-gray-500 mt-0.5">
            Review and manage registered service providers.
          </p>
        </div>

        <div className="lg:hidden p-2.5 space-y-2.5">
          {filteredProfessionals.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-3xl mb-2">👷</div>

              <p className="text-xs text-gray-500">
                No professionals found.
              </p>

              {(search || verificationFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setVerificationFilter("all");
                  }}
                  className="mt-2 text-xs text-blue-600 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredProfessionals.map((professional) => (
              <div
                key={professional._id}
                className="border border-gray-200 rounded-lg p-2.5 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  {professional.image ? (
                    <img
                      src={professional.image}
                      alt={professional.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold shrink-0 text-sm">
                      {professional.name?.charAt(0).toUpperCase() || "P"}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {professional.name || "Unknown"}
                        </p>

                        <p className="text-[9px] text-gray-500 truncate mt-0.5">
                          {professional.email || "No email"}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {professional.isVerified ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-green-100 text-green-700">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-yellow-100 text-yellow-700">
                            ⏳ Pending
                          </span>
                        )}

                        {professional.available ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-blue-100 text-blue-700">
                            Available
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-gray-100 text-gray-600">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      Profession
                    </p>

                    <p className="text-[10px] text-gray-700 mt-0.5 truncate">
                      {professional.profession || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      Location
                    </p>

                    <p className="text-[10px] text-gray-700 mt-0.5 truncate">
                      {professional.city ||
                        professional.location ||
                        "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      Price
                    </p>

                    <p className="text-[10px] font-semibold text-gray-800 mt-0.5">
                      ₹{professional.price || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase text-gray-400 font-medium">
                      Rating
                    </p>

                    <p className="text-[10px] text-gray-700 mt-0.5">
                      ⭐{" "}
                      {professional.rating
                        ? professional.rating.toFixed(1)
                        : "0.0"}{" "}
                      <span className="text-gray-400">
                        ({professional.reviews || 0})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                  <button
                    onClick={() =>
                      setSelectedProfessional(professional)
                    }
                    className="px-2 py-1.5 text-[9px] font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                  >
                    View
                  </button>

                  {!professional.isVerified ? (
                    <button
                      onClick={() => handleVerify(professional)}
                      className="px-2 py-1.5 text-[9px] font-medium bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition"
                    >
                      Verify
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnverify(professional)}
                      className="px-2 py-1.5 text-[9px] font-medium bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 transition"
                    >
                      Unverify
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleToggleAvailability(professional)
                    }
                    className={`px-2 py-1.5 text-[9px] font-medium rounded-md transition ${
                      professional.available
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {professional.available ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => handleDelete(professional)}
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
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Professional
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Profession
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Location
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Price
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Rating
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-4xl mb-3">👷</div>

                    <p className="text-sm text-gray-500">
                      No professionals found.
                    </p>

                    {(search || verificationFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setVerificationFilter("all");
                        }}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProfessionals.map((professional) => (
                  <tr
                    key={professional._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {professional.image ? (
                          <img
                            src={professional.image}
                            alt={professional.name}
                            className="w-11 h-11 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold shrink-0">
                            {professional.name?.charAt(0).toUpperCase() ||
                              "P"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate max-w-45">
                            {professional.name}
                          </p>

                          <p className="text-xs text-gray-500 truncate max-w-50">
                            {professional.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {professional.profession || "Not provided"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {professional.city ||
                        professional.location ||
                        "Not provided"}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      ₹{professional.price || 0}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className="text-yellow-500">⭐</span>

                        <span className="text-sm text-gray-700">
                          {professional.rating
                            ? professional.rating.toFixed(1)
                            : "0.0"}
                        </span>

                        <span className="text-xs text-gray-400">
                          ({professional.reviews || 0})
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {professional.isVerified ? (
                          <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            ⏳ Pending
                          </span>
                        )}

                        {professional.available ? (
                          <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            setSelectedProfessional(professional)
                          }
                          className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          View
                        </button>

                        {!professional.isVerified ? (
                          <button
                            onClick={() => handleVerify(professional)}
                            className="px-3 py-2 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                          >
                            Verify
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnverify(professional)}
                            className="px-3 py-2 text-xs bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                          >
                            Unverify
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleToggleAvailability(professional)
                          }
                          className={`px-3 py-2 text-xs rounded-lg transition ${
                            professional.available
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          }`}
                        >
                          {professional.available ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => handleDelete(professional)}
                          className="px-3 py-2 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
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
      </div>

      {selectedProfessional && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={() => setSelectedProfessional(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[94vh] overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-3 sm:p-6 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                {selectedProfessional.image ? (
                  <img
                    src={selectedProfessional.image}
                    alt={selectedProfessional.name}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-base sm:text-xl font-bold shrink-0">
                    {selectedProfessional.name?.charAt(0).toUpperCase() ||
                      "P"}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="text-sm sm:text-xl font-bold text-gray-800 truncate">
                    {selectedProfessional.name}
                  </h2>

                  <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 truncate">
                    {selectedProfessional.profession}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfessional(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-base sm:text-xl transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-3 sm:p-6 space-y-3 sm:space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-2.5 sm:p-4">
                    <p className="text-[9px] sm:text-xs text-gray-500">
                      Email
                    </p>

                    <p className="text-xs sm:text-sm text-gray-800 mt-1 break-all">
                      {selectedProfessional.email || "Not provided"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2.5 sm:p-4">
                    <p className="text-[9px] sm:text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                      {selectedProfessional.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Location
                </h3>

                <div className="bg-gray-50 rounded-lg p-2.5 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-800 break-words">
                    {selectedProfessional.address || "Address not provided"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                    {selectedProfessional.city || ""}
                    {selectedProfessional.state
                      ? `, ${selectedProfessional.state}`
                      : ""}
                    {selectedProfessional.pincode
                      ? ` - ${selectedProfessional.pincode}`
                      : ""}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Professional Details
                </h3>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-2.5 sm:p-4">
                    <p className="text-[9px] sm:text-xs text-gray-500">
                      Experience
                    </p>

                    <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                      {selectedProfessional.experience || "Not provided"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2.5 sm:p-4">
                    <p className="text-[9px] sm:text-xs text-gray-500">
                      Service Price
                    </p>

                    <p className="text-xs sm:text-sm text-gray-800 mt-1">
                      ₹{selectedProfessional.price || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedProfessional.skills?.length > 0 ? (
                    selectedProfessional.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-sm break-words"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500">
                      No skills provided.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Description
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 sm:p-4 break-words leading-relaxed">
                  {selectedProfessional.description ||
                    "No description provided."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Status
                </h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-sm ${
                      selectedProfessional.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedProfessional.isVerified
                      ? "✓ Verified"
                      : "⏳ Pending Verification"}
                  </span>

                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-sm ${
                      selectedProfessional.available
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedProfessional.available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-6 border-t border-gray-200 shrink-0">
              <button
                onClick={() => setSelectedProfessional(null)}
                className="w-full sm:w-auto sm:ml-auto block px-5 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProfessionals;