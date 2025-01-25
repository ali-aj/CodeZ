"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative h-64 bg-green-600">
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">کیا آپ کسان ہیں یا خریدار؟</h1>
          </div>
        </div>

        <div className="p-8">
          <p className="text-xl text-center text-gray-600 mb-8">
            اپنے کردار کا انتخاب کریں اور ہمارے ای کامرس پلیٹ فارم پر شروع کریں
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/farmer")}
              className="w-full md:w-auto px-8 py-4 text-xl font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-300"
            >
              کسان
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/buyer/login")}
              className="w-full md:w-auto px-8 py-4 text-xl font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-300"
            >
              خریدار
            </motion.button>
          </div>
        </div>

        <div className="bg-gray-100 p-6">
          <p className="text-center text-gray-600">
            ہمارا پلیٹ فارم کسانوں اور خریداروں کو براہ راست جوڑتا ہے، مارکیٹ تک رسائی کو آسان بناتا ہے
          </p>
        </div>
      </div>
    </main>
  )
}

