import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import EventCard from "../components/ui/EventCard";
import { formatCurrency } from "../utils/formatCurrency";
import { fetchRecommendedEvents } from "../services/recommendationService";

export default function BookingSuccessPage() {
  const location = useLocation();
  const booking = location.state;

  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!booking?.event_id) {
        setLoadingRecommendations(false);
        return;
      }

      try {
        const data = await fetchRecommendedEvents(booking.event_id);
        setRecommendedEvents(data);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [booking]);

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageHero
        title="Booking Successful"
        subtitle="Your ticket has been confirmed successfully"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600">
              Booking Confirmed 🎉
            </h2>
            <p className="mt-3 text-slate-600">
              Your booking has been completed successfully.
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {booking.user_name}
              </p>
              <p>
                <strong>Email:</strong> {booking.user_email}
              </p>
              <p>
                <strong>Event:</strong> {booking.eventTitle}
              </p>
              <p>
                <strong>Tickets:</strong> {booking.quantity}
              </p>
              <p>
                <strong>Ticket Code:</strong> {booking.ticketCode}
              </p>
              {booking.amount !== undefined && (
                <p>
                  <strong>Amount Paid:</strong> {formatCurrency(booking.amount)}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              {booking.qrCode ? (
                <>
                  <p className="mb-3 text-lg font-semibold text-slate-800">
                    Your QR Ticket
                  </p>
                  <img
                    src={booking.qrCode}
                    alt="Ticket QR Code"
                    className="w-48 rounded-lg border border-slate-200 sm:w-56"
                  />
                </>
              ) : (
                <p className="text-slate-500">QR code not available.</p>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/my-bookings"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View My Bookings
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50"
            >
              Back to Events
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              You May Also Like
            </h3>
            <p className="mt-2 text-slate-600">
              Recommended events based on your recent booking.
            </p>
          </div>

          {loadingRecommendations ? (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              Loading suggestions...
            </div>
          ) : recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {recommendedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              No recommendations available right now.
            </div>
          )}
        </section>
      </main>
    </>
  );
}