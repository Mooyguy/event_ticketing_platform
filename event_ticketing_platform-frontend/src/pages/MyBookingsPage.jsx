import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { fetchOrdersByUser } from "../services/orderService";

export default function MyBookingsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;

      try {
        const data = await fetchOrdersByUser(user.id);
        setOrders(data);
      } catch (err) {
        alert(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const flattenedTicketBookings = orders.flatMap((order) =>
    (order.tickets || []).map((ticket) => ({
      ...ticket,
      order_total_amount: order.total_amount,
      order_payment_status: order.payment_status,
      user_name: user.name,
      user_email: user.email,
    }))
  );

  return (
    <>
      <PageHero
        title="My Bookings"
        subtitle="Review your confirmed and recent event bookings"
      />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-4xl font-bold text-slate-900">
          Your Booking History
        </h2>

        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            Loading...
          </div>
        ) : flattenedTicketBookings.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-6">
            {flattenedTicketBookings.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-[28px] bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {ticket.event_title}
                    </h3>

                    <p className="mt-1 text-lg text-slate-600">
                      {ticket.venue ||
                        ticket.location ||
                        "Event venue information available on booking"}
                    </p>

                    <div className="mt-4 space-y-1 text-slate-700">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {ticket.user_name}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {ticket.user_email}
                      </p>
                    </div>

                    <p className="mt-4 font-semibold text-blue-600">
                      Reference: {ticket.ticket_code || "N/A"}
                    </p>

                    <div className="mt-6">
                      <p className="mb-3 font-semibold text-slate-800">
                        Ticket QR Code
                      </p>

                      {ticket.qr_code ? (
                        <div className="inline-block rounded-xl border border-slate-200 p-3">
                          <img
                            src={ticket.qr_code}
                            alt="Ticket QR Code"
                            className="h-24 w-24 object-contain"
                          />
                        </div>
                      ) : (
                        <p className="text-slate-500">No QR code available</p>
                      )}
                    </div>
                  </div>

                  <div className="text-left lg:min-w-[180px] lg:text-right">
                    <p className="text-xl font-bold text-slate-900">
                      Tickets: {ticket.quantity}
                    </p>
                    <p className="mt-2 text-xl font-bold text-slate-900">
                      Amount: ${Number(ticket.order_total_amount).toFixed(2)}
                    </p>

                    <span className="mt-4 inline-flex rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                      {ticket.order_payment_status || "Confirmed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}




// import React, { useEffect, useMemo, useState } from "react";
// import { Navigate } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";
// import { fetchOrdersByUser } from "../services/orderService";

// export default function MyBookingsPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"));
//     } catch {
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       if (!user?.id) return;

//       try {
//         const data = await fetchOrdersByUser(user.id);
//         setOrders(data);
//       } catch (err) {
//         alert(err.message || "Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [user?.id]);

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <>
//       <PageHero
//         title="My Orders"
//         subtitle="View your tickets and merchandise purchases"
//       />

//       <main className="mx-auto max-w-6xl px-4 py-10">
//         {loading ? (
//           <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
//             Loading...
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
//             No orders found.
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div
//                 key={order.id}
//                 className="rounded-[24px] bg-white p-6 shadow-lg"
//               >
//                 <div className="mb-4 border-b pb-4">
//                   <h3 className="text-2xl font-bold text-slate-900">
//                     Order #{order.id}
//                   </h3>
//                   <p className="mt-1 text-slate-500">
//                     Date: {new Date(order.created_at).toLocaleDateString()}
//                   </p>
//                   <p className="mt-1 font-semibold text-slate-800">
//                     Status: {order.payment_status}
//                   </p>
//                   <p className="mt-1 text-slate-700">
//                     Name: {user?.name || "N/A"}
//                   </p>
//                   <p className="mt-1 text-slate-700">
//                     Email: {user?.email || "N/A"}
//                   </p>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-2">
//                   <div>
//                     <h4 className="mb-3 text-lg font-bold text-slate-900">
//                       Tickets
//                     </h4>

//                     {Array.isArray(order.tickets) && order.tickets.length > 0 ? (
//                       <div className="space-y-3">
//                         {order.tickets.map((ticket) => (
//                           <div
//                             key={ticket.id}
//                             className="rounded-xl bg-slate-50 p-3"
//                           >
//                             <p className="font-semibold text-slate-900">
//                               {ticket.event_title}
//                             </p>

//                             <p className="text-slate-700">
//                               Quantity: {ticket.quantity}
//                             </p>

//                             <p className="text-slate-700">
//                               Ticket Code: {ticket.ticket_code || "N/A"}
//                             </p>

//                             {ticket.qr_code && (
//                               <div className="mt-3">
//                                 <img
//                                   src={ticket.qr_code}
//                                   alt="QR Code"
//                                   className="h-28 w-28 rounded-lg border"
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-slate-500">No tickets</p>
//                     )}
//                   </div>

//                   <div>
//                     <h4 className="mb-3 text-lg font-bold text-slate-900">
//                       Merchandise
//                     </h4>

//                     {Array.isArray(order.merchandise) &&
//                     order.merchandise.length > 0 ? (
//                       <div className="space-y-3">
//                         {order.merchandise.map((item) => (
//                           <div
//                             key={item.id}
//                             className="rounded-xl bg-slate-50 p-3"
//                           >
//                             <p className="font-semibold text-slate-900">
//                               {item.name}
//                             </p>
//                             <p className="text-slate-700">
//                               Quantity: {item.quantity}
//                             </p>
//                             <p className="text-slate-700">
//                               Unit Price: ${Number(item.unit_price).toFixed(2)}
//                             </p>
//                             <p className="text-slate-700">
//                               Subtotal: ${Number(item.subtotal).toFixed(2)}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-slate-500">No merchandise</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-6 border-t pt-4 text-xl font-bold text-slate-900">
//                   Total: ${Number(order.total_amount).toFixed(2)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </>
//   );
// }