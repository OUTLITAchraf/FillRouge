import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  DollarSign,
  Sparkles,
  Droplet,
  Zap,
  PaintBucket,
  Hammer,
  Leaf,
  Truck,
  Wrench,
  Baby,
  GraduationCap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../features/ServiceSlice";

const categoryIcons = {
  cleaning: Sparkles,
  plumbing: Droplet,
  electricity: Zap,
  painting: PaintBucket,
  carpentry: Hammer,
  gardening: Leaf,
  moving: Truck,
  appliance_repair: Wrench,
  babysitting: Baby,
  tutoring: GraduationCap,
};

function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { categories } = useSelector((state) => state.services);
  const { data, status } = useSelector((state) => state.services.services);

  const dispatch = useDispatch();

  const providerName = searchParams.get("provider_name");
  const categoryName = searchParams.get("category_name");

  useEffect(() => {
    const filters = {};

    if (providerName) filters.provider_name = providerName;
    if (categoryName) filters.category_name = categoryName;

    filters.page = currentPage;

    if (searchParams.size == 0) {
      setSearchParams({ page: currentPage });
    }

    dispatch(fetchServices(filters));
  }, [
    dispatch,
    providerName,
    categoryName,
    currentPage,
    searchParams,
    setSearchParams,
  ]);

  const handleSearch = (e) => {
    const filters = {};

    e.preventDefault();

    if (searchQuery) filters.provider_name = searchQuery;

    setSearchParams({
      provider_name: searchQuery || "",
    });
  };

  const handleFilter = () => {
    const filters = {};

    if (selectedCategory) filters.category_name = selectedCategory;
    if (minPrice) filters.min_price = minPrice;
    if (maxPrice) filters.max_price = maxPrice;

    setSearchParams(filters);

    dispatch(fetchServices(filters));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by provider name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#2ECC71] focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#2ECC71] text-white rounded-xl font-semibold hover:bg-[#27AE60] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#2ECC71] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.display_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Price (DH)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#2ECC71] focus:outline-none"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Price (DH)
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#2ECC71] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={resetFilters}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold border-1 border-gray-600 rounded-lg"
              >
                Reset Filters
              </button>
              <button
                onClick={() => handleFilter()}
                className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Services Grid */}
      {status == "loading" ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No services found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {data?.data?.map((service) => {
              const CategoryIcon =
                categoryIcons[service.category.name] || Wrench;

              return (
                <Link
                  key={service.id}
                  to={`/service/${service.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#2ECC71]"
                >
                  {/* Service Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <CategoryIcon className="w-4 h-4 text-[#2ECC71]" />
                      <span className="text-sm font-semibold text-gray-700">
                        {service.category.display_name}
                      </span>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                      {service.title}
                    </h3>

                    {/* Provider Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(service.provider.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {service.provider.name}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-[#2ECC71]">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-xl font-bold">
                          {service.price}
                        </span>
                        <span className="text-sm text-gray-600">DH</span>
                      </div>
                      {service.is_reserved ? (
                        <button 
                        disabled
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-semibold cursor-not-allowed">
                          Booked
                        </button>
                      ) : (
                        <button className="px-4 py-2 bg-[#2ECC71] text-white rounded-lg text-sm font-semibold hover:bg-[#27AE60] transition-colors">
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {data.data && data.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  setSearchParams({ page: newPage });
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
                    setSearchParams({ page: index + 1 });
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
                  setSearchParams({ page: newPage });
                }}
                disabled={currentPage === data.last_page}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ServicesPage;
