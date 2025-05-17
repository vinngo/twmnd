"use client";

import { useEffect, useRef } from "react";
import { useRecordingStore } from "@/lib/stores/useRecordingStore";
import { invokeProcessing, saveBlob } from "@/lib/services/recordingService";

export default function AudioRecorderController() {
  const {
    isRecording,
    stream,
    meeting_id,
    stopRecording,
    setRecordingDuration,
    chunkIndex,
    setChunkIndex,
  } = useRecordingStore();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Track duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, setRecordingDuration]);

  // Set up audio analyzer for visualization
  useEffect(() => {
    if (isRecording && stream) {
      try {
        // Create audio context and analyzer
        audioContextRef.current = new window.AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        // Connect stream to analyzer
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        // Create data array for analyzer
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // Set up regular updates of audio level
        const updateLevel = () => {
          if (!isRecording || !analyserRef.current || !dataArrayRef.current)
            return;

          analyserRef.current.getByteFrequencyData(dataArrayRef.current);

          requestAnimationFrame(updateLevel);
        };

        updateLevel();
      } catch (err) {
        console.error("Failed to set up audio analyzer:", err);
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [isRecording, stream]);

  // Set up MediaRecorder when recording starts
  useEffect(() => {
    if (isRecording && stream) {
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      recorder.ondataavailable = async (event) => {
        if (
          !mediaRecorderRef.current ||
          mediaRecorderRef.current.state !== "recording"
        ) {
          return;
        }

        // 2) If there’s actually data, process it
        if (event.data.size > 0) {
          const blob = new Blob([event.data], { type: "audio/webm" });
          console.log(`⏺️ Chunk ${chunkIndex} recorded`, blob.size, "bytes");

          if (meeting_id) {
            console.log("saving blob");
            await saveBlob(meeting_id, blob, chunkIndex);
          }

          console.log("processing transcripts");
          await invokeProcessing();
          setChunkIndex((prev) => prev + 1);
        }
      };

      recorder.onerror = (err) => {
        console.error("🎤 MediaRecorder error:", err);
        stopRecording();
      };

      recorder.start(30_000); // 30s chunk recording
      mediaRecorderRef.current = recorder;
    }

    return () => {
      if (!isRecording) {
        mediaRecorderRef.current?.stop();
      }
    };
  }, [
    isRecording,
    stream,
    chunkIndex,
    setChunkIndex,
    stopRecording,
    meeting_id,
  ]);

  return <></>;
}
