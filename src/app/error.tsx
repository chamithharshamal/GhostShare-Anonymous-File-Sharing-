'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
        <p className="text-gray-300 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-teal-600 hover:bg-teal-500 py-2 px-4 rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  )
}