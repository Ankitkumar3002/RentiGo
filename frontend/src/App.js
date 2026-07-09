import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/customer/Home";
import CarsPage from "./pages/customer/CarsPage";
import AboutPage from "./pages/customer/AboutPage";
import CompanyPage from "./pages/customer/CompanyPage";
import CategoriesPage from "./pages/customer/CategoriesPage";
import VehicleDetail from "./pages/customer/VehicleDetail";
import BookingFlow from "./pages/customer/BookingFlow";
import BookingHistory from "./pages/customer/BookingHistory";

import AgencyDashboard from "./pages/agency/AgencyDashboard";
import FleetManagement from "./pages/agency/FleetManagement";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

import "./styles/main.css";

const AppContentWrapper = ({ children }) => (
  <div className="app-content">{children}</div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<AppContentWrapper><Login /></AppContentWrapper>} />
            <Route path="/register" element={<AppContentWrapper><Register /></AppContentWrapper>} />
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/vehicles/:id" element={<AppContentWrapper><VehicleDetail /></AppContentWrapper>} />

            {/* Customer, Agency, Admin */}
            <Route path="/book/:vehicleId" element={
              <ProtectedRoute roles={["customer", "agency", "admin"]}><AppContentWrapper><BookingFlow /></AppContentWrapper></ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute roles={["customer", "agency", "admin"]}><AppContentWrapper><BookingHistory /></AppContentWrapper></ProtectedRoute>
            } />

            {/* Agency only */}
            <Route path="/agency/dashboard" element={
              <ProtectedRoute roles={["agency"]}><AppContentWrapper><AgencyDashboard /></AppContentWrapper></ProtectedRoute>
            } />
            <Route path="/agency/fleet" element={
              <ProtectedRoute roles={["agency"]}><AppContentWrapper><FleetManagement /></AppContentWrapper></ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute roles={["admin"]}><AppContentWrapper><AdminDashboard /></AppContentWrapper></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={["admin"]}><AppContentWrapper><UserManagement /></AppContentWrapper></ProtectedRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
