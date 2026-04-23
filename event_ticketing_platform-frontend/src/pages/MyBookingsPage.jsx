import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { fetchOrdersByUser } from "../services/orderService";

export default function MyBookingsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;

      try {
        const data = await fetchOrdersByUser(user.id);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        alert(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <PageHero
        title="My Bookings"
        subtitle="Review your confirmed and recent event bookings"
      />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-4xl font-bold text-slate-900">
          Your Booking History
        </h2>

        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const tickets = Array.isArray(order.tickets) ? order.tickets : [];
              const merchandise = Array.isArray(order.merchandise)
                ? order.merchandise
                : [];

              const primaryTicket = tickets[0] || null;
              const bookingTitle = primaryTicket
                ? primaryTicket.event_title
                : "Merchandise Order";

              const reference = primaryTicket?.ticket_code || `ORDER-${order.id}`;
              const qrCode = primaryTicket?.qr_code || "";

              const totalTickets = tickets.reduce(
                (sum, ticket) => sum + Number(ticket.quantity || 0),
                0
              );

              return (
                <div
                  key={order.id}
                  className="rounded-[28px] bg-white p-6 shadow-lg"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {bookingTitle}
                      </h3>

                      <p className="mt-1 text-lg text-slate-600">
                        {primaryTicket
                          ? "Event booking"
                          : "Merchandise purchase"}
                      </p>

                      <div className="mt-4 space-y-1 text-slate-700">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {user.name || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {user.email || "N/A"}
                        </p>
                      </div>

                      <p className="mt-4 font-semibold text-blue-600">
                        Reference: {reference}
                      </p>

                      {tickets.length > 0 && (
                        <div className="mt-6">
                          <p className="mb-3 font-semibold text-slate-800">
                            Ticket Details
                          </p>

                          <div className="space-y-3">
                            {tickets.map((ticket) => (
                              <div
                                key={ticket.id}
                                className="rounded-xl bg-slate-50 p-3"
                              >
                                <p className="font-semibold text-slate-900">
                                  {ticket.event_title}
                                </p>
                                <p className="text-slate-700">
                                  Quantity: {ticket.quantity}
                                </p>
                                <p className="text-slate-700">
                                  Ticket Code: {ticket.ticket_code || "N/A"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {merchandise.length > 0 && (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-base font-bold text-slate-900">
                              Merchandise Sub-Order
                            </h4>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              {merchandise.reduce(
                                (sum, item) => sum + Number(item.quantity || 0),
                                0
                              )}{" "}
                              item(s)
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {merchandise.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-xl bg-white p-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-slate-900">
                                      {item.name}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      Quantity: {item.quantity}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      Unit Price: $
                                      {Number(item.unit_price || 0).toFixed(2)}
                                    </p>
                                  </div>

                                  <p className="font-semibold text-slate-900">
                                    ${Number(item.subtotal || 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {qrCode && (
                        <div className="mt-6">
                          <p className="mb-3 font-semibold text-slate-800">
                            Ticket QR Code
                          </p>

                          <div className="inline-block rounded-xl border border-slate-200 p-3">
                            <img
                              src={qrCode}
                              alt="Ticket QR Code"
                              className="h-24 w-24 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-left lg:min-w-[220px] lg:text-right">
                      <p className="text-xl font-bold text-slate-900">
                        Tickets: {totalTickets}
                      </p>

                      <p className="mt-2 text-xl font-bold text-slate-900">
                        Amount: ${Number(order.total_amount || 0).toFixed(2)}
                      </p>

                      <span className="mt-4 inline-flex rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                        {order.payment_status || "Confirmed"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
