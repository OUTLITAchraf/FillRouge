import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
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
  Search,
  MapPin,
  Star,
  CheckCircle2,
  MessageSquare,
  Calendar,
  TrendingUp
} from 'lucide-react';

const categories = [
  { name: 'cleaning', display_name: 'Cleaning', icon: Sparkles },
  { name: 'plumbing', display_name: 'Plumbing', icon: Droplet },
  { name: 'electricity', display_name: 'Electricity', icon: Zap },
  { name: 'painting', display_name: 'Painting', icon: PaintBucket },
  { name: 'carpentry', display_name: 'Carpentry', icon: Hammer },
  { name: 'gardening', display_name: 'Gardening', icon: Leaf },
  { name: 'moving', display_name: 'Moving', icon: Truck },
  { name: 'appliance_repair', display_name: 'Appliance Repair', icon: Wrench },
  { name: 'babysitting', display_name: 'Babysitting', icon: Baby },
  { name: 'tutoring', display_name: 'Tutoring', icon: GraduationCap },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for provider:', searchQuery);
    // Add your search logic here
  };

  return (
    <>

      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-gradient-radial from-green-100/50 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-gradient-radial from-orange-100/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2C3E50] leading-tight mb-6 tracking-tight">
                Find{" "}
                <span className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] bg-clip-text text-transparent">
                  Trusted
                </span>{" "}
                Local Services in Morocco
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                Connect with verified professionals for plumbing, electrical,
                carpentry, cleaning and more. Book instantly and track your
                service in real-time.
              </p>
            </div>

            {/* Right Side - Search Container */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <form onSubmit={handleSearch}>
                {/* Search Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search an service by Provider Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by provider name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#2ECC71] focus:outline-none focus:ring-2 focus:ring-green-100 transition-all text-gray-700"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
              Browse Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect professional for your needs from our wide range of trusted local services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/services/${category.name}`}
                  className="bg-white p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#2ECC71] group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-[#2ECC71]" />
                  </div>
                  <h3 className="font-bold text-[#2C3E50] mb-1">
                    {category.display_name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
              How Fidarek Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your service done in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Search Service</h3>
              <p className="text-gray-600">
                Browse categories or search for the specific provider you need in your area
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Choose Provider</h3>
              <p className="text-gray-600">
                Compare profiles, ratings, and reviews to find the best match for your needs
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Book Online</h3>
              <p className="text-gray-600">
                Select your preferred time, describe your problem, and confirm your booking instantly
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Track & Review</h3>
              <p className="text-gray-600">
                Monitor your request status in real-time and rate your experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Fidarek */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
              Why Choose Fidarek?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The smart way to find and book local services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#2ECC71]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                  Verified Professionals
                </h3>
                <p className="text-gray-600">
                  All service providers are thoroughly vetted and verified for your safety
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-[#2ECC71]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                  Trusted Reviews
                </h3>
                <p className="text-gray-600">
                  Read authentic reviews from real customers to make informed decisions
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#2ECC71]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                  Transparent Pricing
                </h3>
                <p className="text-gray-600">
                  Clear upfront pricing with no hidden fees or surprises
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#2ECC71]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                  Quick Booking
                </h3>
                <p className="text-gray-600">
                  Book services instantly and get confirmation within minutes
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#2ECC71]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                  Direct Communication
                </h3>
                <p className="text-gray-600">
                  Communicate directly with providers about your specific needs
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#2ECC71]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                  Local Services
                </h3>
                <p className="text-gray-600">
                  Find trusted professionals in your area across all major Moroccan cities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2C3E50] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2ECC71] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2ECC71] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of service providers already growing their business on Fidarek. Start receiving bookings today!
          </p>
          <Link
            to="/provider/register"
            className="inline-block px-8 py-4 bg-[#E67E22] text-white rounded-xl font-bold text-lg hover:bg-[#D35400] transition-colors shadow-lg hover:shadow-xl"
          >
            Register as Service Provider
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;