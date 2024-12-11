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
            className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <p>Drag and drop your MP3 file here</p>
        </div>
    )
}

