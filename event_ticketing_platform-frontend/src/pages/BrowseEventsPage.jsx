import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHero from "../components/ui/PageHero";
import CategoryPills from "../components/ui/CategoryPills";
import EventCard from "../components/ui/EventCard";
import { fetchAllEvents } from "../services/eventService";
import HeroSlider from "../components/ui/HeroSlider";

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

export default function BrowseEventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All Events" || event.category === selectedCategory;

      const term = searchText.trim().toLowerCase();
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.venue.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchText]);

  return (
    <>
      <PageHero
        title="Discover Amazing Events"
        subtitle="Find and book tickets for concerts, sports, workshops, and more"
      />
      <HeroSlider events={events} />
      <section className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 px-6 pb-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mt-6 flex w-full max-w-4xl items-center gap-2 rounded-full bg-white px-3 py-2 shadow-lg sm:px-4">
           
            <Search className="h-4 w-4 text-slate-400" />

  <input
    type="text"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    placeholder="Search events, venues, or locations..."
    className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-slate-400"
  />

  <button
    onClick={() => {}}
    className="rounded-full bg-blue-600 px-4 py-2 text-xs sm:px-5 sm:text-sm font-semibold text-white transition hover:bg-blue-700"
  >
    Search
  </button>
</div>

          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </section>

      <main className="px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
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
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="mt-8 rounded-[24px] bg-white p-8 text-center text-lg shadow-lg">
                  No events found.
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
