'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DebugSpecificPage() {
  const router = useRouter()
  const [fileId, setFileId] = useState('1fdb95bb-3f6a-450e-8f2b-3a8b8e457583')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const debugFile = async () => {
    if (!fileId) {
      setError('Please enter a file ID')
      return
    }
    
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      const response = await fetch('/api/debug-specific-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to debug file')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to debug file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-400">Specific File Debug</h1>
          <p className="text-gray-400 mt-2">Debug file ID: 1fdb95bb-3f6a-450e-8f2b-3a8b8e457583</p>
        </header>

        <main className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Debug File</h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  placeholder="Enter file ID to debug"
                  className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={debugFile}
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Debugging...' : 'Debug File'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-200">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Debug Results for {result.fileId}</h3>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Service Client (Array)</h4>
                  <div className="text-sm">
                    <p className="mb-1">
                      <span className="text-gray-400">Success:</span>{' '}
                      <span className={result.serviceClient.success ? 'text-green-400' : 'text-red-400'}>
                        {result.serviceClient.success ? 'Yes' : 'No'}
                      </span>
                    </p>
                    {result.serviceClient.error ? (
                      <p className="text-red-400 mb-2">Error: {result.serviceClient.error}</p>
                    ) : null}
                    {result.serviceClient.data ? (
                      <div>
                        <p className="text-gray-400 mb-1">Data:</p>
                        <pre className="bg-gray-800 p-2 rounded overflow-x-auto text-xs">
                          {JSON.stringify(result.serviceClient.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-gray-400">No data returned</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Anonymous Client (Array)</h4>
                  <div className="text-sm">
                    <p className="mb-1">
                      <span className="text-gray-400">Success:</span>{' '}
                      <span className={result.anonymousClient.success ? 'text-green-400' : 'text-red-400'}>
                        {result.anonymousClient.success ? 'Yes' : 'No'}
                      </span>
                    </p>
                    {result.anonymousClient.error ? (
                      <p className="text-red-400 mb-2">Error: {result.anonymousClient.error}</p>
                    ) : null}
                    {result.anonymousClient.data ? (
                      <div>
                        <p className="text-gray-400 mb-1">Data:</p>
                        <pre className="bg-gray-800 p-2 rounded overflow-x-auto text-xs">
                          {JSON.stringify(result.anonymousClient.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-gray-400">No data returned</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Service Client (Single)</h4>
                  <div className="text-sm">
                    <p className="mb-1">
                      <span className="text-gray-400">Success:</span>{' '}
                      <span className={result.serviceClientSingle.success ? 'text-green-400' : 'text-red-400'}>
                        {result.serviceClientSingle.success ? 'Yes' : 'No'}
                      </span>
                    </p>
                    {result.serviceClientSingle.error ? (
                      <p className="text-red-400 mb-2">Error: {result.serviceClientSingle.error}</p>
                    ) : null}
                    {result.serviceClientSingle.data ? (
                      <div>
                        <p className="text-gray-400 mb-1">Data:</p>
                        <pre className="bg-gray-800 p-2 rounded overflow-x-auto text-xs">
                          {JSON.stringify(result.serviceClientSingle.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-gray-400">No data returned</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Anonymous Client (Single)</h4>
                  <div className="text-sm">
                    <p className="mb-1">
                      <span className="text-gray-400">Success:</span>{' '}
                      <span className={result.anonymousClientSingle.success ? 'text-green-400' : 'text-red-400'}>
                        {result.anonymousClientSingle.success ? 'Yes' : 'No'}
                      </span>
                    </p>
                    {result.anonymousClientSingle.error ? (
                      <p className="text-red-400 mb-2">Error: {result.anonymousClientSingle.error}</p>
                    ) : null}
                    {result.anonymousClientSingle.data ? (
                      <div>
                        <p className="text-gray-400 mb-1">Data:</p>
                        <pre className="bg-gray-800 p-2 rounded overflow-x-auto text-xs">
                          {JSON.stringify(result.anonymousClientSingle.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-gray-400">No data returned</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Troubleshooting</h2>
              <ul className="text-sm space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span><strong>If array queries work but single queries fail</strong>: The file might exist but there could be an issue with the .single() method</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span><strong>If service client works but anonymous client fails</strong>: There might be an RLS policy issue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span><strong>If all queries fail</strong>: There might be a database connection or configuration issue</span>
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