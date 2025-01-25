"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RecordingModal } from "../../components/RecordingModal";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Mic, Crop, Weight, CreditCard, Check, X } from "lucide-react";

const cropAttributes = {
  cropName: "فصل کا نام",
  description: "فصل کی تفصیل",
  quantity: "فصل کی مقدار",
  price: "فی کلو قیمت",
  location: "فصل کی جگہ"
};

const listenForResponse = () => {
  return new Promise((resolve) => {
    // Existing voice recognition logic
    recognition.onresult = (event) => {
      const response = event.results[0][0].transcript;
      resolve(response);
    };
  });
};

export default function AddCropPage() {
  const router = useRouter();
  const hasPlayedRef = useRef(false);
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const audioRef = useRef(null);

  // Form fields with temp values for confirmation
  const [cropName, setCropName] = useState("");
  const [tempCropName, setTempCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [tempQuantity, setTempQuantity] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [tempPrice, setTempPrice] = useState("");

  const startProcess = () => {
    setIsStarted(true);
    playStepPrompt();
  };

  const playStepPrompt = async () => {
    const stepMessages = {
      1: "اپنی فصل کا نام بتائیں",
      2: "فصل کی مقدار کلوگرام میں بتائیں",
      3: "ایک کلوگرام کی قیمت بتائیں",
    };

    await playVoicePrompt(stepMessages[step]);
    setShowRecordingModal(true);
  };

  const playVoicePrompt = async (text, showModal = true) => {
    try {
      const res = await fetch(
        `https://6vlnrk8kba.execute-api.ap-south-1.amazonaws.com/default/TextToSpeech?text=${encodeURIComponent(text)}&lang=ur`
      );
      const blob = await res.blob();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(URL.createObjectURL(blob));
      await audioRef.current.play();
      if (showModal) {
        setShowRecordingModal(true);
      }
    } catch (err) {
      console.error("Error playing prompt:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  const handleRecordingComplete = async (audioData) => {
    setShowRecordingModal(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/speech-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioData: audioData.audioData,
          sampleRate: audioData.sampleRate,
          sampleWidth: audioData.sampleWidth,
          lang: "ur-PK",
        }),
      });

      const data = await response.json();
      setIsConfirming(true);

      switch (step) {
        case 1:
          setTempCropName(data.text);
          // First repeat what was heard without showing modal
          await playVoicePrompt(data.text, false);
          // Then ask for confirmation without showing modal
          setTimeout(async () => {
            await playVoicePrompt("کیا یہ درست ہے؟", false);
          }, 1500);
          break;
        case 2:
          setTempQuantity(data.text);
          await playVoicePrompt(data.text, false);
          setTimeout(async () => {
            await playVoicePrompt("کیا یہ درست ہے؟", false);
          }, 1500);
          break;
        case 3:
          setTempPrice(data.text);
          await playVoicePrompt(data.text, false);
          setTimeout(async () => {
            await playVoicePrompt("کیا یہ درست ہے؟", false);
          }, 1500);
          break;
      }
    } catch (err) {
      console.error("Error processing audio:", err);
      await playVoicePrompt("دوبارہ کوشش کریں");
      setShowRecordingModal(true);
    }
  };

  const handleConfirm = async (answer) => {
    setIsConfirming(false);
    if (answer === "yes") {
      switch (step) {
        case 1:
          setCropName(tempCropName);
          break;
        case 2:
          setQuantity(tempQuantity);
          break;
        case 3:
          setPricePerKg(tempPrice);
          handleSubmit();
          return;
      }
      setStep(step + 1);
      setTimeout(() => {
        playStepPrompt();
      }, 1000);
    } else {
      playStepPrompt();
    }
  };

  const handleSubmit = async () => {
    const farmerId = localStorage.getItem("farmerId");
    try {
      const res = await fetch("/api/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId,
          cropName,
          quantity,
          pricePerKg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await playVoicePrompt("آپ کی فصل کامیابی سے شامل کر دی گئی ہے");
        router.push("/farmer/dashboard");
      }
    } catch (error) {
      console.error("Error adding crop:", error);
      await playVoicePrompt("کوئی مسئلہ ہوا، دوبارہ کوشش کریں");
    }
  };

  const handleAttributeConfirmation = async (attribute, value) => {
    const confirmationMessage = `کیا آپ نے کہا ${attribute} ہے ${value}؟`;
    await playVoicePrompt(confirmationMessage);
    
    // Wait for voice response
    const response = await listenForResponse();
    
    if (response.toLowerCase().includes('yes')) {
      // Move to next attribute
      const attributes = Object.keys(cropAttributes);
      const currentIndex = attributes.indexOf(attribute);
      
      if (currentIndex < attributes.length - 1) {
        const nextAttribute = attributes[currentIndex + 1];
        await playVoicePrompt(cropAttributes[nextAttribute]);
      } else {
        // All attributes confirmed, submit form
        handleSubmit();
      }
    } else {
      // Ask for the same attribute again
      await playVoicePrompt(cropAttributes[attribute]);
    }
  };

  const renderStepIcon = () => {
    switch (step) {
      case 1:
        return <Crop className="h-16 w-16 text-green-600" />;
      case 2:
        return <Weight className="h-16 w-16 text-blue-600" />;
      case 3:
        return <CreditCard className="h-16 w-16 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      {!isStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Button
            onClick={startProcess}
            className="w-full py-8 text-2xl font-bold bg-green-600 hover:bg-green-700"
          >
            فصل کی معلومات شامل کرنے کے لیے یہاں کلک کریں
          </Button>
        </motion.div>
      ) : (
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            {showRecordingModal && <RecordingModal onComplete={handleRecordingComplete} />}

            <div className="text-center">
              {renderStepIcon()}
              <h2 className="text-2xl font-bold mt-4 mb-6">
                {step === 1 && "فصل کا نام"}
                {step === 2 && "فصل کی مقدار"}
                {step === 3 && "فصل کی قیمت"}
              </h2>
              {(tempCropName || tempQuantity || tempPrice) && (
                <div className="mb-6">
                  <p className="text-xl mb-4">
                    {step === 1 && `کیا آپ کی فصل ${tempCropName} ہے؟`}
                    {step === 2 && `کیا مقدار ${tempQuantity} کلوگرام ہے؟`}
                    {step === 3 && `کیا قیمت ${tempPrice} روپے فی کلو ہے؟`}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => handleConfirm("yes")} className="w-1/2 py-6 text-xl font-bold" size="lg">
                      <Check className="mr-2 h-6 w-6" />
                      ہاں
                    </Button>
                    <Button
                      onClick={() => handleConfirm("no")}
                      className="w-1/2 py-6 text-xl font-bold"
                      variant="destructive"
                      size="lg"
                    >
                      <X className="mr-2 h-6 w-6" />
                      نہیں
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
