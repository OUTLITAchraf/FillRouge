import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../features/AuthSlice";

// Validation Schema
const providerSchema = yup
  .object({
    name: yup
      .string()
      .required("Full name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address"),
    address: yup
      .string()
      .required("Address is required")
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address must not exceed 200 characters"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^(\+212|0)[5-7]\d{8}$/,
        "Please enter a valid Moroccan phone number (e.g., +212600000000 or 0600000000)"
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    password_confirmation: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

const ProviderRegisterPage = () => {
  const { status } = useSelector((state) => state.auth.userRegister);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('Status in store :', status);

  const [generalError, setGeneralError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    resolver: yupResolver(providerSchema),
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setGeneralError(null);

    try {
      // Add role as provider
      const formData = {
        ...data,
        role: "provider",
      };

      const response = await dispatch(userRegister(formData));

      if (response.meta.requestStatus === 'rejected') {
        const errorPayload = response.payload;

        if (errorPayload && errorPayload.errors) {
          const backendErrors = errorPayload.errors;

          Object.keys(backendErrors).forEach(fieldName => {
            setError(fieldName, {
              type: 'server',
              message: backendErrors[fieldName][0],
            });
          });

          if (errorPayload.message) {
            setGeneralError(errorPayload.message);
          }

        } else if (errorPayload && errorPayload.message) {
          setGeneralError(errorPayload.message);
        } else {
          setGeneralError("Registration failed due to an unknown error.");
        }

      } else if (response.meta.requestStatus === 'fulfilled') {
        // SUCCESS LOGIC
        navigate("/login")
      }
    } catch (error) {
      console.error("Error:", error);
      setGeneralError("An unexpected client-side error occurred. Please try again.");
    }
  };

  // Password strength indicator
  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength === 3)
      return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength === 4)
      return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 lg:flex">
      <Link
        to="/"
        className="fixed top-6 left-6 z-10 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-white/30 transition-colors hidden lg:block" // Hidden on small screens, fixed on large
        aria-label="Return to Home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      {/* 1. Info Section */}
      <div
        className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] text-white py-20 px-4 sm:px-6 lg:px-8 shadow-xl lg:w-1/2 lg:flex lg:flex-col lg:items-center"
      >
        <div className="max-w-xl mx-auto">

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
              <Briefcase className="w-10 h-10" />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8 justify-center md:justify-start lg:justify-center">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Join as a Service Provider</h2>
              <p className="text-green-100 text-lg">Start your journey with Fidarek</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-1 gap-6 max-w-4xl mx-auto lg:max-w-none">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center md:text-left hover:bg-white/20 transition-all lg:text-center">
              <CheckCircle2 className="w-10 h-10 mb-3 mx-auto md:mx-0 lg:mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Get More Customers</h3>
              <p className="text-sm opacity-90">Reach thousands of potential clients looking for your services</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center md:text-left hover:bg-white/20 transition-all lg:text-center">
              <CheckCircle2 className="w-10 h-10 mb-3 mx-auto md:mx-0 lg:mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Manage Your Business</h3>
              <p className="text-sm opacity-90">Easy dashboard to handle bookings and track your earnings</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center md:text-left hover:bg-white/20 transition-all lg:text-center">
              <CheckCircle2 className="w-10 h-10 mb-3 mx-auto md:mx-0 lg:mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Build Your Reputation</h3>
              <p className="text-sm opacity-90">Earn reviews and ratings to grow your business</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Registration Form Container (Right Side) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 lg:w-1/2 ">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Create Provider Account</h1>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            {generalError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-semibold">{generalError}</p>
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Account Approval Required</h4>
                  <p className="text-sm text-amber-800">
                    After registration, your account will be reviewed by our admin team. You will not be able to login until your account is approved. We'll notify you via email once approved.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 ${errors.name ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#2ECC71] focus:ring-green-100'
                      }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name.message}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#2ECC71] focus:ring-green-100'
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

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className={`w-5 h-5 ${errors.address ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <textarea
                    {...register('address')}
                    id="address"
                    rows="3"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${errors.address
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#2ECC71] focus:ring-green-100'
                      }`}
                    placeholder="Your complete address (street, city, postal code)"
                  />
                </div>
                {errors.address && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.address.message}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className={`w-5 h-5 ${errors.phone ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#2ECC71] focus:ring-green-100'
                      }`}
                    placeholder="+212 600 000 000"
                  />
                </div>
                {errors.phone && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.phone.message}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#2ECC71] focus:ring-green-100'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 ${errors.password_confirmation ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    {...register('password_confirmation')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="password_confirmation"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password_confirmation
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#2ECC71] focus:ring-green-100'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password_confirmation.message}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status == 'loading'}
                className="w-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {status == 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Provider Account'
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#2ECC71] hover:text-[#27AE60] font-bold">
                    Sign In
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

export default ProviderRegisterPage;