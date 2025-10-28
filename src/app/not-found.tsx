import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="text-yellow-400 text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-300 mb-6">The page you are looking for doesn&#39;t exist.</p>
        <Link 
          href="/"
          className="bg-teal-600 hover:bg-teal-500 py-2 px-4 rounded-lg inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}