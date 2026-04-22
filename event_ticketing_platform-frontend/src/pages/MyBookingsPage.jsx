import React, { useEffect, useState } from "react";
import PageHero from "../components/ui/PageHero";
import { fetchOrdersByUser } from "../services/orderService";

export default function MyBookingsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrdersByUser(user.id);
        setOrders(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <PageHero
        title="My Orders"
        subtitle="View your tickets and merchandise purchases"
      />

      <main className="mx-auto max-w-5xl px-4 py-10">

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg">

                <h3 className="text-xl font-bold">
                  Order #{order.id}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>

                <p className="font-semibold mt-1">
                  Status: {order.payment_status}
                </p>

                {/* TICKETS */}
                <div className="mt-4">
                  <h4 className="font-bold">Tickets</h4>

                  {order.tickets.length > 0 ? (
                    order.tickets.map((t) => (
                      <p key={t.id}>
                        - {t.event_title} × {t.quantity}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No tickets</p>
                  )}
                </div>

                {/* MERCH */}
                <div className="mt-4">
                  <h4 className="font-bold">Merchandise</h4>

                  {order.merchandise.length > 0 ? (
                    order.merchandise.map((m) => (
                      <p key={m.id}>
                        - {m.name} × {m.quantity}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No merchandise</p>
                  )}
                </div>

                {/* TOTAL */}
                <div className="mt-4 font-bold text-lg">
                  Total: ${Number(order.total_amount).toFixed(2)}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </>
  );
}