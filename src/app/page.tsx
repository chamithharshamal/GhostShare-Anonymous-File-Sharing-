'use client'

import { useState, useCallback } from 'react'
import FileUploader from '@/components/FileUploader'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import FilePreview from '@/components/FilePreview'
import { isPreviewable } from '@/lib/filePreview'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState('')
  const [expiresIn, setExpiresIn] = useState(24) // 24 hours default
  const [deleteAfterSend, setDeleteAfterSend] = useState(false)
  const [oneTime, setOneTime] = useState(false)
  const [password, setPassword] = useState('')
  const [uploading, setUploading] = useState(false)
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
      setError('Application not properly configured. Please contact administrator.')
      return
    }

    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
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

      // Upload file to Supabase Storage
      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      setFileId(data.fileId)
      setUploaded(true)
      
      // Generate download link
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const link = `${appUrl}/download/${data.fileId}`
      setDownloadLink(link)
      setQrCodeUrl(link)
      
      setSuccess('File uploaded successfully!')
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setUploading(false)
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-400">GhostShare</h1>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiration</label>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(Number(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={24}>24 hours</option>
                    <option value={168}>7 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="deleteAfterSend"
                    checked={deleteAfterSend}
                    onChange={(e) => setDeleteAfterSend(e.target.checked)}
                    className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="deleteAfterSend" className="ml-2 text-sm">
                    Delete after sending
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="oneTime"
                    checked={oneTime}
                    onChange={(e) => setOneTime(e.target.checked)}
                    className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="oneTime" className="ml-2 text-sm">
                    One-time download
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password (optional)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Protect your file with a password"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-teal-900/50 border border-teal-700 rounded-lg p-3 text-teal-200">
                  {success}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  uploading || !file
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-500'
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-teal-400">File Uploaded Successfully!</h2>
                <p className="text-gray-400 mt-2">Share the link below to allow downloads</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="truncate mr-2">{downloadLink}</p>
                  <button
                    onClick={() => copyToClipboard(downloadLink)}
                    className="bg-teal-600 hover:bg-teal-500 px-3 py-1 rounded text-sm whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <QRCodeDisplay value={qrCodeUrl} size={200} />
              </div>

              {email && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Send via Email</h3>
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className="flex-1 bg-gray-600 border border-gray-500 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      onClick={handleSendLink}
                      className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-r-lg"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => copyToClipboard(downloadLink)}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 py-2 px-4 rounded-lg"
                >
                  Copy Link
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg"
                >
                  Upload Another
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>GhostShare - Secure, anonymous file sharing</p>
        </footer>
      </div>
    </div>
  )
}