import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'

// POST /api/cleanup
export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_AUTH_TOKEN}`
    
    // Verify the cron auth token
    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get current time
    const now = new Date()
    
    // Find expired files using service role client
    const { data: expiredFiles, error: selectError } = await supabaseService
      .from('files')
      .select('id, storage_path')
      .lt('expires_at', now.toISOString())
    
    if (selectError) {
      console.error('Select error:', selectError)
      return NextResponse.json({ error: 'Failed to find expired files' }, { status: 500 })
    }
    
    if (expiredFiles.length === 0) {
      return NextResponse.json({ message: 'No expired files found' })
    }
    
    // Delete files from storage using service role client
    const storagePaths = expiredFiles.map(file => file.storage_path)
    const { error: storageError } = await supabaseService.storage
      .from('ghostshare')
      .remove(storagePaths)
    
    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }
    
    // Delete records from database using service role client
    const expiredFileIds = expiredFiles.map(file => file.id)
    const { error: dbError } = await supabaseService
      .from('files')
      .delete()
      .in('id', expiredFileIds)
    
    if (dbError) {
      console.error('Database deletion error:', dbError)
      return NextResponse.json({ error: 'Failed to delete expired files from database' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: `Cleaned up ${expiredFiles.length} expired files`,
      deletedFiles: expiredFileIds
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}