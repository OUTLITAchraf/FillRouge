import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  DollarSign,
  User,
  Tag,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  updateStatusService,
} from "../../features/ServiceSlice";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusConfirme, setShowStatusConfirme] = useState({
    open: false,
    service: {},
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.services.services);
  const { updateStatusServiceStatus } = useSelector((state) => state.services);

  console.log(data);
  console.log(status);

  useEffect(() => {
    const filters = {};
    filters.page = currentPage;
    dispatch(fetchServices(filters));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.last_page) {
      setCurrentPage(page);
    }
  };

  const handleChangeStatus = (nameService, newStatus) => {
    setShowStatusConfirme({
      open: true,
      service: nameService,
      status: newStatus,
    });
  };

  const handleStatusConfirm = async () => {
    try {
      const service_id = showStatusConfirme.service.id;
      const status = showStatusConfirme.status;

      await dispatch(updateStatusService({ status, service_id })).unwrap();
      setShowStatusConfirme({ open: false, service: {}, status: "" });
      setShowModal(false);

      await dispatch(fetchServices());
      toast.success("Status Changed Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error :", error);
    }
  };

  const cancelleChangeStatus = () => {
    setShowStatusConfirme({
      open: false,
      service: "",
      status: "",
    });
  };

  const viewDetails = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const getStatusCount = (status) => {
    if (status === "all") return data?.data?.length;
    return data?.data?.filter((service) => service.status === status).length;
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

  if (status == "loading") {
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
        className="min-h-screen p-4 lg:p-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#2C3E50" }}
            >
              Services Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor all services on the platform
            </p>
          </div>

          {/* Statistics Cards */}
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
              <h3 className="text-gray-600 text-sm mb-1">Total Services</h3>
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
              <h3 className="text-gray-600 text-sm mb-1">Approved Services</h3>
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
              <h3 className="text-gray-600 text-sm mb-1">Pending Services</h3>
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
              <h3 className="text-gray-600 text-sm mb-1">Rejected Services</h3>
              <p className="text-3xl font-bold" style={{ color: "#E74C3C" }}>
                {getStatusCount("rejected")}
              </p>
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#2C3E50" }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Provider
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Price
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
                  {data?.data?.map((service) => {
                    const StatusIcon = getStatusIcon(service.status);

                    return (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p
                                className="font-semibold"
                                style={{ color: "#2C3E50" }}
                              >
                                {service.title.substring(0, 20)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-500">
                            {service.description.substring(0, 40)}...
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: "#ECF0F1",
                              color: "#2C3E50",
                            }}
                          >
                            <Tag size={12} />
                            {service.category.display_name}
                          </span>
                        </td>
                        <td
                          className="px-6 py-4 text-sm"
                          style={{ color: "#2C3E50" }}
                        >
                          {service.provider.name}
                        </td>
                        <td
                          className="px-6 py-4 text-sm font-semibold"
                          style={{ color: "#2C3E50" }}
                        >
                          ${service.price}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white justify-center"
                              style={{
                                backgroundColor: getStatusColor(service.status),
                              }}
                            >
                              <StatusIcon size={12} />
                              {service.status.charAt(0).toUpperCase() +
                                service.status.slice(1)}
                            </span>

                            {service.status === "pending" && (
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    handleChangeStatus(service, "approved")
                                  }
                                  className="px-2 py-1 text-xs text-white rounded transition-colors"
                                  style={{ backgroundColor: "#2ECC71" }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleChangeStatus(service, "rejected")
                                  }
                                  className="px-2 py-1 text-xs text-white rounded transition-colors"
                                  style={{ backgroundColor: "#E74C3C" }}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {service.status === "approved" && (
                              <button
                                onClick={() =>
                                  handleChangeStatus(service, "rejected")
                                }
                                className="px-2 py-1 text-xs text-white rounded transition-colors"
                                style={{ backgroundColor: "#E74C3C" }}
                              >
                                Reject
                              </button>
                            )}
                            {service.status === "rejected" && (
                              <button
                                onClick={() =>
                                  handleChangeStatus(service, "approved")
                                }
                                className="px-2 py-1 text-xs text-white rounded transition-colors"
                                style={{ backgroundColor: "#2ECC71" }}
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => viewDetails(service)}
                            className="px-3 py-2 text-sm text-white rounded-lg transition-colors flex items-center gap-2"
                            style={{ backgroundColor: "#3498DB" }}
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
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

      {/* Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: "#2C3E50" }}>
                Service Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Info */}
                <div className="space-y-4">
                  <div>
                    <h4
                      className="text-lg font-bold mb-2"
                      style={{ color: "#2C3E50" }}
                    >
                      Service Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Title</p>
                        <p
                          className="font-semibold"
                          style={{ color: "#2C3E50" }}
                        >
                          {selectedService.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Description
                        </p>
                        <p className="text-gray-700">
                          {selectedService.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Category</p>
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: "#ECF0F1",
                            color: "#2C3E50",
                          }}
                        >
                          <Tag size={14} />
                          {selectedService.category.display_name}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Price</p>
                        <p
                          className="text-2xl font-bold flex items-center gap-1"
                          style={{ color: "#2ECC71" }}
                        >
                          <DollarSign size={24} />
                          {selectedService.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="space-y-4">
                  <div>
                    <h4
                      className="text-lg font-bold mb-2"
                      style={{ color: "#2C3E50" }}
                    >
                      Provider Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={18} style={{ color: "#2ECC71" }} />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p
                            className="font-semibold"
                            style={{ color: "#2C3E50" }}
                          >
                            {selectedService.provider.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} style={{ color: "#2ECC71" }} />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-700">
                            {selectedService.provider.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={18} style={{ color: "#2ECC71" }} />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="text-gray-700">
                            {selectedService.provider.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={18} style={{ color: "#2ECC71" }} />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <p className="text-gray-700">
                            {selectedService.provider.phone}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
                          style={{
                            backgroundColor: getStatusColor(
                              selectedService.status
                            ),
                          }}
                        >
                          {React.createElement(
                            getStatusIcon(selectedService.status),
                            { size: 16 }
                          )}
                          {selectedService.status.charAt(0).toUpperCase() +
                            selectedService.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedService.status === "pending" && (
                <div className="mt-6 pt-6 border-t flex gap-3">
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedService, "approved");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#2ECC71" }}
                  >
                    Approve Service
                  </button>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedService, "rejected");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#E74C3C" }}
                  >
                    Reject Service
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
              <strong>{showStatusConfirme.status}</strong> this service{" "}
              <strong>{showStatusConfirme.service.title}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleStatusConfirm}
                disabled={updateStatusServiceStatus === "loading"}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateStatusServiceStatus == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Status Service Changing ...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
