import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'

// GET /api/list-files
export async function GET(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    console.log('Listing all files...')
    
    // Get all files
    const { data, error } = await supabaseService
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) {
      console.error('List files error:', error)
      return NextResponse.json({ error: 'Failed to list files', details: error.message }, { status: 500 })
    }
    
    console.log('Found', data?.length, 'files')
    
    return NextResponse.json({ 
      success: true,
      count: data?.length || 0,
      files: data || []
    })
  } catch (error: any) {
    console.error('List files error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}