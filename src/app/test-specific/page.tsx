'use client'

import { useState, useEffect } from 'react'
import { supabase, supabaseService } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function TestSpecificPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const testFileRetrieval = async () => {
      try {
        // Check if Supabase clients are configured
        if (!supabase || !supabaseService) {
          setError('Supabase not configured')
          setLoading(false)
          return
        }
        
        const fileId = '1fdb95bb-3f6a-450e-8f2b-3a8b8e457583'
        
        console.log('Testing file retrieval for ID:', fileId)
        
        // Test with regular client
        console.log('Testing with regular client...')
        const regularResult = await supabase
          .from('files')
          .select('*')
          .eq('id', fileId)
          .single()
        
        console.log('Regular client result:', regularResult)
        
        // Test with service client
        console.log('Testing with service client...')
        const serviceResult = await supabaseService
          .from('files')
          .select('*')
          .eq('id', fileId)
          .single()
        
        console.log('Service client result:', serviceResult)
        
        setResult({
          fileId,
          regularClient: {
            success: !regularResult.error,
            data: regularResult.data,
            error: regularResult.error?.message
          },
          serviceClient: {
            success: !serviceResult.error,
            data: serviceResult.data,
            error: serviceResult.error?.message
          }
        })
      } catch (err) {
        console.error('Test error:', err)
        setError(err instanceof Error ? err.message : 'Failed to test file retrieval')
      } finally {
        setLoading(false)
      }
    }

    testFileRetrieval()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4">Testing file retrieval...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Test Error</h1>
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
          <h1 className="text-3xl md:text-4xl font-bold text-teal-400">Specific File Test</h1>
          <p className="text-gray-400 mt-2">Testing file ID: 1fdb95bb-3f6a-450e-8f2b-3a8b8e457583</p>
        </header>

        <main className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Regular Client Result</h2>
              <div className="text-sm">
                <p className="mb-2">
                  <span className="text-gray-400">Success:</span>{' '}
                  <span className={result?.regularClient?.success ? 'text-green-400' : 'text-red-400'}>
                    {result?.regularClient?.success ? 'Yes' : 'No'}
                  </span>
                </p>
                {result?.regularClient?.error ? (
                  <p className="text-red-400 mb-2">Error: {result.regularClient.error}</p>
                ) : null}
                {result?.regularClient?.data ? (
                  <div>
                    <p className="text-gray-400 mb-1">Data:</p>
                    <pre className="bg-gray-800 p-3 rounded overflow-x-auto text-xs">
                      {JSON.stringify(result.regularClient.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-400">No data returned</p>
                )}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="font-medium text-lg mb-3">Service Client Result</h2>
              <div className="text-sm">
                <p className="mb-2">
                  <span className="text-gray-400">Success:</span>{' '}
                  <span className={result?.serviceClient?.success ? 'text-green-400' : 'text-red-400'}>
                    {result?.serviceClient?.success ? 'Yes' : 'No'}
                  </span>
                </p>
                {result?.serviceClient?.error ? (
                  <p className="text-red-400 mb-2">Error: {result.serviceClient.error}</p>
                ) : null}
                {result?.serviceClient?.data ? (
                  <div>
                    <p className="text-gray-400 mb-1">Data:</p>
                    <pre className="bg-gray-800 p-3 rounded overflow-x-auto text-xs">
                      {JSON.stringify(result.serviceClient.data, null, 2)}
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