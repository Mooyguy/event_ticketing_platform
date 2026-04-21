import React, { useEffect, useState } from "react";
import PageHero from "../components/ui/PageHero";
import { fetchAllBookings, deleteBookingById } from "../services/bookingService";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmed) return;

    try {
      await deleteBookingById(id);
      await loadBookings();
    } catch (err) {
      alert(err.message || "Failed to delete booking");
    }
  };

  const exportToCSV = () => {
    if (!bookings.length) {
      alert("No bookings to export.");
      return;
    }

    const headers = [
      "Booking ID",
      "User Name",
      "User Email",
      "Event Title",
      "Venue",
      "Quantity",
      "Ticket Code",
      "Created At",
    ];

    const rows = bookings.map((booking) => [
      booking.id,
      booking.user_name || booking.userName || "",
      booking.user_email || booking.userEmail || "",
      booking.event_title || booking.eventTitle || "",
      booking.venue || "",
      booking.quantity || "",
      booking.ticket_code || booking.ticketCode || "",
      booking.created_at || booking.createdAt || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "admin_bookings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageHero
        title="Admin Bookings"
        subtitle="View, manage, and export all platform bookings"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={exportToCSV}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>

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
              <div className="rounded-[28px] bg-white p-4 shadow-lg sm:p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    All Bookings
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Total bookings: {bookings.length}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm sm:text-base">
                    <thead>
                      <tr className="border-b text-slate-500">
                        <th className="py-3 pr-4">Booking ID</th>
                        <th className="py-3 pr-4">User</th>
                        <th className="py-3 pr-4">Email</th>
                        <th className="py-3 pr-4">Event</th>
                        <th className="py-3 pr-4">Venue</th>
                        <th className="py-3 pr-4">Quantity</th>
                        <th className="py-3 pr-4">Ticket Code</th>
                        <th className="py-3 pr-4">Created</th>
                        <th className="py-3 pr-4">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b align-top">
                          <td className="py-4 pr-4 font-semibold">
                            #{booking.id}
                          </td>

                          <td className="py-4 pr-4">
                            {booking.user_name || booking.userName || "N/A"}
                          </td>

                          <td className="py-4 pr-4">
                            {booking.user_email || booking.userEmail || "N/A"}
                          </td>

                          <td className="py-4 pr-4 font-medium">
                            {booking.event_title || booking.eventTitle || "N/A"}
                          </td>

                          <td className="py-4 pr-4">
                            {booking.venue || "N/A"}
                          </td>

                          <td className="py-4 pr-4">
                            {booking.quantity ?? "N/A"}
                          </td>

                          <td className="py-4 pr-4">
                            <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs sm:text-sm">
                              {booking.ticket_code || booking.ticketCode || "N/A"}
                            </span>
                          </td>

                          <td className="py-4 pr-4">
                            {booking.created_at
                              ? new Date(booking.created_at).toLocaleString()
                              : booking.createdAt
                              ? new Date(booking.createdAt).toLocaleString()
                              : "N/A"}
                          </td>

                          <td className="py-4 pr-4">
                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
