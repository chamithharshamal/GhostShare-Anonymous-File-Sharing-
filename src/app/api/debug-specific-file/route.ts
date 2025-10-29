import { NextResponse } from 'next/server'
import { supabaseService, supabase } from '@/lib/supabaseClient'

// POST /api/debug-specific-file
export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService || !supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const { fileId } = await request.json()
    
    if (!fileId) {
      return NextResponse.json({ error: 'Missing fileId parameter' }, { status: 400 })
    }
    
    console.log('Debugging specific file ID:', fileId)
    
    // Test 1: Check with service client
    console.log('Testing with service client...')
    const serviceResult = await supabaseService
      .from('files')
      .select('*')
      .eq('id', fileId)
    
    console.log('Service client result:', serviceResult)
    
    // Test 2: Check with anonymous client
    console.log('Testing with anonymous client...')
    const anonResult = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
    
    console.log('Anonymous client result:', anonResult)
    
    // Test 3: Check with service client using single
    console.log('Testing with service client using single...')
    const serviceSingleResult = await supabaseService
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()
    
    console.log('Service client single result:', serviceSingleResult)
    
    // Test 4: Check with anonymous client using single
    console.log('Testing with anonymous client using single...')
    const anonSingleResult = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()
    
    console.log('Anonymous client single result:', anonSingleResult)
    
    return NextResponse.json({ 
      fileId,
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
      serviceClientSingle: {
        success: !serviceSingleResult.error,
        data: serviceSingleResult.data,
        error: serviceSingleResult.error?.message
      },
      anonymousClientSingle: {
        success: !anonSingleResult.error,
        data: anonSingleResult.data,
        error: anonSingleResult.error?.message
      }
    })
  } catch (error: any) {
    console.error('Debug specific file error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}