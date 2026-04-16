import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function BookingCard({ booking }) {
  if (!booking) return null;

  const quantity = Number(booking.quantity || booking.ticketCount || 0);
  const price = Number(booking.price || 0);
  const amount = Number(booking.amount ?? quantity * price);
  const status = booking.status || "Confirmed";
  const reference = booking.ticket_code || booking.bookingRef;

  return (
    <div className="rounded-[24px] bg-white p-4 shadow-lg sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {booking.event_title || booking.eventTitle || "Event Booking"}
          </h3>

          {booking.date && booking.time ? (
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {booking.date} • {booking.time}
            </p>
          ) : null}

          {booking.venue ? (
            <p className="break-words text-sm text-slate-600 sm:text-base">
              {booking.venue}
            </p>
          ) : null}

          {booking.user_name ? (
            <p className="mt-2 break-words text-sm text-slate-600 sm:text-base">
              <strong>Name:</strong> {booking.user_name}
            </p>
          ) : null}

          {booking.user_email ? (
            <p className="break-words text-sm text-slate-600 sm:text-base">
              <strong>Email:</strong> {booking.user_email}
            </p>
          ) : null}

          {reference ? (
            <p className="mt-3 break-all text-sm font-semibold text-blue-600">
              Reference: {reference}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 text-left md:min-w-[180px] md:text-right">
          <p className="text-base font-semibold sm:text-lg">
            Tickets: {quantity}
          </p>

          <p className="text-base font-semibold sm:text-lg">
            Amount: {formatCurrency(amount)}
          </p>

          <span
            className={`inline-block rounded-full px-4 py-2 text-xs font-bold text-white sm:text-sm ${
              status === "Confirmed" ? "bg-green-600" : "bg-amber-500"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {booking.qr_code ? (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Ticket QR Code
          </p>
          <img
            src={booking.qr_code}
            alt="Ticket QR Code"
            className="w-32 rounded-lg border border-slate-200 sm:w-40"
          />
        </div>
      ) : null}
    </div>
  );
}