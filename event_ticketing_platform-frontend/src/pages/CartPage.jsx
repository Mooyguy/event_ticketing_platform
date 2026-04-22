import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import PageHero from "../components/ui/PageHero";
import { formatCurrency } from "../utils/formatCurrency";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartTotal,
  getCartCount,
} from "../services/cartService";
import getCategoryImage from "../utils/getCategoryImage";

export default function CartPage() {
  const [cart, setCart] = useState(() => getCart());
  const navigate = useNavigate();

  const handleQuantityChange = (eventId, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    const updated = updateCartItemQuantity(eventId, safeQuantity);
    setCart(updated);
  };

  const handleRemove = (eventId) => {
    const updated = removeFromCart(eventId);
    setCart(updated);
  };

  const total = useMemo(() => getCartTotal(), [cart]);
  const totalTickets = useMemo(() => getCartCount(), [cart]);

  return (
    <>
      <PageHero
        title="Your Cart"
        subtitle="Review your selected events before payment"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {cart.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>

            <p className="mt-4 text-lg font-semibold text-slate-800">
              Your cart is empty.
            </p>
            <p className="mt-2 text-slate-600">
              Add event tickets to your cart before proceeding to payment.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Cart Items</h2>
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-6 space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.event_id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row"
                  >
                    <img
                      src={item.image || getCategoryImage(item.category)}
                      alt={item.eventTitle}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getCategoryImage(item.category);
                      }}
                      className="h-32 w-full rounded-xl object-cover sm:w-40"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.eventTitle}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {item.category} • {item.venue}
                      </p>

                      {item.location && (
                        <p className="mt-1 text-sm text-slate-500">
                          {item.location}
                        </p>
                      )}

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {formatCurrency(item.price)} each
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.event_id, e.target.value)
                          }
                          className="h-10 w-24 rounded-lg border border-slate-300 px-3 outline-none focus:border-blue-500"
                        />

                        <button
                          onClick={() => handleRemove(item.event_id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-bold text-slate-900">
                      {formatCurrency(Number(item.price) * Number(item.quantity))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Events</span>
                  <span className="font-semibold text-slate-900">
                    {cart.length}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Tickets</span>
                  <span className="font-semibold text-slate-900">
                    {totalTickets}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => navigate("/payment")}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Proceed to Payment
                </button>

                <Link
                  to="/"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Add More Events
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}