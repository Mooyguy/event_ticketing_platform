import React, { useEffect, useState } from "react";
import PageHero from "../components/ui/PageHero";
import { formatCurrency } from "../utils/formatCurrency";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5001/api/analytics/bookings-per-event"
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load analytics");
        }

        setAnalytics(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const totalRevenue = analytics.reduce(
    (sum, item) => sum + Number(item.revenue || 0),
    0
  );

  const totalTicketsSold = analytics.reduce(
    (sum, item) => sum + Number(item.tickets_sold || 0),
    0
  );

  const totalBookings = analytics.reduce(
    (sum, item) => sum + Number(item.total_bookings || 0),
    0
  );

  return (
    <>
      <PageHero
        title="Admin Analytics"
        subtitle="Track bookings, ticket sales, revenue, and remaining seats"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {loading && (
          <div className="rounded-[24px] bg-white p-6 text-center text-base shadow-lg sm:p-8 sm:text-lg">
            Loading analytics...
          </div>
        )}

        {error && (
          <div className="rounded-[24px] bg-red-100 p-6 text-center text-base text-red-700 shadow-lg sm:p-8 sm:text-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[24px] bg-white p-5 shadow-lg sm:p-6">
                <p className="text-sm text-slate-500 sm:text-base">Total Bookings</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                  {totalBookings}
                </h2>
              </div>

              <div className="rounded-[24px] bg-white p-5 shadow-lg sm:p-6">
                <p className="text-sm text-slate-500 sm:text-base">Tickets Sold</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                  {totalTicketsSold}
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
              <h3 className="mb-6 text-xl font-bold sm:text-2xl">
                Bookings Per Event
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm sm:text-base">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-3 pr-4">Event</th>
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 pr-4">Venue</th>
                      <th className="py-3 pr-4">Bookings</th>
                      <th className="py-3 pr-4">Tickets Sold</th>
                      <th className="py-3 pr-4">Revenue</th>
                      <th className="py-3 pr-4">Seats Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((item) => (
                      <tr key={item.id} className="border-b align-top">
                        <td className="py-4 pr-4 font-semibold">{item.title}</td>
                        <td className="py-4 pr-4">{item.category}</td>
                        <td className="py-4 pr-4">{item.venue}</td>
                        <td className="py-4 pr-4">{item.total_bookings}</td>
                        <td className="py-4 pr-4">{item.tickets_sold}</td>
                        <td className="py-4 pr-4">
                          {formatCurrency(item.revenue)}
                        </td>
                        <td className="py-4 pr-4">{item.seats_left}</td>
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