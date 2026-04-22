import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";
import PageHero from "../components/ui/PageHero";
import { fetchMerchandiseById } from "../services/merchandiseService";
import { addMerchToCart } from "../services/cartService";
import { formatCurrency } from "../utils/formatCurrency";
import getCategoryImage from "../utils/getCategoryImage";

export default function MerchandiseDetailsPage() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMerchandiseById(id);
        setItem(data);
      } catch (err) {
        setError(err.message || "Failed to load merchandise");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!item) return;

    if (Number(item.stock) <= 0) {
      setMessage("This merchandise item is out of stock.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    addMerchToCart(item, Number(quantity));
    setMessage(`${quantity} item(s) added to cart.`);
    setTimeout(() => setMessage(""), 2500);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
          Loading merchandise...
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-[24px] bg-red-100 p-8 text-center text-red-700 shadow-lg">
          {error || "Merchandise not found."}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const safeImage = item.image || getCategoryImage(item.category);
  const isOutOfStock = Number(item.stock) <= 0;

  return (
    <>
      <PageHero
        title={item.name}
        subtitle="View merchandise details and add items to your cart"
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-lg">
            <div className="relative h-64 bg-slate-200 sm:h-80 lg:h-[420px]">
              <img
                src={safeImage}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getCategoryImage(item.category);
                }}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-6 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  {item.category || "Merchandise"}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                    isOutOfStock ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : item.status || "Available"}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900">{item.name}</h2>

              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{item.event_title || "General Merchandise"}</span>
                </div>

                <div className="flex items-start gap-3">
                  <ShoppingCart className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{item.stock} item(s) left in stock</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  About this item
                </h3>
                <p className="mt-3 leading-7 text-slate-700">
                  {item.description || "No description available for this item."}
                </p>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <h3 className="text-2xl font-bold text-slate-900">Order Summary</h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Price per item</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Availability</span>
                <span className="font-semibold text-slate-900">
                  {isOutOfStock ? "Out of Stock" : `${item.stock} left`}
                </span>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, Number(item.stock))}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  disabled={isOutOfStock}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(Number(item.price) * Number(quantity))}
                  </span>
                </div>
              </div>
            </div>

            {message && (
              <div className="mt-5 rounded-xl bg-blue-100 p-4 text-blue-700">
                {message}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              <Link
                to="/cart"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
              >
                Go to Cart
              </Link>

              <Link
                to="/"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}