import React, { useState } from "react";
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Ban,
  BarChart3,
  Eye,
} from "lucide-react";

export default function ProviderReservationsPage() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [reservations, setReservations] = useState([
    {
      id: 1,
      customerName: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      address: "123 Main St, Boston, MA 02101",
      description: "Kitchen plumbing repair needed",
      date: "2025-11-05",
      status: "pending",
    },
    {
      id: 2,
      customerName: "Michael Brown",
      email: "mbrown@email.com",
      phone: "+1 (555) 345-6789",
      address: "456 Oak Ave, Cambridge, MA 02138",
      description: "Home cleaning service",
      date: "2025-11-03",
      status: "accepted",
    },
    {
      id: 3,
      customerName: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 456-7890",
      address: "789 Pine Rd, Somerville, MA 02143",
      description: "Electrical outlet installation",
      date: "2025-11-08",
      status: "pending",
    },
    {
      id: 4,
      customerName: "David Wilson",
      email: "dwilson@email.com",
      phone: "+1 (555) 567-8901",
      address: "321 Elm St, Brookline, MA 02445",
      description: "Air conditioning maintenance",
      date: "2025-10-28",
      status: "completed",
    },
    {
      id: 5,
      customerName: "Lisa Anderson",
      email: "l.anderson@email.com",
      phone: "+1 (555) 678-9012",
      address: "654 Maple Dr, Newton, MA 02458",
      description: "Painting service for living room",
      date: "2025-10-25",
      status: "refused",
    },
    {
      id: 6,
      customerName: "James Martinez",
      email: "jmartinez@email.com",
      phone: "+1 (555) 789-0123",
      address: "987 Cedar Ln, Quincy, MA 02169",
      description: "Furniture assembly",
      date: "2025-10-30",
      status: "cancelled",
    },
  ]);

  const handleStatusChange = (reservationId, newStatus) => {
    setReservations(
      reservations.map((res) =>
        res.id === reservationId ? { ...res, status: newStatus } : res
      )
    );
  };

  const viewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const getStatusCount = (status) => {
    return reservations.filter((res) => res.status === status).length;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        bgColor: "bg-yellow-400",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
        icon: Clock,
      },
      accepted: {
        label: "Accepted",
        bgColor: "bg-green-400",
        textColor: "text-green-800",
        borderColor: "border-green-300",
        icon: CheckCircle,
      },
      refused: {
        label: "Refused",
        bgColor: "bg-red-400",
        textColor: "text-red-800",
        borderColor: "border-red-300",
        icon: XCircle,
      },
      completed: {
        label: "Completed",
        bgColor: "bg-blue-400",
        textColor: "text-blue-800",
        borderColor: "border-blue-300",
        icon: Calendar,
      },
      cancelled: {
        label: "Cancelled",
        bgColor: "bg-gray-400",
        textColor: "text-gray-700",
        borderColor: "border-gray-300",
        icon: Ban,
      },
    };
    return configs[status] || configs.pending;
  };

  return (
    <>
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
                {getStatusCount("accepted")}
              </p>
            </div>

            {/* Refused */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-2 text-[#E74C3C]">
                <XCircle size={20} />
                <p className="text-sm font-medium">Refused</p>
              </div>
              <p className="text-2xl font-bold text-[#E74C3C]">
                {getStatusCount("refused")}
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
                    {[
                      "Customer Name",
                      "Description",
                      "Date",
                      "Email",
                      "Status",
                      "Action",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-sm font-semibold text-white"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => {
                    const {
                      icon: StatusIcon,
                      bgColor,
                      label,
                    } = getStatusConfig(reservation.status);

                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-[#2C3E50]">
                          {reservation.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {reservation.description.length > 40
                            ? reservation.description.substring(0, 40) + "..."
                            : reservation.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {reservation.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {reservation.email}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold justify-center text-white ${bgColor}`}
                            >
                              <StatusIcon size={14} />
                              {label}
                            </span>

                            {reservation.status === "pending" && (
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      reservation.id,
                                      "accepted"
                                    )
                                  }
                                  className="px-2 py-1 text-xs bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded transition-colors flex items-center justify-center gap-1"
                                >
                                  <CheckCircle size={12} />
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      reservation.id,
                                      "refused"
                                    )
                                  }
                                  className="px-2 py-1 text-xs bg-[#E74C3C] hover:bg-[#C0392B] text-white rounded transition-colors flex items-center justify-center gap-1"
                                >
                                  <XCircle size={12} />
                                  Refuse
                                </button>
                              </div>
                            )}

                            {reservation.status === "accepted" && (
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    handleStatusChange(
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
                                    handleStatusChange(
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
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                  <p className="font-semibold">
                    {selectedReservation.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold">{selectedReservation.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold">{selectedReservation.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-semibold">{selectedReservation.date}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="font-semibold">{selectedReservation.address}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="font-semibold">
                    {selectedReservation.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white`}>
                    {(() => {
                      const {
                        label,
                        icon: StatusIcon,
                        bgColor,
                        borderColor,
                      } = getStatusConfig(selectedReservation.status);
                      return (
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${bgColor} text-white ${borderColor}`}
                        >
                          <StatusIcon size={16} />
                          {label}
                        </span>
                      );
                    })()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-white bg-[#2C3E50] hover:bg-[#1A252F] rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
