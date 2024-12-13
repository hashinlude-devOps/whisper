"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

const CustomAudioPlayer = ({
  audioUrl,
  onTimeUpdate,
  audioRef,
  isReady,
  onPlayAttempt,
  onDurationUpdate,
}: {
  audioUrl: string | null;
  onTimeUpdate: (currentTime: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isReady: boolean;
  onPlayAttempt?: () => void;
  onDurationUpdate?: (duration: number) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlayPause = () => {
    if (!isReady) {
      onPlayAttempt?.();
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 5,
        duration
      );
    }
  };

  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 5,
        0
      );
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        onTimeUpdate(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, [onTimeUpdate]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (onDurationUpdate) {
        onDurationUpdate(audioRef.current.duration);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="sticky bottom-0 left-0 flex size-full flex-col bg-black-3">
      <Progress
        value={isReady ? progressValue : 0}
        className={`w-full ${!isReady ? "bg-gray-300" : ""}`}
      />
      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 md:px-12">
        <audio
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        <div className="flex items-center gap-2">
          <h2 className="text-16 font-normal text-white-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Image
              src={"/icons/reverse.svg"}
              width={24}
              height={24}
              alt="Rewind"
              onClick={isReady ? rewind : undefined}
              className={
                !isReady ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }
            />
            <h2 className="text-12 font-bold text-white-1">-5</h2>
          </div>
          <Image
            src={isPlaying && isReady ? "/icons/Pause.svg" : "/icons/Play.svg"}
            width={30}
            height={30}
            alt="Play/Pause"
            onClick={togglePlayPause}
            className={
              !isReady ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }
          />
          <div className="flex items-center gap-1.5">
            <h2 className="text-12 font-bold text-white-1">+5</h2>
            <Image
              src={"/icons/forward.svg"}
              width={24}
              height={24}
              alt="Forward"
              onClick={isReady ? forward : undefined}
              className={
                !isReady ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }
            />
          </div>
        </div>

        <div className="flex items-center">
          <Image
            src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
            width={24}
            height={24}
            alt="Mute/Unmute"
            onClick={toggleMute}
            className="cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};

export default CustomAudioPlayer;
