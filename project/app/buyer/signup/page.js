"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BuyerSignupPage() {
  const router = useRouter()

  // Form fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")

  // Handle form submit
  async function handleSignup(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/buyer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address, password }),
      })
      const data = await res.json()

      if (data.success) {
        alert("Signup successful!")
        router.push("/buyer/login")
      } else {
        alert(data.error || "Signup failed!")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("An error occurred during signup.")
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-black p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl">
        <div className="bg-black p-6">
          <h1 className="text-center text-3xl font-bold text-white">Buyer Signup</h1>
        </div>
        <form onSubmit={handleSignup} className="space-y-6 p-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 transition-all duration-300 ease-in-out focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 transition-all duration-300 ease-in-out focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="e.g. 0300-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 transition-all duration-300 ease-in-out focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              id="address"
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 transition-all duration-300 ease-in-out focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="e.g. Lahore, Punjab"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 transition-all duration-300 ease-in-out focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Choose a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <div className="bg-gray-50 p-4">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/buyer/login")}
              className="cursor-pointer font-semibold text-black transition-all duration-300 ease-in-out hover:text-gray-800"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </main>
  )
}

