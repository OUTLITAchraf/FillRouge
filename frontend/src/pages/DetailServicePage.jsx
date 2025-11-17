import React, { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  DollarSign,
  Tag,
  User,
  Calendar,
  Edit,
  Trash2,
  Send,
  Loader2,
  CircleAlert,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addReview,
  deleteReview,
  fetchService,
  updateReview,
} from "../features/ServiceSlice";
import { toast } from "sonner";
import ReservationForm from "../components/ReservationForm";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { data, status } = useSelector((state) => state.services.service);
  const { token, user } = useSelector((state) => state.auth);
  const { addReviewStatus, updateReviewStatus, deleteReviewStatus } =
    useSelector((state) => state.services);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    reviewId: null,
  });
  const [reservitionModel, setReservationModel] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [guestModel, setGuestModel] = useState(false);
  const navigate = useNavigate() 

  useEffect(() => {
    dispatch(fetchService(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (data?.hasReserved) {
      setIsReserved(true);
    } else {
      setIsReserved(false);
    }
  }, [data]);

  const handleSubmitReview = async () => {
    if (rating > 0 && reviewText.trim()) {
      if (!token && !user) {
        setGuestModel(true);
      } else {
        try {
          if (editingReview) {
            const updatedReview = {
              id: editingReview.id,
              rating,
              comment: reviewText,
            };

            await dispatch(updateReview(updatedReview)).unwrap();
            await dispatch(fetchService(data.id));

            toast.success("Your review has been updated!");

            setEditingReview(null);
          } else {
            const newReview = {
              rating,
              comment: reviewText,
              service_id: data.id,
            };

            await dispatch(addReview(newReview)).unwrap();
            await dispatch(fetchService(data.id));

            toast.success("Review added successfully!");
          }

          setRating(0);
          setReviewText("");
        } catch (error) {
          if (error === "You have already reviewed this service.") {
            toast.warn("You have already reviewed this service.");
          } else {
            toast.error("Something went wrong. Please try again.");
          }
          console.error("Error submitting review:", error);
        }
      }
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setReviewText(review.comment);
    window.scrollTo({
      top: document.getElementById("review-form").offsetTop - 100,
      behavior: "smooth",
    });
  };

  const confirmDelete = (reviewId) => {
    setDeleteModal({ open: true, reviewId });
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteReview(deleteModal.reviewId)).unwrap();
      await dispatch(fetchService(data.id));

      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete review");
    }

    setDeleteModal({ open: false, reviewId: null });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ open: false, reviewId: null });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(0);
    setReviewText("");
  };

  const calculateAverageRating = () => {
    if (data?.reviews?.length === 0) return 0;
    const sum = data?.reviews?.reduce((acc, review) => acc + review.rating, 0);
    return (sum / data?.reviews?.length).toFixed(1);
  };

  const StarRating = ({ rating, onRate, interactive = false, size = 20 }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={interactive ? "cursor-pointer" : ""}
            style={{
              fill: star <= rating ? "#E67E22" : "transparent",
              color: star <= rating ? "#E67E22" : "#BDC3C7",
              transition: "all 0.2s",
            }}
            onClick={() => interactive && onRate(star)}
          />
        ))}
      </div>
    );
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-[#ECF0F1]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Service Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Service Image */}
            <div className="h-64 lg:h-full">
              <img
                src={data.image_url}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Service Info */}
            <div className="p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-[#2C3E50]">
                  {data.title}
                </h1>
                <div className="flex items-center gap-1">
                  <Star size={20} className="text-[#E67E22] fill-[#E67E22]" />
                  <span className="font-bold text-[#2C3E50]">
                    {calculateAverageRating()}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({data?.reviews?.length})
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {data.description}
              </p>

              {/* Service Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Tag size={20} className="text-[#2ECC71]" />
                  <span className="text-gray-700">
                    <span className="font-semibold text-[#2C3E50]">
                      Category:
                    </span>{" "}
                    {data?.category?.display_name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-[#2ECC71]" />
                  <span className="text-gray-700">
                    <span className="font-semibold text-[#2C3E50]">Price:</span>{" "}
                    ${data.price}/session
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <User size={20} className="text-[#2ECC71]" />
                  <span className="text-gray-700">
                    <span className="font-semibold text-[#2C3E50]">
                      Provider:
                    </span>{" "}
                    {data?.provider?.name}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#2ECC71] mt-1" />
                  <span className="text-gray-700">
                    <span className="font-semibold text-[#2C3E50]">
                      Address:
                    </span>{" "}
                    {data?.provider?.address}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-[#2ECC71]" />
                  <span className="text-gray-700">
                    <span className="font-semibold text-[#2C3E50]">Phone:</span>{" "}
                    {data?.provider?.phone}
                  </span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
                  isReserved
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#E67E22] hover:bg-[#D35400]"
                }`}
                onClick={() => {
                  if (!token && !user) {
                    setGuestModel(true);
                  } else {
                    setReservationModel(true);
                  }
                }}
              >
                <Calendar size={20} />
                {isReserved ? "Reserved" : "Reserve Service"}
              </button>
            </div>
          </div>
        </div>
        {reservitionModel && (
          <ReservationForm
            onClose={() => setReservationModel(false)}
            onSuccess={() => {
              setReservationModel(false);
              dispatch(fetchService(id));
            }}
          />
        )}

        {/* Reviews Section */}
        <div className="space-y-10">
          {/* Add/Edit Review Form */}
          <div className="lg:col-span-1">
            <div
              id="review-form"
              className="bg-white rounded-lg shadow-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold mb-4 text-[#2C3E50]">
                {editingReview ? "Edit Your Review" : "Add Your Review"}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                  Rating
                </label>
                <StarRating
                  rating={rating}
                  interactive={true}
                  onRate={(value) => setRating(value)}
                  size={28}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this service..."
                  rows={5}
                  className="w-full px-4 py-3 border border-[#BDC3C7] rounded-lg focus:outline-none focus:border-[#2ECC71] resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={
                    (data?.hasReviewed && !editingReview) ||
                    rating === 0 ||
                    !reviewText.trim() ||
                    addReviewStatus === "loading" ||
                    updateReviewStatus === "loading"
                  }
                  className="flex-1 py-2 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {data?.hasReviewed && !editingReview ? (
                    "You already Reviewed"
                  ) : addReviewStatus === "loading" ||
                    updateReviewStatus === "loading" ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {editingReview
                        ? "Updating Review..."
                        : "Adding Review..."}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {editingReview ? "Update" : "Submit"}
                    </>
                  )}
                </button>
                {editingReview && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-lg font-semibold bg-[#ECF0F1] text-[#2C3E50] hover:bg-[#BDC3C7] transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-[#2C3E50]">
              Customer Reviews ({data?.reviews?.length})
            </h2>

            <div className="space-y-4">
              {data?.reviews?.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-[#2C3E50]">
                        {review.client_id == user?.id
                          ? "You"
                          : review?.user?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.created_at.split("T")[0]}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating rating={review.rating} />
                      {review.client_id == user?.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 rounded-lg bg-[#ECF0F1] text-[#2ECC71] hover:bg-[#BDC3C7] transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => confirmDelete(review.id)}
                            className="p-2 rounded-lg bg-[#ECF0F1] text-[#E74C3C] hover:bg-[#BDC3C7] transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {deleteModal.open && (
            <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4 text-[#2C3E50]">
                  Confirm Delete
                </h2>
                <p className="mb-6">
                  Are you sure you want to delete this review?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleteReviewStatus === "loading"}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteReviewStatus == "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Deleting Review ...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {guestModel && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E74C3C]/10 flex items-center justify-center flex-shrink-0">
                    <CircleAlert size={24} className="text-[#E74C3C]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#2C3E50]">
                      You have to login for this action
                    </h3>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={()=>setGuestModel(false)}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#ECF0F1] text-[#2C3E50] hover:bg-[#BDC3C7] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={()=>navigate("/login")}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors bg-[#2ECC71] hover:bg-[#27AE60] disabled:opacity-50"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
