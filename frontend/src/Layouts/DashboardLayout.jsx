import React, { useEffect, useState } from "react";
import {
  Home,
  Calendar,
  Star,
  LogOut,
  Menu,
  X,
  Users,
  Layers,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, userLogout } from "../features/AuthSlice";
import { fetchCategories } from "../features/ServiceSlice";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userLogout_Status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = user?.roles?.[0];

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(userLogout()).unwrap();
      console.log("Logout Success");
      dispatch(clearAuth());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Define menu items based on role
  const menuItems =
    role.name === "admin"
      ? [
        { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
        { label: "Providers", icon: Users, path: "/admin/providers" },
        { label: "Users", icon: Users, path: "/admin/users" },
        { label: "Categories", icon: Layers, path: "/admin/categories" },
        { label: "Services", icon: Briefcase, path: "/admin/services" },
        { label: "Reviews", icon: Star, path: "/admin/reviews" },
      ]
      : [
        { label: "Dashboard", icon: Home, path: "/provider/dashboard" },
        { label: "Service", icon: Briefcase, path: "/provider/service" },
        {
          label: "Reservations",
          icon: Calendar,
          path: "/provider/reservations",
        },
        { label: "Reviews", icon: Star, path: "/provider/reviews" },
      ];

  const linkClasses = ({ isActive }) =>
    `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive ? "bg-[#2ECC71] text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#ECF0F1" }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        style={{ backgroundColor: "#2C3E50" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <h1 className="text-xl font-bold text-white capitalize">
              {role.display_name} Panel
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsSidebarOpen(false)}
                className={linkClasses}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}

            <div className="pt-4">
              <hr className="border-gray-600" />
            </div>

            {/* Logout */}
            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#E67E22] hover:bg-[#E67E22]/10 transition-colors"
              onClick={handleLogout}
            >
              {userLogout_Status == "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="font-medium">Logout...</span>
                </>
              ) : (
                <>
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden hover:opacity-80"
              style={{ color: "#2C3E50" }}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-bold" style={{ color: "#2C3E50" }}>
              {role.display_name} Dashboard
            </h2>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: "#2ECC71" }}
            >
              {getInitials(user.name)}
            </div>
          </div>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
