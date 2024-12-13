'use client'

import React, { useState } from 'react'
import AudioInput from '@/components/AudioInput'
import { Button } from "@/components/ui/button"
import { uploadAudio } from '@/lib/actions'
import toast from 'react-hot-toast'

export default function AudioRecorderUploader() {
  const [audioFile, setAudioFile] = useState<File | Blob | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleFileSelected = (file: File | Blob) => {
    setAudioFile(file)
  }

  const handleUpload = async () => {
    if (!audioFile) {
      setUploadStatus('No file to upload')
      return
    }

    const formData = new FormData()
    formData.append('file', audioFile, audioFile instanceof File ? audioFile.name : 'recorded_audio.wav')

    try {
      const result = await uploadAudio(formData)
      setUploadStatus(`File uploaded successfully: ${result.path}`)
    } catch (error) {
      setUploadStatus('Error uploading file')
      toast.error("Error uploading file", { duration: 5000 });

    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Audio Recorder and Uploader</h1>
      <div className="space-y-4">
        <AudioInput onFileSelected={handleFileSelected} />
        <Button onClick={handleUpload} className="w-full">
          Upload Audio
        </Button>
        {uploadStatus && (
          <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
        )}
      </div>
    </div>
  )
}

