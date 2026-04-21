import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";
import CategoryPills from "../components/ui/CategoryPills";
import EventCard from "../components/ui/EventCard";
import { fetchAllEvents } from "../services/eventService";
import { searchExternalEvents } from "../services/externalEventService";

const categories = [
  "All Events",
  "Music & Concerts",
  "Sports",
  "Technology",
  "Food & Drink",
  "Arts & Culture",
  "Business",
  "Education",
  "Health & Wellness",
  "Fashion",
  "Travel",
  "Community",
  "Other",
];

const heroImages = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
];

export default function BrowseEventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [events, setEvents] = useState([]);
  const [externalEvents, setExternalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const resultsRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const runExternalSearch = async () => {
      if (!searchText.trim()) {
        setExternalEvents([]);
        return;
      }

      try {
        setLoadingExternal(true);
        const data = await searchExternalEvents(searchText);
        setExternalEvents(data);
      } catch (err) {
        console.error("External search failed:", err);
        setExternalEvents([]);
      } finally {
        setLoadingExternal(false);
      }
    };

    const timer = setTimeout(runExternalSearch, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const cities = useMemo(() => {
    const uniqueCities = [
      ...new Set(
        events.map((event) => {
          const location = event.location || "";
          return location.split(",")[0].trim();
        })
      ),
    ].filter(Boolean);

    return ["All Cities", ...uniqueCities.sort()];
  }, [events]);

  const featuredEvents = useMemo(() => events.slice(0, 5), [events]);

  const trendingEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 6);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All Events" || event.category === selectedCategory;

      const city = (event.location || "").split(",")[0].trim();
      const matchesCity =
        selectedCity === "All Cities" || city === selectedCity;

      const term = searchText.trim().toLowerCase();
      const matchesSearch =
        !term ||
        (event.title || "").toLowerCase().includes(term) ||
        (event.location || "").toLowerCase().includes(term) ||
        (event.venue || "").toLowerCase().includes(term) ||
        (event.category || "").toLowerCase().includes(term);

      return matchesCategory && matchesCity && matchesSearch;
    });
  }, [events, selectedCategory, selectedCity, searchText]);

  const browsePreviewEvents = useMemo(() => {
    const categoryMap = new Map();

    for (const event of events) {
      if (
        event.category &&
        event.category !== "All Events" &&
        !categoryMap.has(event.category)
      ) {
        categoryMap.set(event.category, event);
      }
    }

    return categories
      .filter((category) => category !== "All Events")
      .map((category) => categoryMap.get(category))
      .filter(Boolean);
  }, [events]);

  const hasActiveFilters =
    searchText.trim() !== "" ||
    selectedCategory !== "All Events" ||
    selectedCity !== "All Cities";

  useEffect(() => {
    if (!hasActiveFilters || loading) return;

    const timer = setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [hasActiveFilters, selectedCategory, selectedCity, searchText, loading]);

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-10 pt-12 sm:px-6 lg:px-10 lg:pb-14 lg:pt-16">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}

            style={{
              backgroundImage: `url(${img}&auto=format&fit=crop&w=1600&q=80)`,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-slate-900/65" />

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Discover Amazing Events
            </h1>
            <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base lg:text-2xl">
              Find and book tickets for concerts, sports, workshops, and more
            </p>
          </div>

          <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-xl sm:p-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search events, venues, or locations..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 lg:min-w-[190px]">
              <MapPin className="h-4 w-4 text-slate-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {heroImages.map((_, index) => (
              <span
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === currentImage ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

             <div className="mt-6">
              <CategoryPills
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {loading && (
          <div className="rounded-[24px] bg-white p-8 text-center text-lg shadow-lg">
            Loading events...
          </div>
        )}

        {error && (
          <div className="rounded-[24px] bg-red-100 p-8 text-center text-lg text-red-700 shadow-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {searchText.trim() && (
              <section ref={resultsRef} className="mb-12">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    🌍 Worldwide Events
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Live results from Ticketmaster (global events)
                  </p>
                </div>

                {loadingExternal ? (
                  <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
                    Loading worldwide events...
                  </div>
                ) : externalEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {externalEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
                    No worldwide events found.
                  </div>
                )}
              </section>
            )}

            {hasActiveFilters ? (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Local Matching Events
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {filteredEvents.length === 0 && (
                  <div className="mt-8 rounded-[24px] bg-white p-8 text-center text-lg shadow-lg">
                    No events found.
                  </div>
                )}
              </section>
            ) : (
              <>
                <section>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      Browse Events
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {browsePreviewEvents.map((event) => (
                      <EventCard key={`browse-${event.id}`} event={event} />
                    ))}
                  </div>
                </section>

                <section className="mt-14">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      Featured Events
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {featuredEvents.slice(0, 3).map((event) => (
                      <EventCard key={`featured-${event.id}`} event={event} />
                    ))}
                  </div>
                </section>

                <section className="mt-14">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      Trending Now
                    </h2>
                    <p className="mt-2 text-slate-600">
                      Popular and highlighted events for you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {trendingEvents.map((event) => (
                      <EventCard key={`trending-${event.id}`} event={event} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}