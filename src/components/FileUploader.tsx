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
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-teal-400 bg-teal-400/10' : 'border-gray-600 hover:border-teal-500'
        }`}
      >
        <input {...getInputProps()} />
        <div>
          <svg className="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="text-xs mb-1">Drag & drop or click to select</p>
          <p className="text-gray-400 text-xs">
            {accept 
              ? `Supports ${accept} files up to ${maxSize ? (maxSize / 1024 / 1024) : 100}MB` 
              : `Supports all files up to ${maxSize ? (maxSize / 1024 / 1024) : 100}MB`
            }
          </p>
        </div>
      </div>
      
      {error && (
        <div className="text-red-400 text-xs mt-1">{error}</div>
      )}
    </div>
  )
}