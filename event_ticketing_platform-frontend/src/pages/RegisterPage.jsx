import React, { useState } from "react";
import PageHero from "../components/ui/PageHero";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Registration successful. Please login.");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <>
      <PageHero
        title="Register"
        subtitle="Create your AllEventsHub account"
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
          <form onSubmit={handleRegister} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="h-14 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                placeholder="First name"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="h-14 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                placeholder="Last name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="h-14 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                placeholder="Email address"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="h-14 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                placeholder="Password"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-14 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                placeholder="Confirm password"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="h-14 w-full rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 sm:text-lg"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}