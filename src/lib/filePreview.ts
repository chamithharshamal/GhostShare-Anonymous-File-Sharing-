import { supabase } from '@/lib/supabaseClient'

// Check if a file type is previewable
export function isPreviewable(mimeType: string): boolean {
  const previewableTypes = [
    'image/',
    'application/pdf',
    'text/',
    'application/json'
  ]
  
  return previewableTypes.some(type => mimeType.startsWith(type))
}

// Generate a preview URL for a file
export async function generatePreviewUrl(storagePath: string, expiresIn: number = 3600): Promise<string | null> {
  // Check if Supabase is configured
  if (!supabase) {
    return null
  }

  try {
    const { data, error } = await supabase.storage
      .from('ghostshare')
      .createSignedUrl(storagePath, expiresIn)
    
    if (error) {
      console.error('Preview URL error:', error)
      return null
    }
    
    return data.signedUrl
  } catch (error) {
    console.error('Preview generation error:', error)
    return null
  }
}

// Generate a thumbnail for an image
export async function generateThumbnail(storagePath: string, width: number = 200, height: number = 200): Promise<string | null> {
  // Check if Supabase is configured
  if (!supabase) {
    return null
  }

  try {
    const { data, error } = await supabase.storage
      .from('ghostshare')
      .createSignedUrl(storagePath, 3600, {
        transform: {
          width,
          height,
          resize: 'cover'
        }
      })
    
    if (error) {
      console.error('Thumbnail error:', error)
      return null
    }
    
    return data.signedUrl
  } catch (error) {
    console.error('Thumbnail generation error:', error)
    return null
  }
}