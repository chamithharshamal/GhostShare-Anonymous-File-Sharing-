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
      <div className="bg-gray-700 p-3 rounded-lg text-center text-sm">
        <p>Preview not available for this file type</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-700 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">File Preview</h3>
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="text-teal-400 hover:text-teal-300 text-xs"
        >
          {showPreview ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {showPreview && (
        <div className="mt-2 max-h-48 overflow-hidden rounded">
          {mimeType.startsWith('image/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={previewUrl} 
              alt={`Preview of ${filename}`} 
              className="max-w-full max-h-48 object-contain"
            />
          ) : mimeType === 'application/pdf' ? (
            <iframe 
              src={previewUrl} 
              className="w-full h-48"
              title={`Preview of ${filename}`}
            />
          ) : (
            <div className="bg-gray-600 p-3 rounded text-center text-sm">
              <p>Preview not available for this file type</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}