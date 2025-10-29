import { NextResponse } from 'next/server'
import { supabaseService, supabase } from '@/lib/supabaseClient'

// GET /api/test-policies
export async function GET(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService || !supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    console.log('Testing database policies...')
    
    // Test 1: Check if we can access the files table with service client
    console.log('Testing service client access...')
    const serviceTest = await supabaseService
      .from('files')
      .select('*')
      .limit(1)
    
    console.log('Service client test result:', serviceTest)
    
    // Test 2: Check if we can access the files table with anonymous client
    console.log('Testing anonymous client access...')
    const anonTest = await supabase
      .from('files')
      .select('*')
      .limit(1)
    
    console.log('Anonymous client test result:', anonTest)
    
    // Test 3: Try to insert a test record with anonymous client
    console.log('Testing anonymous insert...')
    const testRecord = {
      id: '00000000-0000-0000-0000-000000000000',
      filename: 'policy-test.txt',
      mime_type: 'text/plain',
      size: 1,
      storage_path: 'test/policy-test.txt',
      expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      delete_after_send: false,
      one_time: false,
      sent: false
    }
    
    const insertTest = await supabase
      .from('files')
      .insert([testRecord])
    
    console.log('Insert test result:', insertTest)
    
    // Clean up test record if it was inserted
    if (!insertTest.error) {
      console.log('Cleaning up test record...')
      await supabaseService
        .from('files')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000')
    }
    
    return NextResponse.json({ 
      success: true,
      serviceClient: {
        success: !serviceTest.error,
        error: serviceTest.error?.message
      },
      anonymousClient: {
        success: !anonTest.error,
        error: anonTest.error?.message
      },
      insert: {
        success: !insertTest.error,
        error: insertTest.error?.message
      }
    })
  } catch (error: any) {
    console.error('Policy verification error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}