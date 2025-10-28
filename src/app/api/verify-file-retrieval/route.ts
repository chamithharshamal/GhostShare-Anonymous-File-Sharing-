import { NextResponse } from 'next/server'
import { supabaseService, supabase } from '@/lib/supabaseClient'

// GET /api/verify-file-retrieval?testId=...
export async function GET(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService || !supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')
    
    if (!testId) {
      return NextResponse.json({ error: 'Missing testId parameter' }, { status: 400 })
    }
    
    console.log('Verifying file retrieval for ID:', testId)
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(testId)) {
      return NextResponse.json({ error: 'Invalid UUID format' }, { status: 400 })
    }
    
    // Test with service client
    console.log('Testing with service client...')
    const serviceResult = await supabaseService
      .from('files')
      .select('*')
      .eq('id', testId)
      .single()
    
    console.log('Service client result:', serviceResult)
    
    // Test with anonymous client
    console.log('Testing with anonymous client...')
    const anonResult = await supabase
      .from('files')
      .select('*')
      .eq('id', testId)
      .single()
    
    console.log('Anonymous client result:', anonResult)
    
    return NextResponse.json({ 
      testId,
      serviceClient: {
        success: !!serviceResult.data && !serviceResult.error,
        data: serviceResult.data,
        error: serviceResult.error?.message
      },
      anonymousClient: {
        success: !!anonResult.data && !anonResult.error,
        data: anonResult.data,
        error: anonResult.error?.message
      }
    })
  } catch (error: any) {
    console.error('File retrieval verification error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}