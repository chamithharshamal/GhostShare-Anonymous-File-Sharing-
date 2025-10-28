'use client'

import { useState, useEffect } from 'react'
import { supabase, supabaseService } from '@/lib/supabaseClient'

export default function TestDBPage() {
  const [files, setFiles] = useState<any[]>([])
  const [specificFile, setSpecificFile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [testId, setTestId] = useState('9aea08f5-9b6b-46e8-8e6d-b73587751512')

  useEffect(() => {
    const fetchFiles = async () => {
      // Check if Supabase is configured
      if (!supabase) {
        setError('Supabase not configured')
        setLoading(false)
        return
      }

      try {
        console.log('Attempting to fetch files with regular client');
        
        // Try with regular client first
        let { data, error } = await supabase
          .from('files')
          .select('*')
          .limit(5)

        if (error) {
          console.log('Regular client failed, error:', error);
          // Try with service client if regular client fails
          if (supabaseService) {
            console.log('Trying with service client');
            const serviceResult = await supabaseService
              .from('files')
              .select('*')
              .limit(5)
            
            data = serviceResult.data
            error = serviceResult.error
            
            if (serviceResult.data) {
              console.log('Service client succeeded');
            } else if (serviceResult.error) {
              console.log('Service client also failed, error:', serviceResult.error);
            }
          }
        }

        if (error) {
          setError(error.message)
        } else {
          setFiles(data || [])
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch files')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const testSpecificFile = async () => {
    if (!supabase) {
      setError('Supabase not configured')
      return
    }

    try {
      console.log('Testing specific file ID:', testId);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(testId)) {
        setError('Invalid UUID format')
        return
      }
      
      // Try with regular client first
      let { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', testId)
        .single()

      if (error) {
        console.log('Regular client failed for specific file, error:', error);
        // Try with service client if regular client fails
        if (supabaseService) {
          console.log('Trying with service client for specific file');
          const serviceResult = await supabaseService
            .from('files')
            .select('*')
            .eq('id', testId)
            .single()
          
          data = serviceResult.data
          error = serviceResult.error
          
          if (serviceResult.data) {
            console.log('Service client succeeded for specific file');
          } else if (serviceResult.error) {
            console.log('Service client also failed for specific file, error:', serviceResult.error);
          }
        }
      }

      if (error) {
        setError(error.message)
        setSpecificFile(null)
      } else {
        setSpecificFile(data)
        setError('')
      }
    } catch (err) {
      console.error('Specific file test error:', err)
      setError(err instanceof Error ? err.message : 'Failed to test specific file')
      setSpecificFile(null)
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Test Specific File</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            placeholder="Enter file ID"
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={testSpecificFile}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test
          </button>
        </div>
        {specificFile && (
          <div className="border p-3 rounded bg-green-50">
            <h3 className="font-semibold">File Found:</h3>
            <p><strong>Filename:</strong> {specificFile.filename}</p>
            <p><strong>ID:</strong> {specificFile.id}</p>
            <p><strong>Size:</strong> {specificFile.size} bytes</p>
          </div>
        )}
        {error && (
          <div className="border p-3 rounded bg-red-50 text-red-700">
            Error: {error}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Files</h2>
        <p className="mb-4">Found {files.length} files</p>
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.id} className="border p-2 rounded">
              <strong>{file.filename}</strong> - {file.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}