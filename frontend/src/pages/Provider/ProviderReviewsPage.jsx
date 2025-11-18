import { Star, ChevronLeft, ChevronRight, Filter, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../features/ServiceSlice";

function ProviderReviewsPage() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.services.reviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    const filters = {
      page: currentPage,
      rating: selectedRating,
    };
    dispatch(fetchReviews(filters));
  }, [dispatch, currentPage, selectedRating]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.reviews?.last_page) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  const getRatingCount = (rating) => {
    return data?.statistics?.rating_distribution?.[rating] || 0;
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#2C3E50]">
          Customer Reviews
        </h1>
        <p className="text-gray-600">
          View and manage reviews for your service
        </p>
      </div>

      {data?.reviews?.data && data?.reviews?.data.length > 0 ? (
        <>
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Average Rating Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#2C3E50]">
                Overall Rating
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-[#2ECC71]">
                  {data?.statistics?.average_rating || 0}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={
                          star <= Math.round(data?.statistics?.average_rating || 0)
                            ? "text-[#E67E22] fill-[#E67E22]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {data?.statistics?.total_reviews || 0} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#2C3E50]">
                Rating Distribution
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-8">
                      {rating}{" "}
                      <Star size={12} className="inline text-[#E67E22]" />
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#E67E22] rounded-full transition-all"
                        style={{
                          width: `${data?.statistics?.total_reviews
                              ? (getRatingCount(rating) / data.statistics.total_reviews) * 100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {getRatingCount(rating)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-[#2ECC71]" />
              <h2 className="text-lg font-semibold text-[#2C3E50]">
                Filter by Rating
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleRatingFilter("")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedRating === ""
                    ? "bg-[#2ECC71] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All Reviews
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating.toString())}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${selectedRating === rating.toString()
                      ? "bg-[#E67E22] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {rating} <Star size={16} className="fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {data?.reviews?.data?.map((review) => (
                <div
                  key={review.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {review.client?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-[#2C3E50]">
                            {review.client?.name || "Anonymous"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={
                                star <= review.rating
                                  ? "text-[#E67E22] fill-[#E67E22]"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Comment */}
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data?.reviews && data?.reviews.last_page > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!data?.reviews?.prev_page_url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${!data?.reviews?.prev_page_url
                      ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-[#2C3E50] text-white hover:bg-[#1A252F]"
                    }`}
                >
                  <ChevronLeft size={18} /> Previous
                </button>

                <p className="text-sm font-medium text-gray-600">
                  Page {data?.reviews?.current_page} of {data?.reviews?.last_page}
                </p>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!data?.reviews?.next_page_url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${!data?.reviews?.next_page_url
                      ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-[#2C3E50] text-white hover:bg-[#1A252F]"
                    }`}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        // Empty State
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Star className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-2xl font-semibold mb-2 text-[#2C3E50]">
            No Reviews Yet
          </h3>
          <p className="text-gray-600">
            {selectedRating
              ? `No reviews with ${selectedRating} stars found. Try a different filter.`
              : "Customer reviews will be displayed here once they start reviewing your service."}
          </p>
          {selectedRating && (
            <button
              onClick={() => handleRatingFilter("")}
              className="mt-4 px-6 py-3 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProviderReviewsPage;
