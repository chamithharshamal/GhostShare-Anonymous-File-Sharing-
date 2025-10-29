import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'

// GET /api/test-specific-file
export async function GET(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const fileId = '1fdb95bb-3f6a-450e-8f2b-3a8b8e457583'
    
    console.log('Testing specific file ID:', fileId)
    
    // Test with service client
    console.log('Testing with service client...')
    const serviceResult = await supabaseService
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()
    
    console.log('Service client result:', serviceResult)
    
    // Also get all files to see what's in the database
    console.log('Getting all files...')
    const allFilesResult = await supabaseService
      .from('files')
      .select('*')
      .limit(10)
    
    console.log('All files result:', allFilesResult)
    
    return NextResponse.json({ 
      fileId,
      serviceClient: {
        success: !serviceResult.error,
        data: serviceResult.data,
        error: serviceResult.error?.message
      },
      allFiles: {
        success: !allFilesResult.error,
        count: allFilesResult.data?.length,
        data: allFilesResult.data,
        error: allFilesResult.error?.message
      }
    })
  } catch (error: any) {
    console.error('Test specific file error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}