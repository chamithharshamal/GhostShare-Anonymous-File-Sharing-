import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

// POST /api/test-insert
export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    // Generate a unique file ID
    const fileId = uuidv4()
    
    // Current time
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
    
    // Test file data
    const testData = {
      id: fileId,
      filename: 'test-file.txt',
      mime_type: 'text/plain',
      size: 1024,
      storage_path: `uploads/${fileId}/test-file.txt`,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      delete_after_send: false,
      one_time: false,
      sent: false,
      email: null,
      password_hash: null
    }
    
    console.log('Inserting test file:', testData);
    
    // Insert test file
    const { data, error } = await supabaseService
      .from('files')
      .insert(testData)
      .select()
      .single()
    
    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ 
        error: 'Failed to insert test file', 
        details: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    console.log('Insert success, data:', data);
    
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Test insert error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}