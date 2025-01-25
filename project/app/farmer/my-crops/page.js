"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyCropsPage() {
  const router = useRouter();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmerId");
    if (!farmerId) {
      alert("Farmer ID not found. Please log in again.");
      router.push("/farmer"); // or wherever your login page is
      return;
    }

    // Fetch all crops for this farmer
    fetch(`/api/crop/farmer/${farmerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCrops(data.data);
        } else {
          alert("فصلیں لوڈ کرنے میں ناکامی: " + (data.error || ""));
        }
      })
      .catch((err) => {
        console.error("Error fetching crops:", err);
        alert("کوئی مسئلہ ہوا، دوبارہ کوشش کریں۔");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">لوڈ ہورہا ہے...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
          میری فصلیں
        </h1>

        {crops.length === 0 ? (
          <p className="text-center text-gray-600">
            ابھی کوئی فصلیں نہیں ہیں۔
          </p>
        ) : (
          crops.map((crop) => (
            <div
              key={crop._id}
              className="mb-4 rounded border border-gray-200 p-4"
            >
              <p className="mb-1 text-gray-700">
                <span className="font-semibold">فصل کا نام:</span>{" "}
                {crop.cropName}
              </p>
              <p className="mb-1 text-gray-700">
                <span className="font-semibold">قیمت:</span> {crop.price} روپے
              </p>
              <p className="mb-1 text-gray-700">
                <span className="font-semibold">مقدار:</span> {crop.quantity} کلو
              </p>
              <p className="mb-1 text-gray-700">
                <span className="font-semibold">کسان کا نام:</span>{" "}
                {crop.farmer?.name}
              </p>
              <p className="mb-1 text-gray-700">
                <span className="font-semibold">کسان کا پتہ:</span>{" "}
                {crop.farmer?.location || "—"}
              </p>
              <p className="mb-1 text-gray-700">
                <span className="font-semibold">کسان کا رابطہ نمبر:</span>{" "}
                {crop.farmer?.phone}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
