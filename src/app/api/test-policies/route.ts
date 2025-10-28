import { NextResponse } from 'next/server'
import { supabaseService, supabase } from '@/lib/supabaseClient'

// GET /api/test-policies
export async function GET(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService || !supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    console.log('Testing database access with different clients');
    
    // Test with service client
    const serviceResult = await supabaseService
      .from('files')
      .select('id')
      .limit(1)
    
    console.log('Service client result:', serviceResult);
    
    // Test with anonymous client
    const anonResult = await supabase
      .from('files')
      .select('id')
      .limit(1)
    
    console.log('Anonymous client result:', anonResult);
    
    return NextResponse.json({ 
      serviceClient: {
        success: !!serviceResult.data && !serviceResult.error,
        error: serviceResult.error ? serviceResult.error.message : null
      },
      anonymousClient: {
        success: !!anonResult.data && !anonResult.error,
        error: anonResult.error ? anonResult.error.message : null
      }
    })
  } catch (error: any) {
    console.error('Test policies error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}