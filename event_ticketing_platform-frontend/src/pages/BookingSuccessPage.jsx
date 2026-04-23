import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import EventCard from "../components/ui/EventCard";
import { fetchRecommendedEvents } from "../services/recommendationService";

export default function BookingSuccessPage() {
  const location = useLocation();
  const state = location.state;

  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!state) return;

      const firstEventId = state?.event_id;

      if (!firstEventId) {
        setRecommendedEvents([]);
        setLoadingRecommendations(false);
        return;
      }

      try {
        setLoadingRecommendations(true);
        const data = await fetchRecommendedEvents(firstEventId);
        setRecommendedEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setRecommendedEvents([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [state]);

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const {
    orderId,
    user_name,
    user_email,
    eventTitle,
    quantity,
    amount,
    ticketCode,
    qrCode,
  } = state;

  return (
    <>
      <PageHero
        title="Booking Successful"
        subtitle="Your ticket has been confirmed successfully"
      />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[28px] bg-white p-6 shadow-lg sm:p-8 lg:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-5xl font-bold text-green-600">
              Booking Confirmed 🎉
            </h2>
            <p className="mt-3 text-xl text-slate-600">
              Your booking has been completed successfully.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="space-y-4 text-lg text-slate-900">
              <p>
                <span className="font-bold">Name:</span> {user_name || "N/A"}
              </p>

              <p>
                <span className="font-bold">Email:</span> {user_email || "N/A"}
              </p>

              <p>
                <span className="font-bold">Event:</span> {eventTitle || "N/A"}
              </p>

              <p>
                <span className="font-bold">Tickets:</span> {quantity || 0}
              </p>

              <p>
                <span className="font-bold">Ticket Code:</span>{" "}
                {ticketCode || "N/A"}
              </p>

              <p>
                <span className="font-bold">Amount Paid:</span> $
                {Number(amount || 0).toFixed(2)}
              </p>

              {orderId && (
                <p>
                  <span className="font-bold">Order ID:</span> #{orderId}
                </p>
              )}
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-3xl font-bold text-slate-900">
                Your QR Ticket
              </h3>

              {qrCode ? (
                <div className="inline-block rounded-2xl border border-slate-200 p-4">
                  <img
                    src={qrCode}
                    alt="QR Ticket"
                    className="mx-auto h-44 w-44 object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 p-8 text-slate-500">
                  No QR code available
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/my-bookings"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              View My Bookings
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
            >
              Back to Events
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <h3 className="text-4xl font-bold text-slate-900">You May Also Like</h3>
          <p className="mt-2 text-lg text-slate-600">
            Recommended events based on your recent booking.
          </p>

          <div className="mt-6">
            {loadingRecommendations ? (
              <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
                Loading recommendations...
              </div>
            ) : recommendedEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {recommendedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
                No recommendations available right now.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}




// import React from "react";
// import { Link, Navigate, useLocation } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";

// export default function BookingSuccessPage() {
//   const location = useLocation();
//   const state = location.state;

//   if (!state) {
//     return <Navigate to="/" replace />;
//   }

//   const {
//     orderId,
//     user_name,
//     user_email,
//     eventTitle,
//     quantity,
//     amount,
//     ticketCode,
//     qrCode,
//   } = state;

//   return (
//     <>
//       <PageHero
//         title="Booking Confirmed"
//         subtitle="Your ticket has been confirmed successfully"
//       />

//       <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
//         <div className="rounded-[28px] bg-white p-6 shadow-lg sm:p-10">
//           <div className="mb-8 text-center">
//             <h2 className="text-4xl font-bold text-green-600">
//               Booking Confirmed 🎉
//             </h2>
//             <p className="mt-3 text-lg text-slate-600">
//               Your booking has been completed successfully.
//             </p>
//           </div>

//           <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
//             <div className="space-y-4 text-slate-800">
//               <p>
//                 <span className="font-bold">Order ID:</span> #{orderId}
//               </p>
//               <p>
//                 <span className="font-bold">Name:</span> {user_name || "N/A"}
//               </p>
//               <p>
//                 <span className="font-bold">Email:</span> {user_email || "N/A"}
//               </p>
//               <p>
//                 <span className="font-bold">Event:</span> {eventTitle || "N/A"}
//               </p>
//               <p>
//                 <span className="font-bold">Tickets / Items:</span>{" "}
//                 {quantity || 0}
//               </p>
//               <p>
//                 <span className="font-bold">Ticket Code:</span>{" "}
//                 {ticketCode || "N/A"}
//               </p>
//               <p>
//                 <span className="font-bold">Amount Paid:</span> $
//                 {Number(amount || 0).toFixed(2)}
//               </p>
//             </div>

//             <div className="text-center">
//               <h3 className="mb-4 text-2xl font-bold text-slate-900">
//                 Your QR Ticket
//               </h3>

//               {qrCode ? (
//                 <div className="inline-block rounded-2xl border border-slate-200 p-4 shadow-sm">
//                   <img
//                     src={qrCode}
//                     alt="QR Ticket"
//                     className="mx-auto h-52 w-52 object-contain"
//                   />
//                 </div>
//               ) : (
//                 <div className="rounded-2xl border border-slate-200 p-8 text-slate-500">
//                   No QR code available
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mt-10 flex flex-col gap-3 sm:flex-row">
//             <Link
//               to="/my-bookings"
//               className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
//             >
//               View My Bookings
//             </Link>

//             <Link
//               to="/"
//               className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
//             >
//               Back to Events
//             </Link>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }





// import React, { useEffect, useState } from "react";
// import { Link, Navigate, useLocation } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";
// import EventCard from "../components/ui/EventCard";
// import { formatCurrency } from "../utils/formatCurrency";
// import { fetchRecommendedEvents } from "../services/recommendationService";

// export default function BookingSuccessPage() {
//   const location = useLocation();
//   const booking = location.state;
//   const isUpdated = location.state?.isUpdated;

//   const [recommendedEvents, setRecommendedEvents] = useState([]);
//   const [loadingRecommendations, setLoadingRecommendations] = useState(true);

//   useEffect(() => {
//     const loadRecommendations = async () => {
//       if (!booking?.event_id) {
//         setLoadingRecommendations(false);
//         return;
//       }

//       try {
//         const data = await fetchRecommendedEvents(booking.event_id);
//         setRecommendedEvents(data);
//       } catch (error) {
//         console.error("Failed to load recommendations:", error);
//       } finally {
//         setLoadingRecommendations(false);
//       }
//     };

//     loadRecommendations();
//   }, [booking]);

//   if (!booking) {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <>
//       <PageHero
//         title="Booking Successful"
//         subtitle="Your ticket has been confirmed successfully"
//       />
//       <h2 className="text-2xl font-bold text-green-600">
//   {isUpdated
//     ? "Booking Updated Successfully!"
//     : "Booking Confirmed!"}
// </h2>

// <p className="mt-2 text-slate-600">
//   {isUpdated
//     ? "Your existing booking has been updated with additional tickets."
//     : "Your ticket has been successfully booked."}
// </p>

// {isUpdated && (
//   <span className="inline-block mt-3 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
//     Updated Booking
//   </span>
// )}

//       <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
//         <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold text-green-600">
//               Booking Confirmed 🎉
//             </h2>
//             <p className="mt-3 text-slate-600">
//               Your booking has been completed successfully.
//             </p>
//           </div>

//           <div className="mt-8 grid gap-8 md:grid-cols-2">
//             <div className="space-y-4">
//               <p>
//                 <strong>Name:</strong> {booking.user_name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {booking.user_email}
//               </p>
//               <p>
//                 <strong>Event:</strong> {booking.eventTitle}
//               </p>
//               <p>
//                 <strong>Tickets:</strong> {booking.quantity}
//               </p>
//               <p>
//                 <strong>Ticket Code:</strong> {booking.ticketCode}
//               </p>
//               {booking.amount !== undefined && (
//                 <p>
//                   <strong>Amount Paid:</strong> {formatCurrency(booking.amount)}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-col items-center justify-center">
//               {booking.qrCode ? (
//                 <>
//                   <p className="mb-3 text-lg font-semibold text-slate-800">
//                     Your QR Ticket
//                   </p>
//                   <img
//                     src={booking.qrCode}
//                     alt="Ticket QR Code"
//                     className="w-48 rounded-lg border border-slate-200 sm:w-56"
//                   />
//                 </>
//               ) : (
//                 <p className="text-slate-500">QR code not available.</p>
//               )}
//             </div>
//           </div>

//           <div className="mt-10 flex flex-wrap gap-4">
//             <Link
//               to="/my-bookings"
//               className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
//             >
//               View My Bookings
//             </Link>

//             <Link
//               to="/"
//               className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50"
//             >
//               Back to Events
//             </Link>
//           </div>
//         </div>

//         <section className="mt-12">
//           <div className="mb-6">
//             <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
//               You May Also Like
//             </h3>
//             <p className="mt-2 text-slate-600">
//               Recommended events based on your recent booking.
//             </p>
//           </div>

//           {loadingRecommendations ? (
//             <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
//               Loading suggestions...
//             </div>
//           ) : recommendedEvents.length > 0 ? (
//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
//               {recommendedEvents.map((event) => (
//                 <EventCard key={event.id} event={event} />
//               ))}
//             </div>
//           ) : (
//             <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
//               No recommendations available right now.
//             </div>
//           )}
//         </section>
//       </main>
//     </>
//   );
// }