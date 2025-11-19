import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchClients } from "../../features/UserSlice";
import {
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
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export default function AdminClientsPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.users.clients);
  const { deleteUserStatus } = useSelector((state) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    client: null,
  });

  const [searchedClient, setSearchedClient] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const clientNameParams = searchParams.get("client_name") || "";

  useEffect(() => {
    setSearchedClient(clientNameParams);
  }, []);

  useEffect(() => {
    const filters = {};
    if (clientNameParams) filters.client_name = clientNameParams;
    filters.page = currentPage;
    dispatch(fetchClients(filters));
  }, [dispatch, currentPage, clientNameParams]);

  const handleFilters = () => {
    const params = {};
    if (searchedClient) params.client_name = searchedClient;

    params.page = 1;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchedClient("");
    setCurrentPage(1);
    setSearchParams({ page: 1 });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.last_page) {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(deleteModal.client.id)).unwrap();
      setDeleteModal({ open: false, client: null });
      toast.success("Client Deleted Successfully");

      dispatch(fetchClients());
    } catch (error) {
      console.log("Error :", error);
      setDeleteModal({ open: true });

      toast.error("Request Failed");
    }
  };

  const viewDetails = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const openDeleteModal = (client) => {
    setDeleteModal({ open: true, client });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, client: null });
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
              Clients Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor all service clients on the platform
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-[#2ECC71]" />
              <h2 className="text-lg font-semibold text-[#2C3E50]">
                Filter Clients
              </h2>
            </div>

            <div className="grid grid-cols-1">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                  Search by Client Name
                </label>
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Enter client name..."
                    value={searchedClient}
                    onChange={(e) => setSearchedClient(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                  />
                </div>
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

          <div className="mb-5">
            <p className="text-3xl font-bold text-[#2C3E50]">
              Total Clients : {data?.total}
            </p>
          </div>

          {/* Clients Table */}
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data?.map((client) => {
                    return (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: "#2ECC71" }}
                            >
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <p
                              className="font-semibold"
                              style={{ color: "#2C3E50" }}
                            >
                              {client.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={16} style={{ color: "#2ECC71" }} />
                            {client.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} style={{ color: "#2ECC71" }} />
                            {client.phone}
                          </div>
                        </td>
                        <td className="flex gap-2 px-6 py-4">
                          <button
                            onClick={() => viewDetails(client)}
                            className="px-3 py-2 text-sm bg-[#3498DB] text-white rounded-lg transition-colors flex items-center gap-2 hover:bg-[#2980B9]"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => openDeleteModal(client)}
                            className="flex items-center gap-2 p-2 rounded-lg transition-colors bg-[#E74C3C] hover:bg-[#C0392B] text-white"
                          >
                            <Trash2 size={16} />
                            <p>Delete</p>
                          </button>
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

      {/* Client Details Modal */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: "#2C3E50" }}>
                Client Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Client Info */}
              <div
                className="flex items-center gap-4 mb-6 pb-6 border-b"
                style={{ borderColor: "#ECF0F1" }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  style={{ backgroundColor: "#2ECC71" }}
                >
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4
                    className="text-2xl font-bold"
                    style={{ color: "#2C3E50" }}
                  >
                    {selectedClient.name}
                  </h4>
                  <p className="text-gray-600">
                    Client ID: #{selectedClient.id}
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
                      {selectedClient.email}
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
                      {selectedClient.phone}
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
                      {selectedClient.address}
                    </p>
                  </div>
                </div>
              </div>
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
                  Delete Client
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <strong>"{deleteModal.client?.name}"</strong>? but you can
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
                  "Delete Client"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
