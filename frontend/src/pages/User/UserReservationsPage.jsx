import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Search,
  Filter,
  Briefcase,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStatusReservations,
  fetchReservations,
} from "../../features/ServiceSlice";
import { toast } from "sonner";

const UserReservationsPage = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.services.reservations);
  const { updateStatusReservationsStatus } = useSelector(
    (state) => state.services
  );
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    reservation_id: null,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchServicetitle, setSearchServicetitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const statusParams = searchParams.get("status") || "";
  const serviceTitleParams = searchParams.get("service_title") || "";

  useEffect(() => {
    setSelectedStatus(statusParams);
    setSearchServicetitle(serviceTitleParams);
  }, []);

  useEffect(() => {
    const filter = {};

    if (statusParams) filter.status = statusParams;
    if (serviceTitleParams) filter.service_title = serviceTitleParams;
    console.log(currentPage);
    

    filter.page = currentPage;

    setSearchParams(filter)
    dispatch(fetchReservations(filter));
  }, [dispatch, currentPage, statusParams, serviceTitleParams, setSearchParams]);

  const handleFilter = () => {
    const params = {};

    if (selectedStatus) params.status = selectedStatus;
    if (searchServicetitle) params.service_title = searchServicetitle;

    params.page = 1;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSelectedStatus("");
    setSearchServicetitle("");
    setCurrentPage(1);

    setSearchParams({ page: 1 });
  };

  const confirmDelete = (reservation_id) => {
    setDeleteModal({ open: true, reservation_id });
  };

  const handleConfirmDelete = async () => {
    try {
      const reservation_id = deleteModal.reservation_id;
      const status = "cancelled";

      await dispatch(
        updateStatusReservations({ status, reservation_id })
      ).unwrap();
      setDeleteModal({ open: false, reservation_id: null });

      await dispatch(fetchReservations());
      toast.success("Reservation Deleted Successfully");
    } catch (error) {
      console.log(error);
      setDeleteModal({ open: true, reservation_id: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ open: false, reservation_id: null });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
        icon: Clock,
      },
      accepte: {
        label: "Accepted",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
        icon: CheckCircle,
      },
      refuse: {
        label: "Refused",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
        icon: XCircle,
      },
      completed: {
        label: "Completed",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-300",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelled",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        borderColor: "border-gray-300",
        icon: XCircle,
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    dateString.replace(" ", "T");
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Statistics
  const stats = {
    total: data?.data?.length,
    pending: data?.data?.filter((r) => r.status === "pending").length,
    accepte: data?.data?.filter((r) => r.status === "accepte").length,
    refuse: data?.data?.filter((r) => r.status === "refuse").length,
    completed: data?.data?.filter((r) => r.status === "completed").length,
    cancelled: data?.data?.filter((r) => r.status === "cancelled").length,
  };

  if (status == "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#2C3E50]">
          My Reservations
        </h1>
        <p className="text-gray-600">
          Manage and track all your service reservations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-400">
          <div className="text-2xl font-bold text-purple-700">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-400">
          <div className="text-2xl font-bold text-yellow-700">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-400">
          <div className="text-2xl font-bold text-green-700">
            {stats.accepte}
          </div>
          <div className="text-sm text-gray-600">Accepted</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-400">
          <div className="text-2xl font-bold text-red-700">{stats.refuse}</div>
          <div className="text-sm text-gray-600">Refused</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-400">
          <div className="text-2xl font-bold text-blue-700">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-gray-400">
          <div className="text-2xl font-bold text-gray-700">
            {stats.cancelled}
          </div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-[#2ECC71]" />
          <h2 className="text-lg font-semibold text-[#2C3E50]">
            Filter Reservations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search by Service Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
              Search by Service
            </label>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search service by title..."
                value={searchServicetitle}
                onChange={(e) => {
                  setSearchServicetitle(e.target.value);
                  setCurrentPage(1);
                }}
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
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepte">Accepted</option>
              <option value="refuse">Refused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-colors flex items-center gap-2"
          >
            Apply Filter
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-[#ECF0F1] text-[#2C3E50] rounded-lg font-semibold hover:bg-[#BDC3C7] transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Reservations List */}
      {data?.data?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No reservations found
          </h3>
          <p className="text-gray-500 mb-6">
            {selectedStatus || searchServicetitle
              ? "No reservations match your filters. Try adjusting your search criteria."
              : "You haven't made any reservations yet."}
          </p>
          {selectedStatus || searchServicetitle ? (
            <button
              onClick={handleClearFilters}
              className="inline-block px-6 py-3 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/services"
              className="inline-block px-6 py-3 bg-linear-to-r from-[#E67E22] to-[#D35400] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {data?.data?.map((reservation) => {
              const statusConfig = getStatusConfig(reservation.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={reservation.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#2ECC71]"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      {/* Service Name */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {reservation.service_name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {formatDate(reservation.reservation_date)}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-700 text-md">
                            Service title:{" "}
                            <span className="text-gray-600 text-sm leading-relaxed">
                              {reservation.service.title}
                            </span>
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-md">
                            Description:
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {reservation.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Link
                        to={`/service/${reservation.service_id}`}
                        className="flex-1 px-4 py-2 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-colors text-center"
                      >
                        View Service
                      </Link>
                      {reservation.status === "pending" && (
                        <button
                          className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                          onClick={() => confirmDelete(reservation.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      {data.data && data.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1);
              setCurrentPage(newPage);
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: data.last_page }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => {
                setCurrentPage(index + 1);
              }}
              className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                currentPage === index + 1
                  ? "bg-[#2ECC71] text-white"
                  : "border-2 border-gray-200 hover:border-[#2ECC71] hover:text-[#2ECC71]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => {
              const newPage = Math.min(currentPage + 1, data.last_page);
              setCurrentPage(newPage);
            }}
            disabled={currentPage === data.last_page}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#2C3E50]">
                Confirm Cancellation
              </h2>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="mb-6">
              Are you sure you want to cancel this reservation?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleConfirmDelete}
                disabled={updateStatusReservationsStatus === "loading"}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateStatusReservationsStatus == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Cancelling...
                  </span>
                ) : (
                  "Cancel Reservation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReservationsPage;
