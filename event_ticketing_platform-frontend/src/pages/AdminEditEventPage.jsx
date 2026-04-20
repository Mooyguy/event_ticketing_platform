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







// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";
// import { fetchEventById } from "../services/eventService";
// import { updateEvent } from "../services/adminEventService";

// function formatDateForInput(displayDate) {
//   const parsed = new Date(displayDate);
//   if (Number.isNaN(parsed.getTime())) return "";
//   return parsed.toISOString().split("T")[0];
// }

// function formatTimeForInput(displayTime) {
//   if (!displayTime) return "";
//   const [time, modifier] = displayTime.split(" ");
//   if (!time || !modifier) return "";
//   let [hours, minutes] = time.split(":");
//   hours = Number(hours);

//   if (modifier === "PM" && hours !== 12) hours += 12;
//   if (modifier === "AM" && hours === 12) hours = 0;

//   return `${String(hours).padStart(2, "0")}:${minutes}`;
// }

// export default function AdminEditEventPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState(null);

//   useEffect(() => {
//     const loadEvent = async () => {
//       try {
//         const data = await fetchEventById(id);
//         setFormData({
//           title: data.title || "",
//           category: data.category || "",
//           event_date: formatDateForInput(data.date),
//           event_time: formatTimeForInput(data.time),
//           venue: data.venue || "",
//           location: data.location || "",
//           price: data.price || "",
//           status: data.status || "Available",
//           image: data.image || "",
//           description: data.description || "",
//           seats_left: data.seatsLeft || 0,
//         });
//       } catch (error) {
//         alert(error.message);
//       }
//     };

//     loadEvent();
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await updateEvent(id, {
//         ...formData,
//         price: Number(formData.price),
//         seats_left: Number(formData.seats_left),
//       });

//       navigate("/admin/events");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   if (!formData) {
//     return <div className="mx-auto max-w-4xl px-6 py-12">Loading event...</div>;
//   }

//   return (
//     <>
//       <PageHero title="Edit Event" subtitle="Update event details" />

//       <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
//         <div className="rounded-[28px] bg-white p-8 shadow-lg">
//           <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
//             <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input name="seats_left" type="number" placeholder="Seats Left" value={formData.seats_left} onChange={handleChange} className="h-12 rounded-xl border px-4" required />
//             <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="h-12 rounded-xl border px-4 md:col-span-2" />
//             <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="rounded-xl border px-4 py-3 md:col-span-2" rows="5" required />
//             <div className="md:col-span-2">
//               <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
//                 Update Event
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </>
//   );
// }