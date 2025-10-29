'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestUploadPage() {
  const router = useRouter()
  const [fileId, setFileId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testFileExistence = async () => {
    if (!fileId) {
      setError('Please enter a file ID')
      return
    }
    
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testFileId: fileId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to test file')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test file')
    } finally {
      setLoading(false)
    }
  }

  const createTestFile = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to create test file')
      } else {
        setResult(data)
        setFileId(data.fileId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create test file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-400">Upload Test</h1>
          <p className="text-gray-400 mt-2">Test file upload and database storage</p>
        </header>

        <main className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Test Existing File</h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  placeholder="Enter file ID to test"
                  className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={testFileExistence}
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test File'}
                </button>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Create Test File</h2>
              <button
                onClick={createTestFile}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Test File'}
              </button>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-200">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h2 className="font-medium text-lg mb-3">Result</h2>
                <pre className="bg-gray-800 p-3 rounded overflow-x-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Common Issues</h2>
              <ul className="text-sm space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span><strong>File not found in database</strong>: The file metadata wasn't saved during upload</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span><strong>Database connection issues</strong>: Check Supabase credentials and network connectivity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span><strong>Storage policy issues</strong>: Ensure storage policies are correctly configured</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span><strong>File expiration</strong>: Files automatically expire based on the selected timeframe</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-teal-600 hover:bg-teal-500 py-2 px-4 rounded-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>GhostShare - Secure, anonymous file sharing</p>
        </footer>
      </div>
    </div>
  )
}