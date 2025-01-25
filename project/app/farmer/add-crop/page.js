"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCropPage() {
  const router = useRouter();

  // Wizard step (1 to 3)
  const [step, setStep] = useState(1);

  // Form fields
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");

  // Move to next step
  const handleNext = (e) => {
    e.preventDefault();
    // Basic validation per step, if needed
    if (step === 1 && !cropName) {
      alert("براہ کرم فصل کا نام درج کریں۔");
      return;
    }
    if (step === 2 && !quantity) {
      alert("براہ کرم فصل کی مقدار درج کریں۔");
      return;
    }
    // If we are on step 3, we'll submit instead of going to step 4
    if (step === 3 && !pricePerKg) {
      alert("براہ کرم ایک کلوگرام کی قیمت درج کریں۔");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // If we're already on step 3, handle the final submission
      handleSubmit();
    }
  };

  // Move to previous step
  const handleBack = (e) => {
    e.preventDefault();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Final submission (on step 3)
  const handleSubmit = async () => {
    const farmerId = localStorage.getItem("farmerId");

    try {
      const bodyData = {
        farmerId,
        cropName,
        quantity,
        pricePerKg,
      };

      const res = await fetch("/api/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();

      if (data.success) {
        alert("فصل کامیابی سے شامل ہوگئی!");
        router.push("/farmer/dashboard"); // Go back to dashboard
      } else {
        alert(data.error || "فصل محفوظ کرنے میں مسئلہ ہوا۔");
      }
    } catch (error) {
      console.error("Error adding crop:", error);
      alert("کوئی مسئلہ ہوا، دوبارہ کوشش کریں۔");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          نئی فصل شامل کریں
        </h2>

        {/* Step 1: Crop Name */}
        {step === 1 && (
          <form className="space-y-4">
            <label className="block font-medium text-gray-700">
              فصل کا نام بتائیں
            </label>
            <input
              type="text"
              placeholder="مثال: گندم / دھان / مکئی"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />

            <div className="flex items-center justify-between">
              {/* No "Back" button on first step */}
              <div />
              <button
                onClick={handleNext}
                className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                اگلا سوال
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Quantity */}
        {step === 2 && (
          <form className="space-y-4">
            <label className="block font-medium text-gray-700">
              فصل کی مقدار کلوگرام میں درج کریں
            </label>
            <input
              type="number"
              min="1"
              placeholder="مثال: 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                پچھلا سوال
              </button>
              <button
                onClick={handleNext}
                className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                اگلا سوال
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Price */}
        {step === 3 && (
          <form className="space-y-4">
            <label className="block font-medium text-gray-700">
              ایک کلوگرام کی قیمت بتائیں
            </label>
            <input
              type="number"
              min="1"
              placeholder="مثال: 50 (روپے)"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                پچھلا سوال
              </button>
              <button
                onClick={handleNext}
                className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                محفوظ کریں
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
