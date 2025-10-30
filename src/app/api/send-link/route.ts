import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseClient'
import Mailjet from 'node-mailjet'

// POST /api/send-link
export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseService) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { fileId, email } = body
    
    // Get file information using service role client
    const { data: file, error: fileError } = await supabaseService
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()
    
    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
    // Check if file has expired
    const now = new Date()
    const expiresAt = new Date(file.expires_at)
    if (now > expiresAt) {
      return NextResponse.json({ error: 'File has expired' }, { status: 400 })
    }
    
    // Check if file has already been sent (for one-time downloads)
    if (file.one_time && file.sent) {
      return NextResponse.json({ error: 'File has already been downloaded' }, { status: 400 })
    }
    
    // Generate signed download URL (valid for 24 hours or until first download for one-time files)
    const urlExpiryHours = file.one_time ? 1 : 24
    const { data: urlData, error: urlError } = await supabaseService.storage
      .from('ghostshare')
      .createSignedUrl(file.storage_path, urlExpiryHours * 3600) // 3600 seconds per hour
    
    if (urlError) {
      console.error('URL generation error:', urlError)
      return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
    }
    
    // Send email with download link
    const mailjetApiKey = process.env.MAILJET_API_KEY
    const mailjetApiSecret = process.env.MAILJET_API_SECRET
    const fromEmail = process.env.MAILJET_FROM_EMAIL
    
    if (!mailjetApiKey || !mailjetApiSecret || !fromEmail) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }
    
    // Calculate expiration time for display
    const expirationTime = file.one_time ? 'after first download' : `in ${urlExpiryHours} hours`
    
    // Generate frontend download link instead of direct signed URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const frontendDownloadLink = `${appUrl}/download/${fileId}`

    const mailjet = new Mailjet.Client({
      apiKey: mailjetApiKey,
      apiSecret: mailjetApiSecret
    })
    
    const mailjetRequest = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: 'ShadeDrop'
          },
          To: [
            {
              Email: email,
              Name: ''
            }
          ],
          Subject: '🔗 Your ShadeDrop Download Link',
          TextPart: `Your file "${file.filename}" is ready for download!

Download Link: ${frontendDownloadLink}

This link expires ${expirationTime}.

ShadeDrop – Simple, private, secure file sharing.
${appUrl}`,
          HTMLPart: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShadeDrop Download</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #0f172a; color: #f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 20px; background: linear-gradient(135deg, #0d9488, #0f766e);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">ShadeDrop</h1>
              <p style="margin: 8px 0 0; font-size: 16px; color: #e2e8f0;">Secure, anonymous file sharing</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin-top: 0; color: #e2e8f0; font-size: 24px;">Your File is Ready!</h2>
              
              <div style="background-color: #334155; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="background-color: #0d9488; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    <span style="color: white; font-size: 20px;">📁</span>
                  </div>
                  <div>
                    <h3 style="margin: 0; color: white; font-size: 18px;">${file.filename}</h3>
                    <p style="margin: 4px 0 0; color: #cbd5e1; font-size: 14px;">
                      ${Math.round(file.size / 1024)} KB • Expires ${expirationTime}
                    </p>
                  </div>
                </div>
              </div>
              
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                Your file has been securely uploaded and is ready for download. Click the button below to access your file.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${frontendDownloadLink}" 
                       style="display: inline-block; background: linear-gradient(135deg, #0d9488, #0f766e); color: white; text-decoration: none; padding: 14px 28px; font-size: 18px; font-weight: 600; border-radius: 8px; transition: all 0.3s ease;">
                      Download File
                    </a>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin: 25px 0;">
                <p style="color: #94a3b8; font-size: 14px; margin: 0;">Or copy and paste this link:</p>
                <p style="margin: 8px 0 0; color: #0d9488; word-break: break-all; font-size: 14px;">
                  <a href="${frontendDownloadLink}" style="color: #0d9488; text-decoration: none;">${frontendDownloadLink}</a>
                </p>
              </div>
              
              <div style="background-color: #334155; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <h3 style="margin-top: 0; color: #e2e8f0; font-size: 18px;">🔒 Security Information</h3>
                <ul style="padding-left: 20px; color: #cbd5e1; margin: 15px 0;">
                  <li style="margin-bottom: 10px;">File link expires ${expirationTime}</li>
                  ${file.one_time ? '<li style="margin-bottom: 10px;">File can only be downloaded once</li>' : ''}
                  ${file.delete_after_send ? '<li style="margin-bottom: 10px;">File will be deleted after download</li>' : ''}
                  ${file.password_hash ? '<li style="margin-bottom: 10px;">File is password protected</li>' : ''}
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px; background-color: #1e293b; border-top: 1px solid #334155;">
              <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                Sent by <a href="${appUrl}" style="color: #0d9488; text-decoration: none;">ShadeDrop</a>
              </p>
              <p style="margin: 8px 0 0; color: #64748b; font-size: 12px;">
                Secure, anonymous file sharing
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
        }
      ]
    })
    
    try {
      await mailjetRequest
    } catch (emailError) {
      console.error('Email error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}