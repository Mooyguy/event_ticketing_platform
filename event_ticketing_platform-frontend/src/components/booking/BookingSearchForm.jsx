import React, { useState } from "react";

export default function BookingSearchForm({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] bg-white p-4 shadow-lg sm:p-6"
    >
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        Search Booking
      </h2>

      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Search using your email address or ticket code.
      </p>

      <div className="mt-5 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter email or ticket code"
          className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 sm:text-base"
        />

        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 sm:text-base md:w-auto"
        >
          Search
        </button>
      </div>
    </form>
  );
}