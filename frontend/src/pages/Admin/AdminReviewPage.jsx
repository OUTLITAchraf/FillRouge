import React, { useEffect, useState } from "react";
import {
    Star,
    Trash2,
    Search,
    Filter,
    AlertCircle,
    CheckCircle,
    User,
    Calendar,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, forceDeleteReview } from "../../features/ServiceSlice";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function AdminReviewsPage() {
    const dispatch = useDispatch();
    const { data, status } = useSelector((state) => state.services.reviews);
    const { forceDeleteReviewStatus } = useSelector((state) => state.services);
    const [currentPage, setCurrentPage] = useState(1);

    const [forceDeleteModal, setForceDeleteModal] = useState({
        open: false,
        review: null,
    });

    const [searchParams, setSearchParams] = useSearchParams("");
    const [searchedClient, setSearchedClient] = useState("");
    const [selectedRating, setSelectedRating] = useState("");
    const clientNameParams = searchParams.get("client_name") || "";
    const ratingParams = searchParams.get("rating") || "";

    useEffect(() => {
        setSearchedClient(clientNameParams);
        setSelectedRating(ratingParams);
    }, []);

    useEffect(() => {
        const filters = {};
        if (clientNameParams) filters.client_name = clientNameParams;
        if (ratingParams) filters.rating = ratingParams;
        filters.page = currentPage;
        dispatch(fetchReviews(filters));
    }, [dispatch, clientNameParams, ratingParams, currentPage]);

    const handleFilters = () => {
        const params = {};
        if (searchedClient) params.client_name = searchedClient;
        if (selectedRating) params.rating = selectedRating;

        params.page = 1;
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        setSearchedClient("");
        setSelectedRating("");
        setCurrentPage(1);

        setSearchParams({ page: 1 });
    };

    const handleForceDeleteClick = (review) => {
        setForceDeleteModal({ open: true, review });
    };

    const confirmDelete = async () => {
        try {
            let response = await dispatch(forceDeleteReview(forceDeleteModal.review.id)).unwrap();
            console.log("Response :", response);
            setForceDeleteModal({
                open: false,
                review: null
            });

            dispatch(fetchReviews())
            toast.success("Review Force Deleted Successfully");
        } catch (error) {
            console.log("Error :", error);
            setForceDeleteModal({
                open: true,
            });
            toast.error("Request Failed")

        }

    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= data?.reviews?.last_page) {
            setCurrentPage(page);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < rating ? "fill-[#E67E22] text-[#E67E22]" : "text-gray-300"
                    }`}
            />
        ));
    };

    if (status == "loading") {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ECF0F1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: "#2C3E50" }}>
                        Reviews Management
                    </h1>
                    <p className="text-gray-600">
                        Manage and monitor all reviews of clients
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search a review by client name..."
                                value={searchedClient}
                                onChange={(e) => setSearchedClient(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2ECC71] transition-colors"
                            />
                        </div>

                        {/* Rating Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2ECC71] transition-colors appearance-none bg-white"
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                    </div>
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

                {/* Reviews List */}
                <div className="space-y-4">
                    {data?.reviews?.data?.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Reviews Found
                            </h3>
                            <p className="text-gray-600">Try adjusting your search filters</p>
                        </div>
                    ) : (
                        data?.reviews?.data?.map((review) => (
                            <div
                                key={review.id}
                                className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all hover:shadow-md border-gray-200`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-1">
                                            {/* Customer Info */}
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {review.client.name}
                                                </h3>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex gap-1">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    ({review.rating}/5)
                                                </span>
                                            </div>

                                            {/* Service Info */}
                                            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span>
                                                        Provider:{" "}
                                                        <span className="font-medium text-gray-900">
                                                            {review.service.provider.name}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-[#2ECC71] rounded-full"></span>
                                                    <span>{review.service.category.display_name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(review.created_at).toLocaleDateString(
                                                            "en-US"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Comment */}
                                            <p className="text-gray-700 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    {review.deleted_at && (
                                        <button
                                            onClick={() => handleForceDeleteClick(review)}
                                            className="ml-4 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                                            title="Delete Review"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!data?.reviews?.prev_page_url}
                        className={`flex items-center gap-2 px-3 py-2 rounded ${!data?.reviews?.prev_page_url
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-[#2C3E50] text-white"
                            }`}
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>

                    <p className="text-sm text-gray-600">
                        Page {data?.reviews?.current_page} of {data?.reviews?.last_page}
                    </p>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!data?.reviews?.next_page_url}
                        className={`flex items-center gap-2 px-3 py-2 rounded ${!data?.reviews?.next_page_url
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-[#2C3E50] text-white"
                            }`}
                    >
                        Next <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {forceDeleteModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Force Delete Review?
                        </h3>

                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to force delete the review ? <br />
                            This action is irreversible.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() =>
                                    setForceDeleteModal({ open: false, review: null })
                                }
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={forceDeleteReviewStatus == "loading"}
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {
                                    forceDeleteReviewStatus == "loading" ? "Deleting..." : "Delete"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
