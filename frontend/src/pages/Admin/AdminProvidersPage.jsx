import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  fetchClients,
  fetchProviders,
  forceDeleteUser,
  restoreUser,
  updateStatusProvider,
} from "../../features/UserSlice";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  CheckCircle,
  XCircle,
  Edit,
  ShoppingBag,
  X,
  Loader2,
  Filter,
  Search,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export default function AdminProvidersPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.users.providers);
  const {
    updateStatusProvider_Status,
    deleteUserStatus,
    restoreUserStatus,
    forceDeleteUserStatus,
  } = useSelector((state) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showStatusConfirme, setShowStatusConfirme] = useState({
    open: false,
    provider: {},
    status: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    provider: null,
  });
  const [restoreModal, setRestoreModal] = useState({
    open: false,
    provider: null,
  });
  const [forceDeleteModal, setForceDeleteModal] = useState({
    open: false,
    provider: null,
  });

  const [searchedProvider, setSearchedProvider] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const providerNameParams = searchParams.get("provider_name") || "";
  const statusParams = searchParams.get("status") || "";

  useEffect(() => {
    setSearchedProvider(providerNameParams);
    setSelectedStatus(statusParams);
  }, []);

  useEffect(() => {
    const filters = {};
    if (providerNameParams) filters.provider_name = providerNameParams;
    if (statusParams) filters.status = statusParams;
    filters.page = currentPage;
    dispatch(fetchProviders(filters));
  }, [dispatch, currentPage, providerNameParams, statusParams]);

  const handleFilters = () => {
    const params = {};
    if (searchedProvider) params.provider_name = searchedProvider;
    if (selectedStatus) params.status = selectedStatus;

    params.page = 1;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchedProvider("");
    setSelectedStatus("");
    setCurrentPage(1);
    setSearchParams({ page: 1 });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.last_page) {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusConfirm = async () => {
    try {
      const provider_id = showStatusConfirme.provider.id;
      const status = showStatusConfirme.status;

      await dispatch(updateStatusProvider({ status, provider_id })).unwrap();
      setShowStatusConfirme({ open: false, provider: {}, status: "" });
      setShowModal(false);

      await dispatch(fetchProviders());
      toast.success("Status Changed Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error :", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(deleteModal.provider.id)).unwrap();
      setDeleteModal({ open: false, provider: null });
      toast.success("Provider Deleted Successfully");

      dispatch(fetchProviders());
    } catch (error) {
      console.log("Error :", error);
      setDeleteModal({ open: true });

      toast.error("Request Failed");
    }
  };

  const handleRestore = async () => {
    try {
      await dispatch(restoreUser(restoreModal.provider.id)).unwrap();
      setRestoreModal({ open: false, provider: null });
      toast.success("Provider Restored Successfully");

      dispatch(fetchProviders());
    } catch (error) {
      console.log("Error :", error);
      setRestoreModal({ open: true });

      toast.error("Request Failed");
    }
  };

  const handleForceDelete = async () => {
    try {
      await dispatch(forceDeleteUser(forceDeleteModal.provider.id)).unwrap();
      setForceDeleteModal({ open: false, provider: null });
      toast.success("Provider Force Deleted Successfully");

      dispatch(fetchProviders());
    } catch (error) {
      console.log("Error :", error);
      setForceDeleteModal({ open: true });

      toast.error("Request Failed");
    }
  };

  const handleChangeStatus = (provider, newStatus) => {
    setShowStatusConfirme({
      open: true,
      provider,
      status: newStatus,
    });
  };

  const cancelleChangeStatus = () => {
    setShowStatusConfirme({
      open: false,
      provider: {},
      status: "",
    });
  };

  const viewDetails = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const openDeleteModal = (provider) => {
    setDeleteModal({ open: true, provider });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, provider: null });
  };

  const openRestoreModal = (provider) => {
    setRestoreModal({ open: true, provider });
  };

  const closeRestoreModal = () => {
    setRestoreModal({ open: false, provider: null });
  };

  const openForceDeleteModal = (provider) => {
    setForceDeleteModal({ open: true, provider });
  };

  const closeForceDeleteModal = () => {
    setForceDeleteModal({ open: false, provider: null });
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "#2ECC71",
      rejected: "#E74C3C",
      pending: "#E67E22",
    };
    return colors[status] || "#95A5A6";
  };

  const getStatusIcon = (status) => {
    const icons = {
      approved: CheckCircle,
      rejected: XCircle,
      pending: Edit,
    };
    return icons[status] || Edit;
  };

  const getStatusCount = (status) => {
    if (status === "all") return data?.data?.length;
    return data?.data?.filter((provider) => provider.status === status).length;
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]" />
      </div>
    );
  }

  return (
    <>
      <div
        style={{ backgroundColor: "#ECF0F1" }}
        className="min-h-screen p-4 lg:p-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#2C3E50" }}
            >
              Providers Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor all service providers on the platform
            </p>
          </div>

          {/* Statistics Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(46, 204, 113, 0.1)" }}
                >
                  <ShoppingBag size={24} style={{ color: "#2ECC71" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Providers</h3>
              <p className="text-3xl font-bold" style={{ color: "#2C3E50" }}>
                {getStatusCount("all")}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(46, 204, 113, 0.1)" }}
                >
                  <CheckCircle size={24} style={{ color: "#2ECC71" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Approved Providers</h3>
              <p className="text-3xl font-bold" style={{ color: "#2ECC71" }}>
                {getStatusCount("approved")}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(230, 126, 34, 0.1)" }}
                >
                  <Edit size={24} style={{ color: "#E67E22" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Pending Providers</h3>
              <p className="text-3xl font-bold" style={{ color: "#E67E22" }}>
                {getStatusCount("pending")}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(231, 76, 60, 0.1)" }}
                >
                  <XCircle size={24} style={{ color: "#E74C3C" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Rejected Providers</h3>
              <p className="text-3xl font-bold" style={{ color: "#E74C3C" }}>
                {getStatusCount("rejected")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-[#2ECC71]" />
              <h2 className="text-lg font-semibold text-[#2C3E50]">
                Filter Providers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                  Search by Provider Name
                </label>
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Enter provider name..."
                    value={searchedProvider}
                    onChange={(e) => setSearchedProvider(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                  />
                </div>
              </div>

              {/* Filter by Status */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={handleFilters}
                className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-[#ECF0F1] text-[#2C3E50] rounded-lg font-semibold hover:bg-[#BDC3C7] transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Providers Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#2C3E50" }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data?.map((provider) => {
                    const StatusIcon = getStatusIcon(provider.status);
                    return (
                      <tr key={provider.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: "#2ECC71" }}
                            >
                              {provider.name.charAt(0).toUpperCase()}
                            </div> */}
                            <p
                              className="font-semibold"
                              style={{ color: "#2C3E50" }}
                            >
                              {provider.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={16} style={{ color: "#2ECC71" }} />
                            {provider.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} style={{ color: "#2ECC71" }} />
                            {provider.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white justify-center"
                              style={{
                                backgroundColor: getStatusColor(
                                  provider.status
                                ),
                              }}
                            >
                              <StatusIcon size={12} />
                              {provider.status.charAt(0).toUpperCase() +
                                provider.status.slice(1)}
                            </span>

                            {provider.status === "pending" && (
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    handleChangeStatus(provider, "approved")
                                  }
                                  className="px-2 py-1 text-xs text-white rounded transition-colors"
                                  style={{ backgroundColor: "#2ECC71" }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleChangeStatus(provider, "rejected")
                                  }
                                  className="px-2 py-1 text-xs text-white rounded transition-colors"
                                  style={{ backgroundColor: "#E74C3C" }}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {provider.status === "approved" && (
                              <button
                                onClick={() =>
                                  handleChangeStatus(provider, "rejected")
                                }
                                className="px-2 py-1 text-xs text-white rounded transition-colors"
                                style={{ backgroundColor: "#E74C3C" }}
                              >
                                Reject
                              </button>
                            )}
                            {provider.status === "rejected" && (
                              <button
                                onClick={() =>
                                  handleChangeStatus(provider, "approved")
                                }
                                className="px-2 py-1 text-xs text-white rounded transition-colors"
                                style={{ backgroundColor: "#2ECC71" }}
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="flex gap-2 px-6 py-4">
                          <button
                            onClick={() => viewDetails(provider)}
                            className="px-3 py-2 text-sm bg-[#3498DB] text-white rounded-lg transition-colors flex items-center gap-2 hover:bg-[#2980B9]"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          {provider.deleted_at ? (
                            <>
                              <button
                                onClick={() => openRestoreModal(provider)}
                                className="flex items-center gap-2 p-2 rounded-lg transition-colors bg-[#ffc300] hover:bg-[#ee9b00] text-white"
                              >
                                <RefreshCcw size={16} />
                                <p>Restore</p>
                              </button>
                              <button
                                onClick={() => openForceDeleteModal(provider)}
                                className="flex items-center gap-2 p-2 rounded-lg transition-colors bg-[#E74C3C] hover:bg-[#C0392B] text-white"
                              >
                                <Trash2 size={16} />
                                <p>Force Delete</p>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => openDeleteModal(provider)}
                                className="flex items-center gap-2 p-2 rounded-lg transition-colors bg-[#E74C3C] hover:bg-[#C0392B] text-white"
                              >
                                <Trash2 size={16} />
                                <p>Delete</p>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!data?.prev_page_url}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  !data?.prev_page_url
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-[#2C3E50] text-white"
                }`}
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <p className="text-sm text-gray-600">
                Page {data?.current_page} of {data?.last_page}
              </p>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!data?.next_page_url}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  !data?.next_page_url
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-[#2C3E50] text-white"
                }`}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Details Modal */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: "#2C3E50" }}>
                Provider Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Provider Info */}
              <div
                className="flex items-center gap-4 mb-6 pb-6 border-b"
                style={{ borderColor: "#ECF0F1" }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  style={{ backgroundColor: "#2ECC71" }}
                >
                  {selectedProvider.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4
                    className="text-2xl font-bold"
                    style={{ color: "#2C3E50" }}
                  >
                    {selectedProvider.name}
                  </h4>
                  <p className="text-gray-600">
                    Provider ID: #{selectedProvider.id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail
                    size={20}
                    style={{ color: "#2ECC71" }}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold" style={{ color: "#2C3E50" }}>
                      {selectedProvider.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={20}
                    style={{ color: "#2ECC71" }}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-semibold" style={{ color: "#2C3E50" }}>
                      {selectedProvider.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    style={{ color: "#2ECC71" }}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-semibold" style={{ color: "#2C3E50" }}>
                      {selectedProvider.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase
                    size={20}
                    style={{ color: "#2ECC71" }}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Service</p>
                    <p className="font-semibold" style={{ color: "#2C3E50" }}>
                      {selectedProvider?.service?.title ||
                        "Don't have service yet"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{
                      backgroundColor: getStatusColor(selectedProvider.status),
                    }}
                  >
                    {React.createElement(
                      getStatusIcon(selectedProvider.status),
                      { size: 16 }
                    )}
                    {selectedProvider.status.charAt(0).toUpperCase() +
                      selectedProvider.status.slice(1)}
                  </span>
                </div>
              </div>

              {selectedProvider.status === "pending" && (
                <div className="mt-6 pt-6 border-t flex gap-3">
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedProvider, "approved");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#2ECC71" }}
                  >
                    Approve Provider
                  </button>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedProvider, "rejected");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#E74C3C" }}
                  >
                    Reject Provider
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showStatusConfirme.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#2C3E50]">
                Confirm Change Status
              </h2>
              <button
                onClick={() => cancelleChangeStatus()}
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="mb-6">
              Are you sure you want to{" "}
              <strong>{showStatusConfirme.status}</strong> this provider{" "}
              <strong>{showStatusConfirme?.provider?.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleStatusConfirm}
                disabled={updateStatusProvider_Status === "loading"}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateStatusProvider_Status == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Status Provider Changing ...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#E74C3C]/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-[#E74C3C]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#2C3E50]">
                  Delete Provider
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <strong>"{deleteModal.provider?.name}"</strong>? but you can
                  restore him later
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleteUserStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#ECF0F1] text-[#2C3E50] hover:bg-[#BDC3C7] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteUserStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors bg-[#E74C3C] hover:bg-[#C0392B] disabled:opacity-50"
              >
                {deleteUserStatus == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Deleting...
                  </span>
                ) : (
                  "Delete Provider"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {restoreModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#ffc300]/10 flex items-center justify-center flex-shrink-0">
                <RefreshCcw size={24} className="text-[#ffc300]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#2C3E50]">
                  Restore Provider
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to restore{" "}
                  <strong>"{restoreModal.provider?.name}"</strong>?
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeRestoreModal}
                disabled={restoreUserStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#ECF0F1] text-[#2C3E50] hover:bg-[#BDC3C7] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={restoreUserStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors bg-[#ffc300] hover:bg-[#ee9b00] disabled:opacity-50"
              >
                {restoreUserStatus == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Restoring...
                  </span>
                ) : (
                  "Restore Provider"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {forceDeleteModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#E74C3C]/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-[#E74C3C]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#2C3E50]">
                  Force Delete Provider
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to force delete this{" "}
                  <strong>"{forceDeleteModal.provider?.name}"</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeForceDeleteModal}
                disabled={forceDeleteUserStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#ECF0F1] text-[#2C3E50] hover:bg-[#BDC3C7] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleForceDelete}
                disabled={forceDeleteUserStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors bg-[#E74C3C] hover:bg-[#C0392B] disabled:opacity-50"
              >
                {forceDeleteUserStatus == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Force Deleting...
                  </span>
                ) : (
                  "Force Delete Provider"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
