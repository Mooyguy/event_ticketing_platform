import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { fetchAllBookings } from "../services/bookingService";
import { fetchAllEvents } from "../services/eventService";
import { formatCurrency } from "../utils/formatCurrency";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [bookingsData, eventsData] = await Promise.all([
          fetchAllBookings(),
          fetchAllEvents(),
        ]);

        setBookings(bookingsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalRevenue = bookings.reduce((sum, booking) => {
    const quantity = Number(booking.quantity || 0);
    const price = Number(booking.price || 0);
    return sum + quantity * price;
  }, 0);

  return (
    <>
      <PageHero
        title="Admin Dashboard"
        subtitle="Manage events, view statistics, and monitor bookings"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {loading ? (
          <div className="rounded-[24px] bg-white p-6 text-center text-base shadow-lg sm:p-8 sm:text-lg">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/admin/events"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Manage Events
              </Link>

              <Link
                to="/admin/analytics"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-700"
              >
                View Analytics
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[24px] bg-white p-5 shadow-lg sm:p-6">
                <p className="text-sm text-slate-500 sm:text-base">Total Events</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                  {events.length}
                </h2>
              </div>

              <div className="rounded-[24px] bg-white p-5 shadow-lg sm:p-6">
                <p className="text-sm text-slate-500 sm:text-base">Total Bookings</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                  {bookings.length}
                </h2>
              </div>

              <div className="rounded-[24px] bg-white p-5 shadow-lg sm:p-6 sm:col-span-2 xl:col-span-1">
                <p className="text-sm text-slate-500 sm:text-base">Revenue</p>
                <h2 className="mt-2 break-words text-3xl font-bold sm:text-4xl">
                  {formatCurrency(totalRevenue)}
                </h2>
              </div>
            </div>

            <div className="mt-10 rounded-[28px] bg-white p-4 shadow-lg sm:p-6">
              <h3 className="text-xl font-bold sm:text-2xl">Event Management</h3>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm sm:text-base">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-3 pr-4">Title</th>
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Venue</th>
                      <th className="py-3 pr-4">Seats Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b align-top">
                        <td className="py-4 pr-4 font-semibold">{event.title}</td>
                        <td className="py-4 pr-4">{event.category}</td>
                        <td className="py-4 pr-4">{event.date}</td>
                        <td className="py-4 pr-4">{event.venue}</td>
                        <td className="py-4 pr-4">{event.seatsLeft}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}