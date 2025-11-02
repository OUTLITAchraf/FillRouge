import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  User,
  Calendar,
  LogOut,
  Star,
  MapPin,
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
const mockServices = [
  {
    id: 1,
    title: "Professional Home Cleaning",
    price: 250,
    category: { id: 1, name: "cleaning", display_name: "Cleaning" },
    provider: { id: 1, name: "Ahmed Khalil", avatar: null, rating: 4.8 },
    image: "https://placehold.co/600x400?text=No+Image+Available",
  },
  {
    id: 2,
    title: "Expert Plumbing Service",
    price: 350,
    category: { id: 2, name: "plumbing", display_name: "Plumbing" },
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
    image:
      "https://placehold.co/600x400/eeeeee/555555?text=No+Image+Available&font=Roboto",
  },
  {
    title: "Apartment Deep Cleaning",
    description:
      "Complete deep cleaning for kitchen, bathroom, and living areas using eco-friendly products.",
    price: 250,
    category: { id: 1, name: "cleaning", display_name: "Cleaning" },
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Office Cleaning Service",
    description:
      "Professional daily and weekly cleaning for offices up to 10 rooms.",
    price: 400,
    category: { id: 1, name: "cleaning", display_name: "Cleaning" },
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Home Deep Cleaning",
    description:
      "Professional deep cleaning for apartments and houses using eco-friendly products.",
    price: 350,
    category: { id: 1, name: "cleaning", display_name: "Cleaning" },
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Pipe Leak Repair",
    description: "Fix water leaks and replace damaged pipes within 2 hours.",
    price: 180,
    category: 2,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Fridge Repair",
    description:
      "Quick and reliable service to fix water leaks or any problem in fridge.",
    price: 180,
    category: 2,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Electrical Wiring Repair",
    description:
      "Troubleshooting and fixing home wiring and power outlet problems.",
    price: 220,
    category: 3,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Ceiling Light Installation",
    description:
      "Install ceiling lights, fans, or chandeliers safely and professionally.",
    price: 150,
    category: 3,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Electrical Installation",
    description:
      "Safe installation of sockets, lights, and electrical panels following safety standards.",
    price: 250,
    category: 3,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Interior Wall Painting",
    description:
      "High-quality indoor wall painting using washable paint. Includes preparation and cleanup.",
    price: 350,
    category: 4,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Exterior House Painting",
    description:
      "Durable outdoor painting using weather-resistant colors and materials.",
    price: 800,
    category: 4,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Custom Furniture Making",
    description:
      "Handmade wooden furniture built to your design specifications.",
    price: 1200,
    category: 5,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Door and Window Repair",
    description: "Fix or replace broken doors, windows, and locks.",
    price: 250,
    category: 5,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Lawn Mowing Service",
    description: "Trim, clean, and shape your lawn for a neat garden look.",
    price: 150,
    category: 6,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Garden Design and Maintenance",
    description:
      "Create and maintain your perfect garden with seasonal plants.",
    price: 500,
    category: 6,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Garden Maintenance",
    description:
      "Lawn mowing, plant trimming, and irrigation system setup for your garden.",
    price: 220,
    category: 6,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Home Moving Service",
    description:
      "Complete moving service including packing, transport, and unpacking.",
    price: 1000,
    category: 7,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Office Relocation",
    description:
      "Professional team for office moving with furniture disassembly and reassembly.",
    price: 1500,
    category: 7,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Apartment Moving Service",
    description:
      "Safe and fast moving service for furniture and boxes within the city.",
    price: 600,
    category: 7,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Washing Machine Repair",
    description: "Diagnose and fix washing machine motor or water issues.",
    price: 300,
    category: 8,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Refrigerator Maintenance",
    description:
      "Fix cooling issues, replace filters, and clean condenser coils.",
    price: 350,
    category: 8,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Evening Babysitting Service",
    description:
      "Caring babysitter available from 6 PM to 10 PM for children aged 3–10.",
    price: 100,
    category: 9,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Weekend Babysitter",
    description:
      "Full-day babysitting for weekends with meal prep and activity planning.",
    price: 200,
    category: 9,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },

  {
    title: "Math Tutoring for High School Students",
    description: "One-on-one lessons covering algebra, geometry, and calculus.",
    price: 120,
    category: 10,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "English Grammar and Speaking Lessons",
    description:
      "Interactive English lessons to improve communication and writing skills.",
    price: 100,
    category: 10,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
  {
    title: "Math & Physics Tutoring",
    description:
      "Private tutoring sessions for high school students in math and physics.",
    price: 150,
    category: 10,
    provider: { id: 2, name: "Mohammed Zaidi", avatar: null, rating: 4.9 },
  },
];

const categories = [
  { name: "cleaning", display_name: "Cleaning" },
  { name: "plumbing", display_name: "Plumbing" },
  { name: "electricity", display_name: "Electricity" },
  { name: "painting", display_name: "Painting" },
  { name: "carpentry", display_name: "Carpentry" },
  { name: "gardening", display_name: "Gardening" },
  { name: "moving", display_name: "Moving" },
  { name: "appliance_repair", display_name: "Appliance Repair" },
  { name: "babysitting", display_name: "Babysitting" },
  { name: "tutoring", display_name: "Tutoring" },
];

const ServicesPage = () => {
  // State Management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // Fetch services (replace with your API call)
  useEffect(() => {
    fetchServices();
  }, [currentPage, searchQuery, selectedCategory, minPrice, maxPrice]);

  const fetchServices = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = [...mockServices];

      // Filter by search query (provider name)
      if (searchQuery) {
        filtered = filtered.filter((service) =>
          service.provider.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(
          (service) => service.category.name === selectedCategory
        );
      }

      // Filter by price range
      if (minPrice) {
        filtered = filtered.filter(
          (service) => service.price >= Number(minPrice)
        );
      }
      if (maxPrice) {
        filtered = filtered.filter(
          (service) => service.price <= Number(maxPrice)
        );
      }

      setServices(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServices();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
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
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
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
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    fetchServices();
                  }}
                  className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
          </div>
        ) : services.length === 0 ? (
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
              {services.map((service) => {
                const CategoryIcon =
                  categoryIcons[service.category.name] || Wrench;

                return (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
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
                        <button className="px-4 py-2 bg-[#2ECC71] text-white rounded-lg text-sm font-semibold hover:bg-[#27AE60] transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
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
};

export default ServicesPage;
