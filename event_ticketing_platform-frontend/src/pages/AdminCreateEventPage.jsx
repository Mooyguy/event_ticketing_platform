import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { createEvent } from "../services/adminEventService";

const initialForm = {
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
};

export default function AdminCreateEventPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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
      await createEvent({
        ...formData,
        price: Number(formData.price),
        seats_left: Number(formData.seats_left),
      });
      navigate("/admin/events");
    } catch (err) {
      alert(err.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero title="Create Event" subtitle="Add a new event to the platform" />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            {Object.entries(initialForm).map(([key]) => (
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
                    required={key !== "image" && key !== "description"}
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
                {submitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";
// import { createEvent } from "../services/adminEventService";

// export default function AdminCreateEventPage() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     event_date: "",
//     event_time: "",
//     venue: "",
//     location: "",
//     price: "",
//     status: "Available",
//     image: "",
//     description: "",
//     seats_left: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await createEvent({
//         ...formData,
//         price: Number(formData.price),
//         seats_left: Number(formData.seats_left),
//       });

//       navigate("/admin/events");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <>
//       <PageHero title="Create Event" subtitle="Add a new event to the platform" />

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
//                 Create Event
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </>
//   );
// }