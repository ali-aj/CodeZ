"use client"; // needed for client-side interactions

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function FarmerPage() {
  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");

  // Control flow: step 1 => ask name + cnic, step 2 => ask phone
  const [step, setStep] = useState(1);

  // Check if farmer already exists
  async function handleCheckFarmer(e) {
    e.preventDefault();

    if (!name || !cnic) {
      alert("براہ کرم نام اور شناختی کارڈ نمبر درج کریں۔");
      return;
    }

    try {
      // Example GET request to check if farmer is registered
      // Adjust your actual API endpoint as needed.
      // e.g., /api/farmers/check?cnic=...
      const response = await fetch(`/api/farmers/check?cnic=${cnic}`);
      const data = await response.json();

      if (data.success) {
        // If farmer is found, navigate to next page
        // e.g., /farmer/dashboard
        router.push("/farmer/dashboard");
      } else {
        // If not found, go to step 2 to ask for phone
        setStep(2);
      }
    } catch (error) {
      console.error("Error checking farmer:", error);
      alert("کوئی مسئلہ ہوا، دوبارہ کوشش کریں۔");
    }
  }

  // Register new farmer if not found
  async function handleRegisterFarmer(e) {
    e.preventDefault();

    if (!phone) {
      alert("براہ کرم فون نمبر درج کریں۔");
      return;
    }

    try {
      // POST request to create new farmer
      const response = await fetch("/api/farmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, cnic, phone }),
      });

      const data = await response.json();

      if (data.success) {
        // Registration successful, go to next page
        router.push("/farmer/dashboard");
      } else {
        alert("رجسٹریشن ناکام رہی۔ دوبارہ کوشش کریں۔");
      }
    } catch (error) {
      console.error("Error registering farmer:", error);
      alert("کوئی مسئلہ ہوا، دوبارہ کوشش کریں۔");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        {step === 1 && (
          <form onSubmit={handleCheckFarmer} className="space-y-4">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
              کسان کا بنیادی ڈیٹا
            </h2>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                اپنا نام اُردُو میں بتائیں
              </label>
              <input
                type="text"
                placeholder="مثال: علی رضا"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                اپنا قومی شناختی کارڈ نمبر سکرین پر لکھیں
              </label>
              <input
                type="text"
                placeholder="مثال: 12345-6789012-3"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              چیک کریں
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegisterFarmer} className="space-y-4">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
              نیا کسان رجسٹر کریں
            </h2>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                فون نمبر درج کریں
              </label>
              <input
                type="text"
                placeholder="مثال: 0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              رجسٹر کریں
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
