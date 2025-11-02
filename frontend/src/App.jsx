import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProviderRegisterPage from "./pages/Register/ProviderRegisterPage";
import UserRegisterPage from "./pages/Register/UserRegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicePage";
import UserReservationsPage from "./pages/User/UserReservationsPage";
import DetailServicePage from "./pages/DetailServicePage";
import UserLayout from "./Layouts/UserLayout";
import ProviderDasboardPage from "./pages/Provider/ProviderDasboardPage";
import ProviderReservationsPage from "./pages/Provider/ProviderReservationsPage";
import ProviderLayout from "./Layouts/ProviderLayout";
import ProviderReviewsPage from "./pages/Provider/ProviderReviewsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/user/register" element={<UserRegisterPage/>}/>
          <Route path="/provider/register" element={<ProviderRegisterPage/>}/>
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/service/:id" element={<DetailServicePage />} />
            <Route path="/user/reservation" element={<UserReservationsPage />}/>
          </Route>
          <Route path="/provider" element={<ProviderLayout/>}>
            <Route path="dashboard" element={<ProviderDasboardPage />} />
            <Route path="dashboard/reservations" element={<ProviderReservationsPage />} />
            <Route path="dashboard/reviews" element={<ProviderReviewsPage />} />
          </Route>
          <Route path="/admin/dashboard" element={<LoginPage />} />
          <Route path="/admin/dashboard/users" element={<LoginPage />} />
          <Route path="/admin/dashboard/categories" element={<LoginPage />} />
          <Route path="/admin/dashboard/services" element={<LoginPage />} />
          <Route path="/admin/dashboard/reviews" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
