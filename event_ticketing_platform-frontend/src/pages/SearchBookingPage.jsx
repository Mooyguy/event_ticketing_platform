import React, { useState } from "react";
import PageHero from "../components/ui/PageHero";
import BookingSearchForm from "../components/booking/BookingSearchForm";
import BookingCard from "../components/booking/BookingCard";
import { fetchAllBookings } from "../services/bookingService";

export default function SearchBookingPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchTerm) => {
    try {
      setError("");
      setSearched(true);

      const data = await fetchAllBookings();

      const filtered = data.filter(
        (booking) =>
          booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.ticket_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setResults(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to search bookings");
    }
  };

  return (
    <>
      <PageHero
        title="Search Booking"
        subtitle="Find your ticket using email or ticket code"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <BookingSearchForm onSearch={handleSearch} />

        {error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {searched && !error && results.length === 0 && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
            No matching bookings found.
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {results.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </main>
    </>
  );
}