"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/buyer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Login successful!");
        // redirect or store user data in context, etc.
        router.push("/buyer/dashboard"); // or wherever you want after login
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-700">
          Buyer Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/buyer/signup")}
            className="cursor-pointer font-semibold text-blue-700 hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </main>
  );
}
