'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Mic, Square } from 'lucide-react'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  isRecording: boolean
  startRecording: () => void
  stopRecording: () => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  isRecording, 
  startRecording, 
  stopRecording 
}) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } else {
      setDuration(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleStartRecording = async () => {
    audioChunks.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        onRecordingComplete(audioBlob)
      }

      mediaRecorder.current.start()
      startRecording()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      stopRecording()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 text-white-1 focus:ring-gray-600"
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? <Square className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5" />}
      </button>
      {isRecording && (
        <span className="text-sm text-white-1" aria-live="polite">
          {formatDuration(duration)}
        </span>
      )}
    </div>
  )
}

export default AudioRecorder

