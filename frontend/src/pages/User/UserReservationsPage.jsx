import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../../features/ServiceSlice";

const UserReservationsPage = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.services.reservations);

  // Fetch reservations
  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
        icon: Clock,
      },
      confirmed: {
        label: "Confirmed",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
        icon: CheckCircle,
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
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
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
    total: data.length,
    pending: data.filter((r) => r.status === "pending").length,
    confirmed: data.filter((r) => r.status === "confirmed").length,
    completed: data.filter((r) => r.status === "completed").length,
    cancelled: data.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-gray-400">
          <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
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
            {stats.confirmed}
          </div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-400">
          <div className="text-2xl font-bold text-blue-700">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-400">
          <div className="text-2xl font-bold text-red-700">
            {stats.cancelled}
          </div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Reservations List */}
      {status == "loading" ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No reservations found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't made any reservations yet or no matches found
          </p>
          <Link
            to="/services"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#E67E22] to-[#D35400] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {data.map((reservation) => {
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
                            {/* {reservation.reservation_date} */}
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
                      <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-sm">
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
                        <button className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
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
    </div>
  );
};

export default UserReservationsPage;
