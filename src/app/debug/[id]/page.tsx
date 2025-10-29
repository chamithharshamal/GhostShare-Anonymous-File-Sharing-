'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DebugPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        // Get the actual params value
        const { id } = await params
        
        console.log('Fetching debug info for file ID:', id)
        
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
          setError('Invalid UUID format')
          setLoading(false)
          return
        }
        
        const response = await fetch(`/api/debug-file/${id}`)
        const data = await response.json()
        
        if (!response.ok) {
          setError(data.error || 'Failed to fetch debug info')
        } else {
          setDebugInfo(data)
        }
      } catch (err) {
        console.error('Debug error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch debug info')
      } finally {
        setLoading(false)
      }
    }

    fetchDebugInfo()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4">Loading debug information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Debug Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-teal-600 hover:bg-teal-500 py-2 px-4 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-400">File Debug Information</h1>
          <p className="text-gray-400 mt-2">Debugging file ID: {debugInfo?.fileId}</p>
        </header>

        <main className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Service Client Result</h2>
              <div className="text-sm">
                <p className="mb-2">
                  <span className="text-gray-400">Success:</span>{' '}
                  <span className={debugInfo?.serviceClient?.success ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo?.serviceClient?.success ? 'Yes' : 'No'}
                  </span>
                </p>
                {debugInfo?.serviceClient?.error ? (
                  <p className="text-red-400 mb-2">Error: {debugInfo.serviceClient.error}</p>
                ) : null}
                {debugInfo?.serviceClient?.data ? (
                  <div>
                    <p className="text-gray-400 mb-1">Data:</p>
                    <pre className="bg-gray-800 p-3 rounded overflow-x-auto text-xs">
                      {JSON.stringify(debugInfo.serviceClient.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-400">No data returned</p>
                )}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Anonymous Client Result</h2>
              <div className="text-sm">
                <p className="mb-2">
                  <span className="text-gray-400">Success:</span>{' '}
                  <span className={debugInfo?.anonymousClient?.success ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo?.anonymousClient?.success ? 'Yes' : 'No'}
                  </span>
                </p>
                {debugInfo?.anonymousClient?.error ? (
                  <p className="text-red-400 mb-2">Error: {debugInfo.anonymousClient.error}</p>
                ) : null}
                {debugInfo?.anonymousClient?.data ? (
                  <div>
                    <p className="text-gray-400 mb-1">Data:</p>
                    <pre className="bg-gray-800 p-3 rounded overflow-x-auto text-xs">
                      {JSON.stringify(debugInfo.anonymousClient.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-400">No data returned</p>
                )}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">All Files in Database</h2>
              <div className="text-sm">
                <p className="mb-2">
                  <span className="text-gray-400">Success:</span>{' '}
                  <span className={debugInfo?.allFiles?.success ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo?.allFiles?.success ? 'Yes' : 'No'}
                  </span>
                </p>
                <p className="mb-2">
                  <span className="text-gray-400">Count:</span> {debugInfo?.allFiles?.count || 0}
                </p>
                {debugInfo?.allFiles?.error ? (
                  <p className="text-red-400 mb-2">Error: {debugInfo.allFiles.error}</p>
                ) : null}
                {debugInfo?.allFiles?.data ? (
                  <div>
                    <p className="text-gray-400 mb-1">Data:</p>
                    <pre className="bg-gray-800 p-3 rounded overflow-x-auto text-xs">
                      {JSON.stringify(debugInfo.allFiles.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-400">No data returned</p>
                )}
              </div>
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