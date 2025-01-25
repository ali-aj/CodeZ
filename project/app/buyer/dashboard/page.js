"use client";

import React, { useEffect, useState } from "react";

export default function BuyerDashboardPage() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available crops
    fetch("/api/crop")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCrops(data.data); // array of crops
        } else {
          alert("Failed to load crops.");
        }
      })
      .catch((err) => {
        alert("An error occurred while loading crops. Please try again.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-5xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Buyer Dashboard
        </h1>

        {crops.length === 0 ? (
          <p className="text-center text-gray-600">
            No crops available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crops.map((crop) => (
              <div
                key={crop._id}
                className="rounded border border-gray-300 p-4 shadow-sm"
              >
                <h2 className="mb-2 text-lg font-bold text-green-700">
                  {crop.cropName}
                </h2>
                <p className="mb-1 text-sm text-gray-700">
                  Price: {crop.price} PKR
                </p>
                <p className="mb-1 text-sm text-gray-700">
                  Quantity: {crop.quantity} kg
                </p>
                {crop.farmer && (
                  <>
                    <p className="mb-1 text-sm text-gray-700">
                      Farmer Name: {crop.farmer.name}
                    </p>
                    <p className="mb-1 text-sm text-gray-700">
                      Farmer Address: {crop.farmer.location || "N/A"}
                    </p>
                    <p className="mb-3 text-sm text-gray-700">
                      Farmer Phone: {crop.farmer.phone}
                    </p>
                    {/* WhatsApp Link */}
                    <a
                      href={`https://wa.me/${crop.farmer.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      Contact on WhatsApp
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
