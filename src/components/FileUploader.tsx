'use client'

import { useState, useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  maxSize?: number
  accept?: string
}

export default function FileUploader({ onFileSelect, maxSize, accept }: FileUploaderProps) {
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      setError(`File is too large. Maximum size is ${maxSize ? (maxSize / 1024 / 1024) : 100}MB`)
      return
    }
    
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
      setError('')
    }
  }, [onFileSelect, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: maxSize || 104857600, // 100MB default
    accept: accept ? { [accept]: [] } : undefined
  })

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-teal-400 bg-teal-400/10' : 'border-gray-600 hover:border-teal-500'
        }`}
      >
        <input {...getInputProps()} />
        <div>
          <p className="text-lg mb-2">Drag & drop a file here, or click to select</p>
          <p className="text-gray-400 text-sm">
            {accept 
              ? `Supports ${accept} files up to ${maxSize ? (maxSize / 1024 / 1024) : 100}MB` 
              : `Supports all file types up to ${maxSize ? (maxSize / 1024 / 1024) : 100}MB`
            }
          </p>
        </div>
      </div>
      
      {error && (
        <div className="text-red-400 text-sm mt-2">{error}</div>
      )}
    </div>
  )
}