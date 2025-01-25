"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center">
        کیا آپ کسان ہیں یا خریدار؟
      </h1>

      <div className="flex flex-row items-center gap-6">
        {/* Red Button: Farmer / کسان */}
        <button
          onClick={() => router.push("/farmer")} 
          className="px-8 py-4 text-xl font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          کسان
        </button>

        {/* Green Button: Buyer / خریدار */}
        <button
          onClick={() => router.push("/buyer/login")}
          className="px-8 py-4 text-xl font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          خریدار
        </button>
      </div>
    </main>
  );
}
