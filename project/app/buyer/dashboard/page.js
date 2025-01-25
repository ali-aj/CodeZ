"use client"

import React, { useEffect, useState } from "react"
import { Loader2, Wheat, Leaf, MapPin, Phone, PhoneIcon as WhatsappLogo } from "lucide-react"

export default function BuyerDashboardPage() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch available crops
    fetch("/api/crop")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCrops(data.data) // array of crops
        } else {
          alert("Failed to load crops.")
        }
      })
      .catch((err) => {
        alert("An error occurred while loading crops. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
          <Loader2 className="animate-spin text-blue-500" />
          <span>Loading crops...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">Buyer Dashboard</h1>

        {crops.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Wheat className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <p className="text-xl text-gray-600">No crops available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {crops.map((crop) => (
              <div
                key={crop._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="bg-gray-900 p-4">
                  <h2 className="text-xl font-bold text-white">{crop.cropName}</h2>
                </div>
                <div className="p-6">
                  <p className="mb-2 text-lg font-semibold text-gray-800">Price: {crop.price} PKR/KG</p>
                  <p className="mb-4 text-md text-gray-600">Quantity: {crop.quantity} kg</p>
                  {crop.farmer && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Farmer Details</h3>
                      <p className="flex items-center mb-2 text-gray-700">
                        <Leaf className="mr-2 h-5 w-5 text-green-500" />
                        {crop.farmer.name}
                      </p>
                      <p className="flex items-center mb-2 text-gray-700">
                        <MapPin className="mr-2 h-5 w-5 text-red-500" />
                        {crop.farmer.location || "N/A"}
                      </p>
                      <p className="flex items-center mb-4 text-gray-700">
                        <Phone className="mr-2 h-5 w-5 text-blue-500" />
                        {crop.farmer.phone}
                      </p>
                      <a
                        href={`https://wa.me/${crop.farmer.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        <WhatsappLogo className="mr-2 h-5 w-5 text-green-400" />
                        Contact on WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

