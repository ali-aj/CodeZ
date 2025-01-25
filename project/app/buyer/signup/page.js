"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerSignupPage() {
  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submit
  async function handleSignup(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/buyer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address, password }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Signup successful!");
        router.push("/buyer/login"); // redirect to login, or wherever you want
      } else {
        alert(data.error || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-green-700">
          Buyer Signup
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. 0300-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. Lahore, Punjab"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Choose a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/buyer/login")}
            className="cursor-pointer font-semibold text-green-700 hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </main>
  );
}
