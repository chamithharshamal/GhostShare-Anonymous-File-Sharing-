import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'

// POST /api/verify-upload
export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const { fileId } = await request.json()
    
    if (!fileId) {
      return NextResponse.json({ error: 'Missing fileId parameter' }, { status: 400 })
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(fileId)) {
      return NextResponse.json({ error: 'Invalid UUID format' }, { status: 400 })
    }
    
    // Check if file exists in database
    const { data: file, error } = await supabaseService
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()
    
    if (error) {
      return NextResponse.json({ 
        error: 'File not found in database', 
        details: error.message 
      }, { status: 404 })
    }
    
    // Check if file has expired
    const now = new Date()
    const expiresAt = new Date(file.expires_at)
    const isExpired = now > expiresAt
    
    // Check if file has been downloaded (for one-time files)
    const isAlreadyDownloaded = file.one_time && file.sent
    
    return NextResponse.json({ 
      success: true,
      file: {
        id: file.id,
        filename: file.filename,
        size: file.size,
        mime_type: file.mime_type,
        created_at: file.created_at,
        expires_at: file.expires_at,
        isExpired,
        isAlreadyDownloaded,
        one_time: file.one_time,
        delete_after_send: file.delete_after_send,
        sent: file.sent
      }
    })
  } catch (error: any) {
    console.error('Verify upload error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}