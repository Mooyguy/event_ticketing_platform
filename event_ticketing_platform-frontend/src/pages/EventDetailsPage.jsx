import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import PageHero from "../components/ui/PageHero";
import EventCard from "../components/ui/EventCard";
import { fetchEventById } from "../services/eventService";
import { fetchRecommendedEvents } from "../services/recommendationService";
import { addToCart, addMerchToCart } from "../services/cartService";
import { formatCurrency } from "../utils/formatCurrency";
import getCategoryImage from "../utils/getCategoryImage";
import {
  fetchMerchandiseByEvent,
  fetchRecommendedMerchandise,
} from "../services/merchandiseService";

export default function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [loadingMerch, setLoadingMerch] = useState(true);
  const [loadingRecommendedMerch, setLoadingRecommendedMerch] = useState(true);

  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const [merchandise, setMerchandise] = useState([]);
  const [recommendedMerch, setRecommendedMerch] = useState([]);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const data = await fetchRecommendedEvents(id);
        setRecommendedEvents(data || []);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setRecommendedEvents([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    if (id) {
      loadRecommendations();
    }
  }, [id]);

  useEffect(() => {
    const loadMerchandise = async () => {
      try {
        setLoadingMerch(true);
        const data = await fetchMerchandiseByEvent(id);
        setMerchandise(data || []);
      } catch (err) {
        console.error("Failed to load merchandise:", err);
        setMerchandise([]);
      } finally {
        setLoadingMerch(false);
      }
    };

    if (id) {
      loadMerchandise();
    }
  }, [id]);

  useEffect(() => {
    const loadRecommendedMerch = async () => {
      try {
        if (!event?.category) {
          setRecommendedMerch([]);
          return;
        }

        setLoadingRecommendedMerch(true);
        const data = await fetchRecommendedMerchandise(event.category);
        setRecommendedMerch(data || []);
      } catch (err) {
        console.error("Failed to load recommended merchandise:", err);
        setRecommendedMerch([]);
      } finally {
        setLoadingRecommendedMerch(false);
      }
    };

    if (event?.category) {
      loadRecommendedMerch();
    }
  }, [event]);

  const showTemporaryMessage = (message) => {
    setCartMessage(message);
    setTimeout(() => setCartMessage(""), 2500);
  };

  const handleAddToCart = () => {
    if (!event) return;

    if (Number(event.seatsLeft) <= 0) {
      showTemporaryMessage("This event is sold out.");
      return;
    }

    addToCart(event, Number(quantity));
    showTemporaryMessage(`${quantity} ticket(s) added to cart.`);
  };

  const handleAddMerchToCart = (item) => {
    if (Number(item.stock) <= 0) {
      showTemporaryMessage("This merchandise item is out of stock.");
      return;
    }

    addMerchToCart(item, 1);
    showTemporaryMessage(`${item.name} added to cart.`);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="rounded-[24px] bg-white p-8 text-center text-lg shadow-lg">
          Loading event...
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="rounded-[24px] bg-red-100 p-8 text-center text-lg text-red-700 shadow-lg">
          {error || "Event not found."}
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

  const safeImage = event.image || getCategoryImage(event.category);
  const isSoldOut = Number(event.seatsLeft) <= 0;

  return (
    <>
      <PageHero
        title={event.title}
        subtitle="View full event details and add tickets to your cart"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-lg">
            <div className="relative h-64 bg-slate-200 sm:h-80 lg:h-[420px]">
              <img
                src={safeImage}
                alt={event.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getCategoryImage(event.category);
                }}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-6 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  {event.category}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                    isSoldOut ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {isSoldOut ? "Sold Out" : event.status || "Available"}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900">{event.title}</h2>

              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{event.date}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>
                    {event.venue}
                    {event.location ? `, ${event.location}` : ""}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{event.seatsLeft} seats left</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">About this event</h3>
                <p className="mt-3 leading-7 text-slate-700">
                  {event.description || "No description available for this event."}
                </p>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <h3 className="text-2xl font-bold text-slate-900">Booking Summary</h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Price per ticket</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(event.price)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Availability</span>
                <span className="font-semibold text-slate-900">
                  {isSoldOut ? "Sold Out" : `${event.seatsLeft} seats left`}
                </span>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, Number(event.seatsLeft))}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  disabled={isSoldOut}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(Number(event.price) * Number(quantity))}
                  </span>
                </div>
              </div>
            </div>

            {cartMessage && (
              <div className="mt-5 rounded-xl bg-blue-100 p-4 text-blue-700">
                {cartMessage}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
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

        <section className="mt-14">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Official Merchandise
            </h3>
            <p className="mt-2 text-slate-600">
              Add event merchandise to your cart.
            </p>
          </div>

          {loadingMerch ? (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              Loading merchandise...
            </div>
          ) : merchandise.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {merchandise.map((item) => (
                <div key={item.id} className="rounded-[24px] bg-white p-4 shadow-lg">
                  <img
                    src={item.image || getCategoryImage(item.category)}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getCategoryImage(item.category);
                    }}
                    className="h-48 w-full rounded-xl object-cover"
                  />

                  <h4 className="mt-4 text-lg font-bold text-slate-900">
                    {item.name}
                  </h4>

                  <p className="mt-2 text-sm text-slate-600">
                    {item.description || "Official event merchandise"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-sm text-slate-500">
                      Stock: {item.stock}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleAddMerchToCart(item)}
                      disabled={Number(item.stock) <= 0}
                      className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {Number(item.stock) > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <Link
                      to={`/merchandise/${item.id}`}
                      className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              No merchandise available for this event.
            </div>
          )}
        </section>

        <section className="mt-14">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Recommended Merchandise
            </h3>
            <p className="mt-2 text-slate-600">
              Suggested merchandise based on this event category.
            </p>
          </div>

          {loadingRecommendedMerch ? (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              Loading recommended merchandise...
            </div>
          ) : recommendedMerch.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {recommendedMerch.map((item) => (
                <div key={item.id} className="rounded-[24px] bg-white p-4 shadow-lg">
                  <img
                    src={item.image || getCategoryImage(item.category)}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getCategoryImage(item.category);
                    }}
                    className="h-48 w-full rounded-xl object-cover"
                  />

                  <h4 className="mt-4 text-lg font-bold text-slate-900">
                    {item.name}
                  </h4>

                  <p className="mt-2 text-sm text-slate-600">
                    {item.description || "Recommended merchandise"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-sm text-slate-500">
                      Stock: {item.stock}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleAddMerchToCart(item)}
                      disabled={Number(item.stock) <= 0}
                      className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {Number(item.stock) > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <Link
                      to={`/merchandise/${item.id}`}
                      className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              No recommended merchandise available right now.
            </div>
          )}
        </section>

        <section className="mt-14">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              You May Also Like
            </h3>
            <p className="mt-2 text-slate-600">
              Similar events based on your current selection.
            </p>
          </div>

          {loadingRecommendations ? (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              Loading recommendations...
            </div>
          ) : recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {recommendedEvents.map((recommendedEvent) => (
                <EventCard key={recommendedEvent.id} event={recommendedEvent} />
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