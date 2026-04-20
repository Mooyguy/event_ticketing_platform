import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { fetchAllEvents } from "../services/eventService";
import { deleteEvent } from "../services/adminEventService";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (err) {
      alert(err.message || "Failed to delete event");
    }
  };

  return (
    <>
      <PageHero
        title="Manage Events"
        subtitle="Create, edit, and delete platform events"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mb-6">
          <Link
            to="/admin/events/create"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add New Event
          </Link>
        </div>

        {loading && (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            Loading events...
          </div>
        )}

        {error && (
          <div className="rounded-[24px] bg-red-100 p-8 text-center text-red-700 shadow-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="rounded-[28px] bg-white p-4 shadow-lg sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-3 pr-4">Title</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Venue</th>
                    <th className="py-3 pr-4">Seats Left</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b align-top">
                      <td className="py-4 pr-4 font-semibold">{event.title}</td>
                      <td className="py-4 pr-4">{event.category}</td>
                      <td className="py-4 pr-4">{event.date}</td>
                      <td className="py-4 pr-4">{event.venue}</td>
                      <td className="py-4 pr-4">{event.seatsLeft}</td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/admin/events/edit/${event.id}`}
                            className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}





// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";
// import { fetchAllEvents } from "../services/eventService";
// import { deleteEvent } from "../services/adminEventService";

// export default function AdminEventsPage() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadEvents = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchAllEvents();
//       setEvents(data);
//     } catch (error) {
//       console.error("Failed to load events:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadEvents();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm("Delete this event?");
//     if (!confirmed) return;

//     try {
//       await deleteEvent(id);
//       loadEvents();
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <>
//       <PageHero title="Admin Event Management" subtitle="Create, edit, and delete events" />

//       <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
//         <div className="mb-6">
//           <Link
//             to="/admin/events/create"
//             className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
//           >
//             Create New Event
//           </Link>
//         </div>

//         {loading ? (
//           <div className="rounded-[24px] bg-white p-8 shadow-lg">Loading events...</div>
//         ) : (
//           <div className="rounded-[28px] bg-white p-6 shadow-lg overflow-x-auto">
//             <table className="min-w-full text-left">
//               <thead>
//                 <tr className="border-b text-slate-500">
//                   <th className="py-3 pr-4">Title</th>
//                   <th className="py-3 pr-4">Category</th>
//                   <th className="py-3 pr-4">Date</th>
//                   <th className="py-3 pr-4">Venue</th>
//                   <th className="py-3 pr-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {events.map((event) => (
//                   <tr key={event.id} className="border-b">
//                     <td className="py-4 pr-4 font-semibold">{event.title}</td>
//                     <td className="py-4 pr-4">{event.category}</td>
//                     <td className="py-4 pr-4">{event.date}</td>
//                     <td className="py-4 pr-4">{event.venue}</td>
//                     <td className="py-4 pr-4 flex gap-3">
//                       <Link
//                         to={`/admin/events/edit/${event.id}`}
//                         className="rounded-lg bg-amber-500 px-4 py-2 text-white"
//                       >
//                         Edit
//                       </Link>
//                       <button
//                         onClick={() => handleDelete(event.id)}
//                         className="rounded-lg bg-red-600 px-4 py-2 text-white"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </main>
//     </>
//   );
// }