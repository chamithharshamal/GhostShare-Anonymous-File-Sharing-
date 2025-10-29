import { NextResponse } from 'next/server'
import { supabase, supabaseService } from '@/lib/supabaseClient'

// GET /api/health
export async function GET(request: Request) {
  const healthCheck: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: {
      clientConfigured: !!supabase,
      serviceConfigured: !!supabaseService,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING'
    },
    mailjet: {
      apiKey: process.env.MAILJET_API_KEY ? 'SET' : 'MISSING',
      apiSecret: process.env.MAILJET_API_SECRET ? 'SET' : 'MISSING',
      fromEmail: process.env.MAILJET_FROM_EMAIL ? 'SET' : 'MISSING'
    },
    app: {
      maxFileSize: process.env.NEXT_PUBLIC_MAX_FILE_SIZE || 'NOT SET (default: 100MB)',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET (default: window.location.origin)'
    }
  }

  // Test Supabase connection if configured
  if (supabaseService) {
    try {
      const { data, error } = await supabaseService
        .from('files')
        .select('count()')
        .limit(1)
      
      healthCheck.supabase.databaseConnection = error ? 'FAILED' : 'SUCCESS'
      healthCheck.supabase.databaseError = error?.message || null
    } catch (error: any) {
      healthCheck.supabase.databaseConnection = 'FAILED'
      healthCheck.supabase.databaseError = error.message
    }
  }

  return NextResponse.json(healthCheck)
}