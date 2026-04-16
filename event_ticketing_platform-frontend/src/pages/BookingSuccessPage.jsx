import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";

export default function BookingSuccessPage() {
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageHero
        title="Booking Successful"
        subtitle="Your event ticket has been confirmed"
      />

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[28px] bg-white p-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600">
              Booking Confirmed 🎉
            </h2>
            <p className="mt-3 text-slate-600">
              Your booking was completed successfully.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
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
            </div>

            <div className="flex flex-col items-center justify-center">
              {booking.qrCode && (
                <img
                  src={booking.qrCode}
                  alt="Ticket QR Code"
                  className="w-56 rounded-lg border border-slate-200"
                />
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
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
      </main>
    </>
  );
}