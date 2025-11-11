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
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminServicesPage from "./pages/Admin/AdminServicesPage";
import AdminReviewsPage from "./pages/Admin/AdminReviewsPage";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage";
import ProviderServicePage from "./pages/Provider/ProviderServicePage";
import FAQPage from "./pages/FAQPage";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {/* <ToastContainer position="top-right" autoClose={3000}/> */}
      <Toaster richColors position="top-right"/>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/register" element={<UserRegisterPage />} />
          <Route path="/provider/register" element={<ProviderRegisterPage />} />
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/faq" element={<FAQPage />} />

            <Route path="/services" element={<ServicesPage />} />
            <Route path="/service/:id" element={<DetailServicePage />} />
            <Route
              path="/user/reservation"
              element={<UserReservationsPage />}
            />
          </Route>
          <Route path="/provider" element={<DashboardLayout />}>
            <Route path="dashboard" element={<ProviderDasboardPage />} />
            <Route path="service" element={<ProviderServicePage />} />
            <Route path="reservations" element={<ProviderReservationsPage />} />
            <Route path="reviews" element={<ProviderReviewsPage />} />
          </Route>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="dashboard" element={<AdminDasboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
