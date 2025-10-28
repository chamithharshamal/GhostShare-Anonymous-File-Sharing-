import { createClient } from '@supabase/supabase-js'

// Type definitions for our file record
export interface GhostFile {
  id: string
  filename: string
  mime_type: string
  size: number
  storage_path: string
  created_at: string
  expires_at: string
  delete_after_send: boolean
  one_time: boolean
  sent: boolean
  email: string | null
  password_hash?: string | null
}

// Create supabase clients for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Create client for anonymous/public access (frontend)
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Create client for service role access (backend/api routes)
export const supabaseService = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null