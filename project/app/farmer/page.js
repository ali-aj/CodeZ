"use client"; // needed for client-side interactions

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const RecordingModal = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      onComplete(audioBlob);
    };
    
    // Stop all audio tracks
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <p className="mb-6 text-lg">براہ کرم اپنا نام بولیں</p>
        <button
          className={`w-24 h-24 rounded-full shadow-lg transform transition-transform
            ${isRecording ? 'bg-red-500 scale-110' : 'bg-blue-500 hover:scale-105'}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          <span className="sr-only">Record</span>
          <div className={`w-16 h-16 m-auto rounded-full 
            ${isRecording ? 'bg-red-600' : 'bg-blue-600'}`} />
        </button>
        <p className="mt-4 text-sm text-gray-600">
          {isRecording ? 'Recording...' : 'Press and hold to record'}
        </p>
      </div>
    </div>
  );
};

export default function FarmerPage() {
  const router = useRouter();
  const hasPlayedRef = useRef(false);
  const isListeningRef = useRef(false);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(""); // final name
  const [tempName, setTempName] = useState(""); // name from speech
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  useEffect(() => {
    if (step === 1 && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      const textToSay = "اپنا نام اُردُو میں بتائیں";
      fetch(
        `https://6vlnrk8kba.execute-api.ap-south-1.amazonaws.com/default/TextToSpeech?text=${encodeURIComponent(
          textToSay
        )}&lang=ur`
      )
        .then((res) => res.blob())
        .then((blob) => {
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.play();
          audio.onended = () => {
            setShowRecordingModal(true);
          };
        })
        .catch((err) => console.error("Error fetching TTS audio:", err));
    }
  }, [step]);

  const handleRecordingComplete = async (audioBlob) => {
    setShowRecordingModal(false);
    
    try {
      const formData = new FormData();
      formData.append("file", audioBlob);
      const res = await fetch(
        "https://6ywz12t8uf.execute-api.ap-south-1.amazonaws.com/default/SpeechToText",
        {
          method: "POST",
          body: formData,
        }
      );
      const { recognizedText } = await res.json();
      setTempName(recognizedText || "");
    } catch (err) {
      console.error("Error processing audio:", err);
    }
  };

  const handleConfirmName = (answer) => {
    if (answer === "yes") {
      setName(tempName);
    } else {
      setTempName("");
      // Optionally, you can restart the listening process
      startAutoRecording();
    }
  };

  const handleCheckFarmer = async (e) => {
    e.preventDefault();
    if (!name || !cnic) {
      alert("براہ کرم نام اور شناختی کارڈ نمبر درج کریں۔");
      return;
    }
    try {
      const response = await fetch(
        `/api/farmers/check?name=${encodeURIComponent(
          name
        )}&cnic=${encodeURIComponent(cnic)}`
      );
      const data = await response.json();
      if (data.success) {
        router.push("/farmer/dashboard");
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error("Error checking farmer:", error);
      alert("کوئی مسئلہ ہوا، دوبارہ کوشش کریں۔");
    }
  };

  const handleRegisterFarmer = async (e) => {
    e.preventDefault();
    if (!phone) {
      alert("براہ کرم فون نمبر درج کریں۔");
      return;
    }
    try {
      const response = await fetch("/api/farmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, cnic, phone }),
      });
      const data = await response.json();
      if (data.success) {
        router.push("/farmer/dashboard");
      } else {
        alert(data.error || "رجسٹریشن ناکام رہی۔ دوبارہ کوشش کریں۔");
      }
    } catch (error) {
      console.error("Error registering farmer:", error);
      alert("کوئی مسئلہ ہوا، دوبارہ کوشش کریں۔");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {showRecordingModal && (
        <RecordingModal onComplete={handleRecordingComplete} />
      )}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        {step === 1 && (
          <>
            {tempName === "" && (
              <p className="mb-4">براہ کرم اپنا نام بولیں...</p>
            )}

            {tempName && (
              <div className="mb-4">
                <p>کیا آپ کا نام یہی ہے؟: {tempName}</p>
                <button
                  onClick={() => handleConfirmName("yes")}
                  className="inline-block mr-2 rounded bg-blue-600 px-4 py-2 text-white"
                >
                  ہاں
                </button>
                <button
                  onClick={() => handleConfirmName("no")}
                  className="inline-block rounded bg-gray-600 px-4 py-2 text-white"
                >
                  نہیں
                </button>
              </div>
            )}

            {name && (
              <form onSubmit={handleCheckFarmer} className="space-y-4">
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
          </>
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
