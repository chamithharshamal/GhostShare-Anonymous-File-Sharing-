import { NextResponse } from 'next/server'
import { supabaseService, supabase } from '@/lib/supabaseClient'

// GET /api/debug-file/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Check if Supabase is configured
  if (!supabaseService || !supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    // Get the actual params value
    const { id } = await params
    
    console.log('Debug request for file ID:', id)
    
    if (!id) {
      return NextResponse.json({ error: 'Missing file ID' }, { status: 400 })
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid UUID format' }, { status: 400 })
    }
    
    // Test with service client
    console.log('Testing with service client...')
    const serviceResult = await supabaseService
      .from('files')
      .select('*')
      .eq('id', id)
    
    console.log('Service client result:', serviceResult)
    
    // Test with anonymous client
    console.log('Testing with anonymous client...')
    const anonResult = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
    
    console.log('Anonymous client result:', anonResult)
    
    // Get all files to see what's in the database
    console.log('Getting all files...')
    const allFilesResult = await supabaseService
      .from('files')
      .select('*')
      .limit(10)
    
    console.log('All files result:', allFilesResult)
    
    return NextResponse.json({ 
      fileId: id,
      serviceClient: {
        success: !serviceResult.error,
        data: serviceResult.data,
        error: serviceResult.error?.message
      },
      anonymousClient: {
        success: !anonResult.error,
        data: anonResult.data,
        error: anonResult.error?.message
      },
      allFiles: {
        success: !allFilesResult.error,
        count: allFilesResult.data?.length,
        data: allFilesResult.data,
        error: allFilesResult.error?.message
      }
    })
  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}