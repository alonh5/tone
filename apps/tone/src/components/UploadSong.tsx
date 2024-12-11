'use client'

import { useState } from 'react'

export default function UploadForm() {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type !== 'audio/mpeg') {
                alert('Please upload an MP3 file')
                return
            }
            const formData = new FormData()
            formData.append('file', file)
            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })
                if (response.ok) {
                    window.location.href = '/songs';
                } else {
                    throw new Error('Upload failed')
                }
            } catch (error) {
                console.error('Error:', error)
                alert('Upload failed')
            }
        }
    }

    return (
        <div
            className={`flex flex-col items-center justify-center w-full max-w-lg mx-auto p-10 rounded-lg shadow-lg transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-900' : 'border-gray-700 bg-gray-800'
            } border-2 border-dashed`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 16.5V6a2 2 0 012-2h14a2 2 0 012 2v10.5m-6 0H9m3 0v5m-3-5l-3 3m6-3l3 3"
                />
            </svg>
            <p className="text-gray-300 text-lg font-medium">
                Drag and drop your <span className="text-blue-400 font-semibold">MP3</span> file here
            </p>
            <p className="text-sm text-gray-500 mt-2">or click to select a file</p>
        </div>
    )
}
