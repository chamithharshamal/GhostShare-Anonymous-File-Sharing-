import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'

// GET /api/download/[id]?password=...
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Check if Supabase is configured
  if (!supabaseService) {
    console.error('Supabase not configured')
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    // Get the actual params value
    const { id } = await params
    
    console.log('Download request for file ID:', id)
    
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')
    
    if (!id) {
      console.error('Missing file ID')
      return NextResponse.json({ error: 'Missing file ID' }, { status: 400 })
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      console.error('Invalid UUID format:', id)
      return NextResponse.json({ error: 'Invalid file ID format' }, { status: 400 })
    }
    
    // Get file information using service role client
    const { data: file, error: fileError } = await supabaseService
      .from('files')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fileError || !file) {
      console.error('File not found in database:', fileError?.message || 'No file returned')
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
    console.log('File found:', file.filename)
    
    // Check if file has expired
    const now = new Date()
    const expiresAt = new Date(file.expires_at)
    if (now > expiresAt) {
      console.error('File has expired')
      return NextResponse.json({ error: 'File has expired' }, { status: 400 })
    }
    
    // Check if file has already been sent (for one-time downloads)
    if (file.one_time && file.sent) {
      console.error('File has already been downloaded (one-time)')
      return NextResponse.json({ error: 'File has already been downloaded' }, { status: 400 })
    }
    
    // Verify password if required
    if (file.password_hash) {
      if (!password) {
        console.error('Password required but not provided')
        return NextResponse.json({ error: 'Password required' }, { status: 401 })
      }
      
      // Hash the provided password
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      // Compare with stored hash
      if (passwordHash !== file.password_hash) {
        console.error('Invalid password provided')
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    }
    
    // Generate signed download URL using service role client
    console.log('Generating signed URL for:', file.storage_path)
    const { data: urlData, error: urlError } = await supabaseService.storage
      .from('ghostshare')
      .createSignedUrl(file.storage_path, 3600, { // 1 hour expiry
        download: file.filename
      })
    
    if (urlError) {
      console.error('URL generation error:', urlError)
      return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
    }
    
    console.log('Signed URL generated successfully')
    
    // Update sent status for one-time files using service role client
    if (file.one_time) {
      const { error: updateError } = await supabaseService
        .from('files')
        .update({ sent: true })
        .eq('id', id)
      
      if (updateError) {
        console.error('Update error:', updateError)
      } else {
        console.log('File sent status updated')
      }
    }
    
    // Redirect to the signed URL
    console.log('Redirecting to signed URL')
    return NextResponse.redirect(urlData.signedUrl)
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}