import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  Key,
  Shield,
  Activity,
  Fullscreen,
  ChevronLeft,
  Home,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../features/AuthSlice";
import Lottie from "lottie-react";
import Login from "../assets/animations/Login.json";

const loginSchema = yup
  .object({
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address"),
    password: yup.string().required("Password is required"),
  })
  .required();

const LoginPage = () => {
  const { status } = useSelector((state) => state.auth.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  const fromPage = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const response = await dispatch(userLogin(data));
    console.log(response);

    if (response.meta.requestStatus === "fulfilled") {
      const user = response.payload.user;
      const role = user.roles?.[0]?.name;

      if (role === "provider") {
        navigate("/provider/dashboard");
      } else if (role === "client") {
        navigate(fromPage, { replace: true });
      } else {
        navigate("/admin/dashboard");
      }
    } else {
      setGeneralError(response.payload.message);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-green-50 via-white to-green-50 overflow-y-auto lg:overflow-hidden">
      <Link
        to="/"
        className="fixed top-6 left-6 z-10 p-3 flex gap-2 items-center text-xl bg-white/20 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-white/30 transition-colors"
        aria-label="Return to Home"
      >
        <Home size={25} />
        Home
      </Link>

      {/* 1. Info Section (Left Sidebar) - Adjusted Padding */}
      <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] text-white py-12 px-4 sm:px-6 lg:py-22 lg:px-8 lg:w-1/2">
        <div className="items-center justify-center mb-[-40px] mt-10 lg:mt-0">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Welcome Back!</h2>
            <p className="text-green-100 text-lg">
              Log in to manage your services, or bookings.
            </p>
          </div>
        </div>
        <Lottie
          animationData={Login}
          loop={true}
          className="w-[380px] h-[380px] lg:w-[550px] lg:h-[550px] lg:ml-10"
        />
      </div>

      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 lg:w-1/2 lg:overflow-y-auto lg:h-full lg:flex-grow">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">
                Sign In to Fidarek
              </h1>
              <p className="text-gray-600">
                Enter your credentials to continue
              </p>
            </div>

            {generalError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-semibold">
                    {generalError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className={`w-5 h-5 ${
                        errors.email ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#2ECC71] focus:ring-green-100"
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`w-5 h-5 ${
                        errors.password ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#2ECC71] focus:ring-green-100"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">Don't have an account?</p>
                <p className="text-gray-600">
                  Create Account as{" "}
                  <Link
                    to="/user/register"
                    className="text-[#2ECC71] hover:text-[#27AE60] font-bold"
                  >
                    User
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/provider/register"
                    className="text-[#E67E22] hover:text-[#D35400] font-bold"
                  >
                    Provider
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
