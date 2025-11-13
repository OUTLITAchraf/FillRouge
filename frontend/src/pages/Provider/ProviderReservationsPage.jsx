import React, { useEffect, useState } from "react";
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Ban,
  BarChart3,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReservations,
  updateStatusReservations,
} from "../../features/ServiceSlice";
import { toast } from "sonner";

export default function ProviderReservationsPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.services.reservations);
  const { updateStatusReservationsStatus } = useSelector(
    (state) => state.services
  );
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmeStatus, setShowConfirmeStatus] = useState({
    open: false,
    reservation_id: null,
    status: "",
  });

  console.log(showConfirmeStatus.reservation_id);
  console.log(status);

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const handleChangeStatus = (reservation_id, newStatus) => {
    setShowConfirmeStatus({
      open: true,
      reservation_id,
      status: newStatus,
    });
  };

  const cancelleChangeStatus = () => {
    setShowConfirmeStatus({
      open: false,
      reservation_id: null,
      status: "",
    });
  };

  const handleStatusConfirm = async () => {
    try {
      const reservation_id = showConfirmeStatus.reservation_id;
      const status = showConfirmeStatus.status;

      await dispatch(
        updateStatusReservations({ status, reservation_id })
      ).unwrap();
      setShowConfirmeStatus({ open: false, reservation_id: null, status: "" });
      setShowModal(false);

      await dispatch(fetchReservations());
      toast.success("Reservation Deleted Successfully");
    } catch (error) {
      console.log(error);
      setShowConfirmeStatus({ open: false, reservation_id: null, status: "" });
    }
  };

  const viewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const getStatusCount = (status) => {
    return data?.filter((res) => res.status === status).length;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#E67E22",
      accepte: "#27AE60",
      refuse: "#E74C3C",
      completed: "#3498DB",
      cancelled: "#7F8C8D",
    };
    return colors[status] || "#95A5A6";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Edit,
      accepte: CheckCircle,
      refuse: XCircle,
      completed: Calendar,
      cancelled: Ban,
    };
    return icons[status] || Edit;
  };

  if (status == "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
      </div>
    );
  }

  return (
    <>
      {data?.length == 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#2C3E50" }}
            >
              Reservations
            </h3>
            <p className="text-gray-600">
              Clients reservations will be displayed here.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Status Stats Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 text-[#2C3E50]">
              <BarChart3 size={28} />
              <h2 className="text-2xl font-bold">Reservation Statistics</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Pending */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-2 text-[#E67E22]">
                  <Clock size={20} />
                  <p className="text-sm font-medium">Pending</p>
                </div>
                <p className="text-2xl font-bold text-[#E67E22]">
                  {getStatusCount("pending")}
                </p>
              </div>

              {/* Accepted */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-2 text-[#2ECC71]">
                  <CheckCircle size={20} />
                  <p className="text-sm font-medium">Accepted</p>
                </div>
                <p className="text-2xl font-bold text-[#2ECC71]">
                  {getStatusCount("accepte")}
                </p>
              </div>

              {/* Refused */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-2 text-[#E74C3C]">
                  <XCircle size={20} />
                  <p className="text-sm font-medium">Refused</p>
                </div>
                <p className="text-2xl font-bold text-[#E74C3C]">
                  {getStatusCount("refuse")}
                </p>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-2 text-[#3498DB]">
                  <Calendar size={20} />
                  <p className="text-sm font-medium">Completed</p>
                </div>
                <p className="text-2xl font-bold text-[#3498DB]">
                  {getStatusCount("completed")}
                </p>
              </div>

              {/* Cancelled */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-2 text-[#95A5A6]">
                  <Ban size={20} />
                  <p className="text-sm font-medium">Cancelled</p>
                </div>
                <p className="text-2xl font-bold text-[#95A5A6]">
                  {getStatusCount("cancelled")}
                </p>
              </div>
            </div>
          </div>

          {/* Reservations Table Section */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4 text-[#2C3E50]">
              <Calendar size={28} />
              <h2 className="text-2xl font-bold">All Reservations</h2>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2C3E50]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        Clien Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        Date Reservation
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data?.map((reservation) => {
                      const StatusIcon = getStatusIcon(reservation.status);

                      return (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-[#2C3E50]">
                            {reservation.client.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {reservation.description.length > 40
                              ? reservation.description.substring(0, 40) + "..."
                              : reservation.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {reservation.reservation_date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {reservation.client.email}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-2">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold justify-center text-white`}
                                style={{
                                  backgroundColor: getStatusColor(
                                    reservation.status
                                  ),
                                }}
                              >
                                <StatusIcon size={14} />
                                {reservation.status}
                              </span>

                              {reservation.status === "pending" && (
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() =>
                                      handleChangeStatus(
                                        reservation.id,
                                        "accepte"
                                      )
                                    }
                                    className="px-2 py-1 text-xs bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded transition-colors flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle size={12} />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleChangeStatus(
                                        reservation.id,
                                        "refuse"
                                      )
                                    }
                                    className="px-2 py-1 text-xs bg-[#E74C3C] hover:bg-[#C0392B] text-white rounded transition-colors flex items-center justify-center gap-1"
                                  >
                                    <XCircle size={12} />
                                    Refuse
                                  </button>
                                </div>
                              )}

                              {reservation.status === "accepte" && (
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() =>
                                      handleChangeStatus(
                                        reservation.id,
                                        "completed"
                                      )
                                    }
                                    className="px-2 py-1 text-xs bg-[#3498DB] hover:bg-[#2980B9] text-white rounded transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Calendar size={12} />
                                    Complete
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleChangeStatus(
                                        reservation.id,
                                        "cancelled"
                                      )
                                    }
                                    className="px-2 py-1 text-xs bg-[#95A5A6] hover:bg-[#7F8C8D] text-white rounded transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Ban size={12} />
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => viewDetails(reservation)}
                              className="px-3 py-1 text-sm bg-[#3498DB] hover:bg-[#2980B9] text-white rounded-2xl transition-colors flex items-center gap-2"
                            >
                              <Eye size={16} />
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#2C3E50]">
                Reservation Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2C3E50]">
                <div className="flex items-center gap-2">
                  <User size={18} style={{ color: "#2ECC71" }} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Client Name</p>
                    <p className="text-gray-700">
                      {selectedReservation.client.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={18} style={{ color: "#2ECC71" }} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-gray-700">
                      {selectedReservation.client.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={18} style={{ color: "#2ECC71" }} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-700">
                      {selectedReservation.client.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} style={{ color: "#2ECC71" }} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Date Reservation
                    </p>
                    <p className="text-gray-700">
                      {selectedReservation.reservation_date}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <MapPin size={18} style={{ color: "#2ECC71" }} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-gray-700">
                      {selectedReservation.client.address}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="font-semibold">
                    {selectedReservation.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{
                      backgroundColor: getStatusColor(
                        selectedReservation.status
                      ),
                    }}
                  >
                    {React.createElement(
                      getStatusIcon(selectedReservation.status),
                      { size: 16 }
                    )}
                    {selectedReservation.status.charAt(0).toUpperCase() +
                      selectedReservation.status.slice(1)}
                  </span>
                </div>
              </div>

              {selectedReservation.status === "pending" && (
                <div className="mt-6 pt-6 border-t flex gap-3">
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedReservation.id, "accepte");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#2ECC71" }}
                  >
                    Accepte Reservation
                  </button>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedReservation.id, "refuse");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#E74C3C" }}
                  >
                    Refuse Reservation
                  </button>
                </div>
              )}

              {selectedReservation.status === "accepte" && (
                <div className="mt-6 pt-6 border-t flex gap-3">
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedReservation.id, "completed");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#2ECC71" }}
                  >
                    Reservation Completed
                  </button>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedReservation.id, "cancelled");
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "#E74C3C" }}
                  >
                    Reservation Cancelled
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirmeStatus.open && (
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
              <strong>{showConfirmeStatus.status}</strong> this reservation?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleStatusConfirm}
                disabled={updateStatusReservationsStatus === "loading"}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateStatusReservationsStatus == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Status Reservation Changing ...
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
