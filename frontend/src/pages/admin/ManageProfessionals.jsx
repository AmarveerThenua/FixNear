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

    if (!confirmed) {
      return;
    }

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

    if (!confirmed) {
      return;
    }

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

    if (!confirmed) {
      return;
    }

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
      <div className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading professionals...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white border border-red-200 rounded-xl p-5 sm:p-8 text-center max-w-md w-full shadow-sm">
          <div className="text-4xl sm:text-5xl mb-4">⚠️</div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Unable to Load Professionals
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-2 wrap-break-word">
            {error}
          </p>

          <button
            onClick={fetchProfessionals}
            className="mt-5 sm:mt-6 w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 wrap-break-word">
            Manage Professionals
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Verify and manage FixNear service professionals.
          </p>
        </div>

        <div className="w-full sm:w-fit bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base text-center sm:text-left">
          Total: {professionals.length}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Professionals
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, profession, email or city..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Status
            </label>

            <select
              value={verificationFilter}
              onChange={(event) =>
                setVerificationFilter(event.target.value)
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Professionals</option>
              <option value="verified">Verified</option>
              <option value="unverified">Pending Verification</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredProfessionals.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {professionals.length}
            </span>{" "}
            professionals
          </p>

          {(search || verificationFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setVerificationFilter("all");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium text-left xs:text-right"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Professionals
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Review and manage registered service providers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-250">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Professional
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Profession
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Location
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Price
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Rating
                </th>

                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-right px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-4xl mb-3">👷</div>

                    <p className="text-sm sm:text-base text-gray-500">
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
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3 min-w-55">
                        {professional.image ? (
                          <img
                            src={professional.image}
                            alt={professional.name}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold shrink-0">
                            {professional.name?.charAt(0).toUpperCase() ||
                              "P"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base text-gray-800 truncate max-w-45">
                            {professional.name}
                          </p>

                          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-50">
                            {professional.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      <span className="wrap-break-word">
                        {professional.profession || "Not provided"}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      <span className="wrap-break-word">
                        {professional.city ||
                          professional.location ||
                          "Not provided"}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-800">
                      ₹{professional.price || 0}
                    </td>

                    <td className="px-4 sm:px-6 py-4">
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

                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {professional.isVerified ? (
                          <span className="inline-flex w-fit px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex w-fit px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-700 whitespace-nowrap">
                            ⏳ Pending
                          </span>
                        )}

                        {professional.available ? (
                          <span className="inline-flex w-fit px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex w-fit px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-2 min-w-65">
                        <button
                          onClick={() =>
                            setSelectedProfessional(professional)
                          }
                          className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          View
                        </button>

                        {!professional.isVerified && (
                          <button
                            onClick={() => handleVerify(professional)}
                            className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                          >
                            Verify
                          </button>
                        )}

                        {professional.isVerified && (
                          <button
                            onClick={() => handleUnverify(professional)}
                            className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                          >
                            Unverify
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleToggleAvailability(professional)
                          }
                          className={`px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg transition ${
                            professional.available
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          }`}
                        >
                          {professional.available ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => handleDelete(professional)}
                          className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
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

        {filteredProfessionals.length > 0 && (
          <div className="lg:hidden px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              ← Swipe horizontally to view all columns →
            </p>
          </div>
        )}
      </div>

      {selectedProfessional && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50"
          onClick={() => setSelectedProfessional(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {selectedProfessional.image ? (
                  <img
                    src={selectedProfessional.image}
                    alt={selectedProfessional.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold shrink-0">
                    {selectedProfessional.name?.charAt(0).toUpperCase() ||
                      "P"}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                    {selectedProfessional.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                    {selectedProfessional.profession}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfessional(null)}
                className="w-9 h-9 flex items-center justify-center shrink-0 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-lg sm:text-xl transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-500">Email</p>

                    <p className="text-sm text-gray-800 mt-1 break-all">
                      {selectedProfessional.email || "Not provided"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-500">Phone</p>

                    <p className="text-sm text-gray-800 mt-1 wrap-break-word">
                      {selectedProfessional.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Location
                </h3>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <p className="text-sm text-gray-800 wrap-break-word">
                    {selectedProfessional.address || "Address not provided"}
                  </p>

                  <p className="text-sm text-gray-600 mt-1 wrap-break-word">
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
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Professional Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-500">Experience</p>

                    <p className="text-sm text-gray-800 mt-1 wrap-break-word">
                      {selectedProfessional.experience || "Not provided"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-500">Service Price</p>

                    <p className="text-sm text-gray-800 mt-1">
                      ₹{selectedProfessional.price || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedProfessional.skills?.length > 0 ? (
                    selectedProfessional.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm wrap-break-word"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skills provided.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Description
                </h3>

                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 sm:p-4 wrap-break-word leading-relaxed">
                  {selectedProfessional.description ||
                    "No description provided."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Status
                </h3>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
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
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
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

            <div className="p-4 sm:p-6 border-t border-gray-200 shrink-0">
              <button
                onClick={() => setSelectedProfessional(null)}
                className="w-full sm:w-auto sm:ml-auto block px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base"
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