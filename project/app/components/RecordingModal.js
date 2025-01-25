"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export const RecordingModal = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);
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
          sampleWidth: 2,
        });
      };
    };

    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
  };

  const encodeWAV = (channels, sampleRate) => {
    const bufferLength = channels.reduce((acc, channel) => acc + channel.length, 0);
    const buffer = new ArrayBuffer(44 + bufferLength * 2);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + bufferLength * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, bufferLength * 2, true);

    let offset = 44;
    channels.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        const s = Math.max(-1, Math.min(1, channel[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
    });

    return buffer;
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <p className="mb-6 text-lg text-right">آواز ریکارڈ کرنے کے لیے بٹن دبائیں اور پکڑیں</p>
        <button
          className={`w-24 h-24 rounded-full shadow-lg transform transition-transform
            ${isRecording ? 'bg-red-500 scale-110' : 'bg-blue-500 hover:scale-105'}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          <div className={`w-16 h-16 m-auto rounded-full 
            ${isRecording ? 'bg-red-600' : 'bg-blue-600'}`} />
        </button>
        <p className="mt-4 text-sm text-gray-600 text-right">
          {isRecording ? 'ریکارڈنگ جاری ہے...' : 'ریکارڈ کرنے کے لیے بٹن دبائیں'}
        </p>
      </div>
    </motion.div>
  );
};