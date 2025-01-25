"use client"; // needed for client-side interactions

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const RecordingModal = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const recorderRef = useRef(null);
  const rawAudioDataRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const input = audioContextRef.current.createMediaStreamSource(stream);
      scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      input.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(audioContextRef.current.destination);

      scriptProcessorRef.current.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        rawAudioDataRef.current.push(new Float32Array(channelData));
      };

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      // Stop all audio nodes
      scriptProcessorRef.current.disconnect();
      audioContextRef.current.close();

      // Convert raw audio data to WAV
      const wavBuffer = encodeWAV(rawAudioDataRef.current, audioContextRef.current.sampleRate);
      const audioBlob = new Blob([wavBuffer], { type: "audio/wav" });

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        onComplete({
          audioData: base64Audio,
          sampleRate: audioContextRef.current.sampleRate,
          sampleWidth: 2, // Typically 2 for 16-bit audio
        });
      };
    };

    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
  };

  // Function to encode raw audio data to WAV format
  const encodeWAV = (channels, sampleRate) => {
    const bufferLength = channels.reduce((acc, channel) => acc + channel.length, 0);
    const buffer = new ArrayBuffer(44 + bufferLength * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + bufferLength * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true); // Mono
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, bufferLength * 2, true);

    // Write the PCM samples
    let offset = 44;
    channels.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        const s = Math.max(-1, Math.min(1, channel[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
    });

    return view;
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
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
      const textToSay = "اپنا نام اُردُو میں بتائیں اس بٹن کو دبائیں اور جب آپ اپنا نام بول لیں تو اس بٹن کو چھوڑ دیں۔"
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

  const handleRecordingComplete = async (audioData) => {
    setShowRecordingModal(false);

    if (!audioData.audioData) {
      console.error("No audio data to send.");
      // Optionally, display an error message to the user
      const errorText = "ریکارڈنگ میں کوئی آڈیو ڈیٹا نہیں ہوا۔ براہ کرم دوبارہ کوشش کریں۔";
      try {
        const errorRes = await fetch(
          `https://6vlnrk8kba.execute-api.ap-south-1.amazonaws.com/default/TextToSpeech?text=${encodeURIComponent(
            errorText
          )}&lang=ur`
        );
        const errorBlob = await errorRes.blob();
        const audioUrl = URL.createObjectURL(errorBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (e) {
        console.error("Error playing error message:", e);
      }
      return;
    }

    try {
      // Log the audio data for debugging
      console.log("Audio data:", audioData.audioData);
      // console.log("Sample rate:", audioData.sampleRate);
      // console.log("Sample width:", audioData.sampleWidth);

      const response = await fetch(
        'http://127.0.0.1:8000/api/speech-to-text',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioData: audioData.audioData,
            sampleRate: audioData.sampleRate,
            sampleWidth: audioData.sampleWidth,
            lang: 'en-US'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("API Response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.text) {
        throw new Error("No text returned from speech recognition");
      }

      setTempName(data.text);

      // Play confirmation audio
      const confirmText = `کیا آپ کا نام ${data.text} ہے؟`;
      const confirmRes = await fetch(
        `https://6vlnrk8kba.execute-api.ap-south-1.amazonaws.com/default/TextToSpeech?text=${encodeURIComponent(
          confirmText
        )}&lang=ur`
      );
      const confirmBlob = await confirmRes.blob();
      const audioUrl = URL.createObjectURL(confirmBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("Error processing audio:", err);

      // Play error message in Urdu
      const errorText = "آڈیو پروسیسنگ میں خرابی۔ دوبارہ کوشش کریں";
      try {
        const errorRes = await fetch(
          `https://6vlnrk8kba.execute-api.ap-south-1.amazonaws.com/default/TextToSpeech?text=${encodeURIComponent(
            errorText
          )}&lang=ur`
        );
        const errorBlob = await errorRes.blob();
        const audioUrl = URL.createObjectURL(errorBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          setShowRecordingModal(true); // Show recording modal again
        };
      } catch (e) {
        console.error("Error playing error message:", e);
      }
    }
  };

  const handleConfirmName = async (answer) => {
    if (answer === "yes") {
      setName(tempName);
    } else {
      setTempName("");
      // Play prompt again
      const textToSay = "اپنا نام اُردُو میں بتائیں";
      try {
        const res = await fetch(
          `https://6vlnrk8kba.execute-api.ap-south-1.amazonaws.com/default/TextToSpeech?text=${encodeURIComponent(
            textToSay
          )}&lang=ur`
        );
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          setShowRecordingModal(true);
        };
      } catch (err) {
        console.error("Error fetching TTS audio:", err);
      }
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
              <div className="flex justify-center items-center w-full">
                <p className="mb-4 text-xl font-medium text-gray-800 text-center">
                  براہ کرم اپنا نام بولیں
                </p>
              </div>
            )}

            {tempName && (
              <div className="flex flex-col items-center justify-center w-full p-6 mb-4 bg-white rounded-lg shadow-sm">
                <p className="mb-6 text-xl font-medium text-gray-800 text-center">
                  کیا آپ کا نام یہی ہے؟:{" "}
                  <span className="font-bold text-blue-600">{tempName}</span>
                </p>
                <div className="flex gap-4 w-full max-w-[300px] justify-center">
                  <button
                    onClick={() => handleConfirmName("yes")}
                    className="flex-1 px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    ہاں
                  </button>
                  <button
                    onClick={() => handleConfirmName("no")}
                    className="flex-1 px-6 py-3 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    نہیں
                  </button>
                </div>
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
                  className="w-full rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
