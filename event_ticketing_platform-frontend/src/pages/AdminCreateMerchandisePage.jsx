import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import {
  createMerchandise,
  fetchAllEventsForMerchForm,
} from "../services/merchandiseService";

const initialForm = {
  event_id: "",
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  category: "",
  status: "Available",
};

export default function AdminCreateMerchandisePage() {
  const [formData, setFormData] = useState(initialForm);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const data = await fetchAllEventsForMerchForm();
        setEvents(data);
      } catch (err) {
        alert(err.message || "Failed to load events");
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await createMerchandise({
        ...formData,
        event_id: formData.event_id ? Number(formData.event_id) : null,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });

      navigate("/admin/merchandise");
    } catch (err) {
      alert(err.message || "Failed to create merchandise");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Create Merchandise"
        subtitle="Add a new merchandise item for users to buy"
      />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">Linked Event</label>
              <select
                name="event_id"
                value={formData.event_id}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
              >
                <option value="">General Merchandise (No Specific Event)</option>
                {!loadingEvents &&
                  events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Apparel, Accessories, Souvenir"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Stock</label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Merchandise"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}