import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { fetchEventById } from "../services/eventService";
import { updateEvent } from "../services/adminEventService";

export default function AdminEditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await fetchEventById(id);

        setFormData({
          title: event.title || "",
          category: event.category || "",
          event_date: "",
          event_time: "",
          venue: event.venue || "",
          location: event.location || "",
          price: event.price || "",
          status: event.status || "Available",
          image: event.image || "",
          description: event.description || "",
          seats_left: event.seatsLeft || "",
        });
      } catch (err) {
        alert(err.message || "Failed to load event");
      }
    };

    loadEvent();
  }, [id]);

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
      await updateEvent(id, {
        ...formData,
        price: Number(formData.price),
        seats_left: Number(formData.seats_left),
      });
      navigate("/admin/events");
    } catch (err) {
      alert(err.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
          Loading event...
        </div>
      </main>
    );
  }

  return (
    <>
      <PageHero title="Edit Event" subtitle="Update event details" />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            {Object.keys(formData).map((key) => (
              <div key={key} className={key === "description" ? "md:col-span-2" : ""}>
                <label className="mb-2 block font-semibold capitalize">
                  {key.replaceAll("_", " ")}
                </label>

                {key === "description" ? (
                  <textarea
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    type={
                      key.includes("date")
                        ? "date"
                        : key.includes("time")
                        ? "time"
                        : key === "price" || key === "seats_left"
                        ? "number"
                        : "text"
                    }
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Updating..." : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
