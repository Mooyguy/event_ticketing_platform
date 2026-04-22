import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import {
  createBooking,
  addTicketsToBooking,
} from "../services/bookingService";
import { createMerchOrder } from "../services/merchOrderService";
import { formatCurrency } from "../utils/formatCurrency";
import { getCart, clearCart } from "../services/cartService";

function maskCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentPage() {
  const navigate = useNavigate();

  const cart = useMemo(() => getCart(), []);
  const loggedInUser = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }, []);

  const [cardName, setCardName] = useState(loggedInUser?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (!cart.length) {
    return <Navigate to="/cart" replace />;
  }

  const ticketItems = cart.filter((item) => item.type === "ticket");
  const merchItems = cart.filter((item) => item.type === "merch");

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    const cleanExpiry = expiry.trim();

    if (!cardName.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }

    if (cleanCardNumber.length !== 16) {
      setError("Card number must be 16 digits.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(cleanExpiry)) {
      setError("Expiry date must be in MM/YY format.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits.");
      return;
    }

    try {
      setProcessing(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      let updatedBooking = false;
      let finalTicketCode = "";
      let finalQrCode = "";

      for (const item of ticketItems) {
        try {
          const result = await createBooking({
            user_id: loggedInUser.id,
            user_name: loggedInUser.name,
            user_email: loggedInUser.email,
            event_id: item.event_id,
            quantity: Number(item.quantity),
          });

          finalTicketCode = result.ticketCode || finalTicketCode;
          finalQrCode = result.qrCode || finalQrCode;
        } catch (err) {
          if (err.status === 409 && err.data?.bookingExists) {
            const shouldMerge = window.confirm(
              `You already booked "${item.eventTitle}" with ${err.data.existingQuantity} ticket(s).\n\nDo you want to add ${item.quantity} more ticket(s) to your existing booking?`
            );

            if (!shouldMerge) {
              continue;
            }

            const updated = await addTicketsToBooking(
              err.data.existingBookingId,
              Number(item.quantity)
            );

            updatedBooking = true;
            finalTicketCode = updated.ticketCode || finalTicketCode;
            finalQrCode = updated.qrCode || finalQrCode;
          } else {
            throw err;
          }
        }
      }

      if (merchItems.length > 0) {
        await createMerchOrder({
          user_id: loggedInUser.id,
          items: merchItems.map((item) => ({
            merchandise_id: item.merchandise_id,
            quantity: Number(item.quantity),
          })),
        });
      }

      clearCart();

      navigate("/booking-success", {
        state: {
          user_name: loggedInUser.name,
          user_email: loggedInUser.email,
          eventTitle:
            ticketItems.length > 0 && merchItems.length > 0
              ? "Tickets and Merchandise"
              : ticketItems.length > 0
              ? "Ticket Booking"
              : "Merchandise Order",
          quantity: cart.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
          ),
          ticketCode: finalTicketCode,
          qrCode: finalQrCode,
          amount: totalAmount,
          event_id: ticketItems[0]?.event_id || null,
          isUpdated: updatedBooking,
        },
      });
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PageHero
        title="Payment"
        subtitle="Complete your payment to confirm your order"
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Payment Details</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Enter your card details to complete this payment.
            </p>

            <form onSubmit={handlePayment} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-semibold text-slate-800">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-800">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-100 p-4 text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={processing}
                  className="h-12 w-full rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {processing
                    ? "Processing Payment..."
                    : `Pay ${formatCurrency(totalAmount)}`}
                </button>

                <Link
                  to="/"
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Add More Events
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cart.map((item, index) => {
                const key =
                  item.type === "ticket"
                    ? `ticket-${item.event_id}`
                    : `merch-${item.merchandise_id}-${index}`;

                return (
                  <div key={key} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">
                        {item.type === "ticket" ? item.eventTitle : item.name}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(Number(item.price) * Number(item.quantity))}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {item.quantity} item(s) • {formatCurrency(item.price)} each
                    </div>
                  </div>
                );
              })}

              <div className="border-t pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Back to Events / Add More Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}