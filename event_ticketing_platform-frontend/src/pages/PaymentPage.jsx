import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { checkoutOrder } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import { getCart, clearCart } from "../services/cartService";

function maskCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentPage() {
  const navigate = useNavigate();

  const cart = useMemo(() => getCart(), []);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const [cardName, setCardName] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  if (!cart.length) return <Navigate to="/cart" replace />;

  const ticketItems = cart
    .filter((item) => item.type === "ticket")
    .map((item) => ({
      event_id: item.event_id,
      quantity: Number(item.quantity),
    }));

  const merchItems = cart
    .filter((item) => item.type === "merch")
    .map((item) => ({
      merchandise_id: item.merchandise_id,
      quantity: Number(item.quantity),
    }));

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!cardName || cardNumber.replace(/\s/g, "").length !== 16) {
      return setError("Invalid card details");
    }

    try {
      setProcessing(true);

      const result = await checkoutOrder({
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        ticketItems,
        merchItems,
      });

      clearCart();

      navigate("/booking-success", {
        state: {
          orderId: result.orderId,
          amount: result.totalAmount,
          ticketCode: result.ticketCode,
          qrCode: result.qrCode,
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
      <PageHero title="Payment" subtitle="Complete your order securely" />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT: PAYMENT FORM */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>

            <form onSubmit={handlePayment} className="space-y-4">

              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(maskCardNumber(e.target.value))
                }
                className="w-full border p-3 rounded-lg"
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="w-full border p-3 rounded-lg"
                />

                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              {error && (
                <div className="bg-red-100 p-3 rounded text-red-700">
                  {error}
                </div>
              )}

              <button
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
              >
                {processing
                  ? "Processing..."
                  : `Pay ${formatCurrency(totalAmount)}`}
              </button>

              <Link
                to="/"
                className="block text-center border p-3 rounded-lg"
              >
                Add More Items
              </Link>
            </form>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {cart.map((item, i) => (
              <div key={i} className="flex justify-between mb-3">
                <span>
                  {item.type === "ticket"
                    ? item.eventTitle
                    : item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}