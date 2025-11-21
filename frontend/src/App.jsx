import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProviderRegisterPage from "./pages/Register/ProviderRegisterPage";
import UserRegisterPage from "./pages/Register/UserRegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import UserReservationsPage from "./pages/User/UserReservationsPage";
import DetailServicePage from "./pages/DetailServicePage";
import UserLayout from "./Layouts/UserLayout";
import ProviderDasboardPage from "./pages/Provider/ProviderDasboardPage";
import ProviderReservationsPage from "./pages/Provider/ProviderReservationsPage";
import DashboardLayout from "./Layouts/DashboardLayout";
import ProviderReviewsPage from "./pages/Provider/ProviderReviewsPage";
import AdminDasboardPage from "./pages/Admin/AdminDasboardPage";
import AdminClientsPage from "./pages/Admin/AdminClientsPage";
import AdminServicesPage from "./pages/Admin/AdminServicesPage";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage";
import ProviderServicePage from "./pages/Provider/ProviderServicePage";
import FAQPage from "./pages/FAQPage";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import AdminProvidersPage from "./pages/Admin/AdminProvidersPage";
import ClientRoute from "./components/ProtectedRoutes/ClientRoute";
import UnauthorizedPage from "./pages/Unauthorized";
import GuestRoute from "./components/ProtectedRoutes/GuestRoute";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute";
import ProviderRoute from "./components/ProtectedRoutes/ProviderRoute";
import UserRoute from "./components/ProtectedRoutes/UserRoute";
import AdminReviewPage from "./pages/Admin/AdminReviewPage";

function App() {
  return (
    <>
      {/* <ToastContainer position="top-right" autoClose={3000}/> */}
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user/register" element={<UserRegisterPage />} />
            <Route path="/provider/register" element={<ProviderRegisterPage />} />
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route element={<UserLayout />}>
            <Route element={<UserRoute/>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/service/:id" element={<DetailServicePage />} />
            </Route>
            <Route element={<ClientRoute />}>
              <Route
                path="/user/reservation"
                element={<UserReservationsPage />}
              />
            </Route>
            <Route path="/faq" element={<FAQPage />} />
          </Route>
          <Route element={<ProviderRoute />}>
            <Route path="/provider" element={<DashboardLayout />}>
              <Route path="dashboard" element={<ProviderDasboardPage />} />
              <Route path="service" element={<ProviderServicePage />} />
              <Route path="reservations" element={<ProviderReservationsPage />} />
              <Route path="reviews" element={<ProviderReviewsPage />} />
            </Route>
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="dashboard" element={<AdminDasboardPage />} />
              <Route path="providers" element={<AdminProvidersPage />} />
              <Route path="clients" element={<AdminClientsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="reviews" element={<AdminReviewPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
