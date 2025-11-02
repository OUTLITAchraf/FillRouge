import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Edit,
  Trash,
  Sparkles, // Example category icon
} from "lucide-react";

// --- Mock Data (Replace with your API fetch) ---

// Mock user who is "logged in"
// Change this ID to match a review's userId to test the edit/delete buttons
const currentUser = {
  id: 1,
  name: "You",
  avatar: null,
};

// Mock service data
const mockService = {
  id: 1,
  title: "Professional Home Deep Cleaning",
  description:
    "Experience a spotless home with our comprehensive deep cleaning service. Our team handles everything from dusting high surfaces to scrubbing floors, ensuring every corner is immaculate. We use eco-friendly products that are safe for pets and children. This package is perfect for move-ins, move-outs, or seasonal cleaning.",
  price: 450,
  category: { id: 1, name: "cleaning", display_name: "Cleaning" },
  provider: {
    id: 1,
    name: "Ahmed Khalil",
    avatar: null,
    rating: 4.8,
    reviewsCount: 120,
    location: "Casablanca, Morocco",
  },
  image: "https://placehold.co/600x400/2ECC71/white?text=Service+Image",
};

// Mock review data
// const mockReviews = [
//   {
//     id: 101,
//     rating: 5,
//     comment:
//       "Absolutely fantastic service! My home has never been cleaner. Ahmed was professional, thorough, and very respectful. Will definitely be booking again.",
//     date: "2025-10-25",
//     user: {
//       id: 1, // This review belongs to the currentUser
//       name: "Amina El Idrissi",
//       avatar: null,
//     },
//   },
//   {
//     id: 102,
//     rating: 4,
//     comment:
//       "Great job, very satisfied with the results. They missed one small spot in the kitchen, but overall it was excellent value for the price.",
//     date: "2025-10-22",
//     user: {
//       id: 2,
//       name: "Youssef Benani",
//       avatar: null,
//     },
//   },
// ];
const mockReviews = [];
// --- Helper Components ---

/**
 * Renders a row of stars for the rating
 */
const StarRating = ({ rating, size = "h-5 w-5" }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            rating >= i + 1 ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={rating >= i + 1 ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

/**
 * Renders an avatar or initials
 */
const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Avatar = ({ user, size = "w-10 h-10" }) => (
  <div
    className={`${size} bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white font-bold text-sm`}
  >
    {user.avatar ? (
      <img src={user.avatar} alt={user.name} className="rounded-full" />
    ) : (
      getInitials(user.name)
    )}
  </div>
);

// --- Main Page Component ---

const ServiceDetailPage = () => {
  const { id } = useParams(); // Get service ID from URL
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for new review form
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Mock fetching data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setService(mockService);
      setReviews(mockReviews);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (newReviewRating === 0 || !newReviewComment) {
      alert("Please provide a rating and a comment.");
      return;
    }
    setIsSubmittingReview(true);

    // Simulate API POST
    setTimeout(() => {
      const newReview = {
        id: Math.floor(Math.random() * 1000), // temp ID
        rating: newReviewRating,
        comment: newReviewComment,
        date: new Date().toISOString().split("T")[0],
        user: currentUser, // Assign to the logged-in user
      };
      setReviews([newReview, ...reviews]); // Add new review to the top

      // Reset form
      setNewReviewRating(0);
      setNewReviewComment("");
      setIsSubmittingReview(false);
    }, 1000);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      // Simulate API DELETE
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
  };

  const handleUpdateReview = (reviewId) => {
    // In a real app, this would open a modal or set an "editing" state
    const newComment = prompt(
      "Update your review comment:",
      reviews.find((r) => r.id === reviewId).comment
    );
    if (newComment) {
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, comment: newComment } : r
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2ECC71]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700">Service not found.</h2>
      </div>
    );
  }

  // Use Sparkles as a fallback icon
  const CategoryIcon = Sparkles;

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- Service Detail Section --- */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Column: Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                {/* Category Badge */}
                <div className="flex justify-between items-center mb-2">
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full">
                    <CategoryIcon className="w-4 h-4" />
                    {service.category.display_name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 my-3">
                  {service.title}
                </h1>

                {/* Provider Info Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 my-5">
                  <Avatar user={service.provider} size="w-12 h-12" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Provided by</p>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {service.provider.name}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mt-6">
                  {service.description}
                </p>
              </div>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mt-8 border-t border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#2ECC71]">
                    {service.price} DH
                  </span>
                  <span className="text-gray-500">/ service</span>
                </div>
                <button className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Reviews Section --- */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Reviews ({reviews.length})
          </h2>

          {/* Add Review Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Add Your Review
            </h3>
            <form onSubmit={handleAddReview}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setNewReviewRating(i + 1)}
                      className="transition-transform transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          newReviewRating >= i + 1
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                        fill={
                          newReviewRating >= i + 1 ? "currentColor" : "none"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Your Comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#2ECC71] focus:outline-none transition-all"
                  placeholder="Share your experience with this service..."
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-8 py-3 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                Be the first to review this service!
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <div className="flex justify-between items-start">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar user={review.user} />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {review.user.name}
                        </h4>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>

                    {/* Edit/Delete Buttons: Show ONLY if review user ID matches logged-in user ID */}
                    {currentUser.id === review.user.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateReview(review.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit Review"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Review"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="mt-4">
                    <StarRating rating={review.rating} />
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  );
};

export default ServiceDetailPage;
