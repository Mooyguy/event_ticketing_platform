import React, { useState } from "react";
import PageHero from "../components/ui/PageHero";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <>
      <PageHero
        title="Login"
        subtitle="Access your AllEventsHub account"
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-14 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-14 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="h-14 w-full rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 sm:text-lg"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </>
  );
}