'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import FileUploader from '@/components/FileUploader'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import FilePreview from '@/components/FilePreview'
import ProgressCard from '@/components/ProgressCard'
import LinkCard from '@/components/LinkCard'
import { RefreshCwIcon } from '@/components/Icons'
import { isPreviewable } from '@/lib/filePreview'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState('')
  const [expiresIn, setExpiresIn] = useState(24) // 24 hours default
  const [deleteAfterSend, setDeleteAfterSend] = useState(false)
  const [oneTime, setOneTime] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploaded, setUploaded] = useState(false)
  const [fileId, setFileId] = useState('')
  const [downloadLink, setDownloadLink] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setError('')
    
    // Generate preview for previewable files
    if (isPreviewable(selectedFile.type)) {
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }, [])

  const handleUpload = async () => {
    // Check if Supabase is configured
    if (!supabase) {
      // Provide more detailed error information for debugging
      const missingEnvVars = []
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingEnvVars.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingEnvVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
      
      const errorMessage = missingEnvVars.length > 0 
        ? `Missing environment variables: ${missingEnvVars.join(', ')}`
        : 'Application not properly configured. Please contact administrator.'
      
      setError(errorMessage)
      return
    }

    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError('')
    setSuccess('')

    try {
      // Request upload URL from server
      const response = await fetch('/api/request-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          expiresIn,
          deleteAfterSend,
          oneTime,
          email: email || null,
          password: password || null
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request upload')
      }

      // Upload file to Supabase Storage with progress tracking
      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })
      
      // Handle upload completion
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.onload = function() {
          if (xhr.status === 200) {
            resolve()
          } else {
            reject(new Error('Failed to upload file'))
          }
        }
        
        xhr.onerror = function() {
          reject(new Error('Network error during upload'))
        }
      })
      
      // Start the upload
      xhr.open('PUT', data.uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
      
      // Wait for upload to complete
      await uploadPromise

      setFileId(data.fileId)
      setUploaded(true)
      
      // Generate download link
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const link = `${appUrl}/download/${data.fileId}`
      setDownloadLink(link)
      setQrCodeUrl(link)
      
      // Automatically send email if provided
      if (email) {
        try {
          const emailResponse = await fetch('/api/send-link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileId: data.fileId,
              email,
            }),
          })

          const emailData = await emailResponse.json()

          if (!emailResponse.ok) {
            throw new Error(emailData.error || 'Failed to send link')
          }

          setSuccess('File uploaded and link sent successfully!')
        } catch (emailErr) {
          console.error('Send link error:', emailErr)
          // Don't fail the whole process if email fails, just show a warning
          setSuccess('File uploaded successfully! (Failed to send email)')
        }
      } else {
        setSuccess('File uploaded successfully!')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSendLink = async () => {
    if (!email) {
      setError('Please enter an email address')
      return
    }

    try {
      const response = await fetch('/api/send-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send link')
      }

      setSuccess('Download link sent successfully!')
    } catch (err) {
      console.error('Send link error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send link')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
  }

  const resetForm = () => {
    setFile(null)
    setEmail('')
    setExpiresIn(24)
    setDeleteAfterSend(false)
    setOneTime(false)
    setPassword('')
    setUploaded(false)
    setFileId('')
    setDownloadLink('')
    setQrCodeUrl('')
    setPreviewUrl(null)
    setError('')
    setSuccess('')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-teal-400 mr-3" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2C8.5 2 6 4.5 6 8C6 11.5 8.5 13 8.5 13C8.5 13 6 14.5 6 18C6 21.5 8.5 23 12 23C15.5 23 18 21.5 18 18C18 14.5 15.5 13 15.5 13C15.5 13 18 11.5 18 8C18 4.5 15.5 2 12 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" 
                fill="currentColor"
              />
              <path 
                d="M9 12H9.01" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M15 12H15.01" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold text-teal-400">GhostShare</h1>
          </div>
          <p className="text-gray-400 mt-2">Secure, anonymous file sharing</p>
        </header>

        <main className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
          {!uploaded ? (
            <div className="space-y-6">
              <FileUploader 
                onFileSelect={handleFileSelect} 
                maxSize={parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '104857600')}
              />

              {previewUrl && file && (
                <FilePreview 
                  mimeType={file.type}
                  previewUrl={previewUrl}
                  filename={file.name}
                />
              )}

              {file && (
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center min-w-0"> {/* Added min-w-0 to allow truncation */}
                      <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <div className="min-w-0"> {/* Added min-w-0 to allow truncation */}
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-gray-400 hover:text-red-400 p-1 flex-shrink-0" // Added flex-shrink-0
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Password (optional)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Protect your file"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 pr-10 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Expiration</label>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(Number(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={24}>24 hours</option>
                    <option value={168}>7 days</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center justify-center w-full gap-3">
                    <button
                      onClick={() => setDeleteAfterSend(!deleteAfterSend)}
                      className={`relative inline-flex h-6 w-12 mb-1 items-center rounded-full transition-colors focus:outline-none ${
                        deleteAfterSend ? 'bg-teal-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          deleteAfterSend ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-medium mb-1">Delete after one download</span>
                    
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-teal-900/50 border border-teal-700 rounded-lg p-3 text-teal-200 text-sm">
                  {success}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center ${
                  uploading || !file
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-500'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                {uploading ? `Uploading... ${uploadProgress}%` : 'Generate Link'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LinkCard link={downloadLink} onReset={resetForm} />
                
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-lg h-full flex flex-col justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-4">QR Code</h3>
                    <div className="flex justify-center">
                      <QRCodeDisplay value={qrCodeUrl} size={150} />
                    </div>
                    <p className="text-gray-400 mt-3 text-sm">Scan this QR code to access your file</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={resetForm}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCwIcon className="w-5 h-5" />
                Share Another File
              </button>
            </div>
          )}
        </main>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>© 2025 GhostShare. All files are encrypted and automatically deleted.</p>
        </footer>
      </div>
    </div>
  )
}