import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import {
  fetchAllMerchandise,
  deleteMerchandise,
} from "../services/merchandiseService";
import { formatCurrency } from "../utils/formatCurrency";

export default function AdminMerchandisePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchAllMerchandise();
      setItems(data);
    } catch (err) {
      alert(err.message || "Failed to load merchandise");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this merchandise item?");
    if (!confirmed) return;

    try {
      await deleteMerchandise(id);
      await loadItems();
    } catch (err) {
      alert(err.message || "Failed to delete merchandise");
    }
  };

  return (
    <>
      <PageHero
        title="Manage Merchandise"
        subtitle="Create and manage event merchandise"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            Loading merchandise...
          </div>
        ) : (
          <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Merchandise Items
                </h2>
                <p className="mt-2 text-slate-600">
                  Total items: {items.length}
                </p>
              </div>

              <Link
                to="/admin/merchandise/create"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Add Merchandise
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 p-8 text-center text-slate-600">
                No merchandise items found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Event</th>
                      <th className="py-3 pr-4">Price</th>
                      <th className="py-3 pr-4">Stock</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="min-w-[220px] py-3 pr-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b align-top">
                        <td className="py-4 pr-4 font-semibold text-slate-900">
                          {item.name}
                        </td>

                        <td className="py-4 pr-4 text-slate-700">
                          {item.event_title || "General"}
                        </td>

                        <td className="py-4 pr-4 text-slate-700">
                          {formatCurrency(item.price)}
                        </td>

                        <td className="py-4 pr-4 text-slate-700">
                          {item.stock}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              item.status === "Available"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-4 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              to={`/admin/merchandise/edit/${item.id}`}
                              className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
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
            )}
          </div>
        )}
      </main>
    </>
  );
}