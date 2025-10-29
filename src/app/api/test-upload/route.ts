import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

// POST /api/test-upload
export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const { testFileId } = await request.json()
    
    // If a specific file ID is provided, check if it exists
    if (testFileId) {
      const { data, error } = await supabaseService
        .from('files')
        .select('*')
        .eq('id', testFileId)
        .single()
      
      if (error) {
        return NextResponse.json({ 
          error: 'File not found in database', 
          details: error.message,
          fileId: testFileId
        }, { status: 404 })
      }
      
      return NextResponse.json({ 
        success: true,
        file: data,
        message: 'File found in database'
      })
    }
    
    // Otherwise, create a test file entry
    const fileId = uuidv4()
    const createdAt = new Date()
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
    
    const testData = {
      id: fileId,
      filename: 'test-file.txt',
      mime_type: 'text/plain',
      size: 1024,
      storage_path: `uploads/${fileId}/test-file.txt`,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      delete_after_send: false,
      one_time: false,
      sent: false,
      email: null,
      password_hash: null
    }
    
    // Save test file metadata to database
    const { data, error } = await supabaseService
      .from('files')
      .insert(testData)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save test file metadata', details: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      fileId: data.id,
      message: 'Test file created successfully'
    })
  } catch (error: any) {
    console.error('Test upload error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}