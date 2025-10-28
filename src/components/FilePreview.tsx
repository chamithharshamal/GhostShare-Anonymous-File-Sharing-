'use client'

import { useState } from 'react'

interface FilePreviewProps {
  mimeType: string
  previewUrl: string | null
  filename: string
}

export default function FilePreview({ mimeType, previewUrl, filename }: FilePreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  if (!previewUrl) {
    return (
      <div className="bg-gray-700 p-4 rounded-lg text-center">
        <p>Preview not available for this file type</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">File Preview</h3>
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="text-teal-400 hover:text-teal-300 text-sm"
        >
          {showPreview ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {showPreview && (
        <div className="mt-2 max-h-64 overflow-hidden rounded-lg">
          {mimeType.startsWith('image/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={previewUrl} 
              alt={`Preview of ${filename}`} 
              className="max-w-full max-h-64 object-contain"
            />
          ) : mimeType === 'application/pdf' ? (
            <iframe 
              src={previewUrl} 
              className="w-full h-64"
              title={`Preview of ${filename}`}
            />
          ) : (
            <div className="bg-gray-600 p-4 rounded-lg text-center">
              <p>Preview not available for this file type</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}