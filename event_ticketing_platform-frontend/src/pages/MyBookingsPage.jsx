import React, { useEffect, useState } from "react";
import PageHero from "../components/ui/PageHero";
import SectionTitle from "../components/ui/SectionTitle";
import BookingCard from "../components/booking/BookingCard";
import { fetchBookingsByUser } from "../services/bookingService";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("Please login to view your bookings");
        }

        const user = JSON.parse(storedUser);

        const data = await fetchBookingsByUser(user.id);
        setBookings(data);
      } catch (err) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <>
      <PageHero
        title="My Bookings"
        subtitle="Review your confirmed and recent event bookings"
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <SectionTitle
          title="Your Booking History"
          subtitle="This page loads bookings for the currently logged-in user."
        />

        {loading && (
          <div className="rounded-[24px] bg-white p-8 text-center text-lg shadow-lg">
            Loading bookings...
          </div>
        )}

        {error && (
          <div className="rounded-[24px] bg-red-100 p-8 text-center text-lg text-red-700 shadow-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {bookings.length === 0 ? (
              <div className="rounded-[24px] bg-white p-8 text-center text-lg shadow-lg">
                No bookings found.
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}