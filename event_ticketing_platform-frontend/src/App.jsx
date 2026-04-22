import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BrowseEventsPage from "./pages/BrowseEventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import SearchBookingPage from "./pages/SearchBookingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminCreateEventPage from "./pages/AdminCreateEventPage";
import AdminEditEventPage from "./pages/AdminEditEventPage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentPage from "./pages/PaymentPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import CartPage from "./pages/CartPage";
import AdminMerchandisePage from "./pages/AdminMerchandisePage";
import AdminCreateMerchandisePage from "./pages/AdminCreateMerchandisePage";
import AdminEditMerchandisePage from "./pages/AdminEditMerchandisePage";



import AdminUsersPage from "./pages/AdminUsersPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<BrowseEventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search-booking" element={<SearchBookingPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/merchandise/create"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminCreateMerchandisePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/merchandise/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminEditMerchandisePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminEventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events/create"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminCreateEventPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/merchandise"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminMerchandisePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminEditEventPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
