import { useState } from "react";
import { ChevronDown, Calendar, LogOut, Loader2 } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../features/AuthSlice";

function UserLayout() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLogout_Status } = useSelector((state) => state.auth);
  console.log(userLogout_Status);
  

  const handleLogoute = async () => {
    await dispatch(userLogout());

    setShowUserMenu(false);

    navigate('/')
  };

  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-menante-italic text-[#E67E22]">
                Fi
              </span>
              <span className="text-2xl font-menante-italic text-[#2ECC71]">
                darek
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-[#2ECC71] font-semibold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-[#2ECC71] font-semibold transition-colors"
              >
                Services
              </Link>
              <Link
                to="/faq"
                className="text-gray-700 hover:text-[#2ECC71] font-semibold transition-colors"
              >
                FAQ
              </Link>
            </div>

            {/* CTA Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-700">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">Customer</div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <Link
                        to="/user/reservation"
                        className="flex items-center gap-3 px-4 py-3 bg-green-50 text-[#2ECC71] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">My Reservations</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogoute}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        {userLogout_Status == "loading" ? (
                          <>
                            <Loader2 className="animate-spin w-5 h-5 text-red-600"/>
                            <span className="text-red-600 font-medium">
                              Logout
                            </span>
                          </>
                        ) : (
                          <>
                            <LogOut className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-medium">
                              Logout
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/provider/register"
                  className="px-6 py-2.5 bg-[#E67E22] text-white rounded-lg font-semibold hover:bg-[#D35400] transition-colors shadow-md hover:shadow-lg"
                >
                  Join as Provider
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Outlet user={user} />
      </main>

      {/* Footer */}
      <footer className="bg-[#1a252f] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-[#2ECC71] font-bold text-lg mb-4">
                About Fidarek
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Morocco's leading platform connecting customers with trusted
                local service providers. Making home services simple, safe, and
                reliable.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-[#2ECC71] font-bold text-lg mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-[#2ECC71] transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-[#2ECC71] transition-colors text-sm"
                  >
                    All Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/provider/register"
                    className="text-gray-400 hover:text-[#2ECC71] transition-colors text-sm"
                  >
                    For Providers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-400 hover:text-[#2ECC71] transition-colors text-sm"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-[#2ECC71] font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: support@fidarek.ma</li>
                <li>Phone: +212 600 000 000</li>
                <li>Address: Casablanca, Morocco</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Fidarek. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserLayout;
