import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'

// GET /api/test-file/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    // Get the actual params value
    const { id } = await params
    
    console.log('Testing file retrieval for ID:', id);
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid UUID format' }, { status: 400 })
    }
    
    // First, let's check if we can access the files table at all
    const { data: allFiles, error: allFilesError } = await supabaseService
      .from('files')
      .select('id')
      .limit(1)
    
    console.log('Can access files table:', !!allFiles && !allFilesError);
    if (allFilesError) {
      console.error('Cannot access files table:', allFilesError);
    }
    
    // Try to retrieve the specific file with the service client
    const { data, error } = await supabaseService
      .from('files')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Service client error:', error);
      return NextResponse.json({ 
        error: 'Service client failed', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }
    
    if (!data) {
      // Let's check if any files exist at all
      const { data: fileList, error: listError } = await supabaseService
        .from('files')
        .select('id, filename')
        .limit(10)
      
      console.log('All files in database:', fileList);
      
      return NextResponse.json({ 
        error: 'File not found',
        totalFilesInDb: fileList ? fileList.length : 0
      }, { status: 404 })
    }
    
    console.log('Service client success, data:', data);
    
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Test error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}