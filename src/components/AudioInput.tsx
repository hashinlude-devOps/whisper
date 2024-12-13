'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload } from 'lucide-react'
import AudioRecorder from './AudioRecorder'
import { useSidebar } from '@/context/ContextProvider'

interface AudioInputProps {
  onFileSelected: (file: File | Blob) => void
  resetKey: number;
}

const AudioInput: React.FC<AudioInputProps> = ({ onFileSelected }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { resetKey } = useSidebar();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileSelected(file)
    }
  }

  const handleRecordingComplete = (blob: Blob) => {
    setFileName('recorded_audio.wav')
    onFileSelected(blob)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    setFileName(null);
  }, [resetKey]);

  return (
    <div className="space-y-4">
      <div className="relative flex items-center border border-gray-700 rounded-md overflow-hidden bg-black-1 text-white">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={handleClick}
          className="flex-grow p-2 text-left overflow-hidden whitespace-nowrap text-white-1 text-ellipsis hover:bg-gray-700"
          aria-label="Choose audio file"
        >
          {fileName || 'Choose audio file'}
        </button>
        <div className="flex items-center px-2 border-l border-gray-700">
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            isRecording={isRecording}
            startRecording={() => setIsRecording(true)}
            stopRecording={() => setIsRecording(false)}
          />
          <button
            onClick={handleClick}
            className="p-2 rounded-full hover:bg-gray-700 focus:outline-none text-white-1 focus:ring-2 focus:ring-gray-600 ml-1"
            aria-label="Upload audio file"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
     
    </div>
  )
}

export default AudioInput
