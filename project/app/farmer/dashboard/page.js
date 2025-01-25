"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function FarmerDashboardPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {/* Container */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        {/* Heading */}
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          کیا آپ نئی فصل شامل کرنا چاہتے ہیں یا اپنی فصلیں دیکھنا چاہتے ہیں؟
        </h2>

        <div className="flex flex-col gap-4">
          {/* Green Button: Add New Crop */}
          <button
            onClick={() => router.push("/farmer/add-crop")}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-xl font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            نئی فصل شامل کریں
          </button>

          {/* Red Button: View My Crops */}
          <button
            onClick={() => router.push("/farmer/my-crops")}
            className="w-full rounded-lg bg-red-600 px-4 py-3 text-xl font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            میری فصلیں دیکھیں
          </button>
        </div>
      </div>
    </main>
  );
}
