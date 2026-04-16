import React from "react";

export default function PageHero({ title, subtitle }) {
  return (
    <section className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-sm sm:text-base lg:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
