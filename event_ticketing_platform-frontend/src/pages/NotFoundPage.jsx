import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
      <p className="mt-4 text-2xl font-semibold">Page not found</p>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white"
      >
        Back to Home
      </Link>
    </main>
  );
}