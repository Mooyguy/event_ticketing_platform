import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { createEvent } from "../services/adminEventService";

export default function AdminCreateEventPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    event_date: "",
    event_time: "",
    venue: "",
    location: "",
    price: "",
    status: "Available",
    image: "",
    description: "",
    seats_left: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEvent({
        ...formData,
        price: Number(formData.price),
        seats_left: Number(formData.seats_left),
      });

      navigate("/admin/events");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <PageHero title="Create Event" subtitle="Add a new event to the platform" />

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[28px] bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input name="seats_left" type="number" placeholder="Seats Left" value={formData.seats_left} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
            <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="h-12 rounded-xl border px-4 md:col-span-2" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="rounded-xl border px-4 py-3 md:col-span-2" rows="5" required />
            <div className="md:col-span-2">
              <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                Create Event
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}