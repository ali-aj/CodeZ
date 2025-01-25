"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BuyerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/buyer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        alert("Login successful!")
        router.push("/buyer/dashboard")
      } else {
        alert(data.error || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("An error occurred during login.")
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-black p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl">
        <div className="bg-black p-6">
          <h1 className="text-center text-3xl font-bold text-white">Buyer Login</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6 p-8">
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
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 transition-all duration-300 ease-in-out focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>
        <div className="bg-gray-50 p-4">
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/buyer/signup")}
              className="cursor-pointer font-semibold text-black transition-all duration-300 ease-in-out hover:text-gray-800"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </main>
  )
}

