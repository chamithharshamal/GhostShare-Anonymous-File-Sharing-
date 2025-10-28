// Test script to verify Supabase setup
import dotenv from 'dotenv'
dotenv.config({ path: './supabase/.env.test' })

import { createClient } from '@supabase/supabase-js'

// Get credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing environment variables. Please check your supabase/.env.test file.')
  process.exit(1)
}

// Create clients
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseService = createClient(supabaseUrl, supabaseServiceKey)

async function testSetup() {
  console.log('Testing Supabase setup...\n')
  
  // Test 1: Check if files table exists
  console.log('1. Testing database connection and files table...')
  try {
    const { data, error } = await supabaseService
      .from('files')
      .select('id')
      .limit(1)
    
    if (error && !error.message.includes('relation "files" does not exist')) {
      console.error('   Database error:', error.message)
    } else if (error) {
      console.error('   Files table does not exist. Please run the setup.sql script.')
    } else {
      console.log('   ✓ Files table exists and is accessible')
    }
  } catch (err) {
    console.error('   Database connection failed:', err.message)
  }
  
  // Test 2: Check if storage bucket exists
  console.log('\n2. Testing storage bucket...')
  try {
    // Try to list buckets (requires service role)
    const { data, error } = await supabaseService.storage.listBuckets()
    
    if (error) {
      console.error('   Storage error:', error.message)
    } else {
      const ghostshareBucket = data.find(bucket => bucket.name === 'ghostshare')
      if (ghostshareBucket) {
        console.log('   ✓ ghostshare bucket exists')
      } else {
        console.log('   ✗ ghostshare bucket not found. Please create it manually.')
      }
    }
  } catch (err) {
    console.error('   Storage connection failed:', err.message)
  }
  
  // Test 3: Test signed URL generation
  console.log('\n3. Testing signed URL generation...')
  try {
    // Try to create a signed upload URL (requires service role)
    const { data, error } = await supabaseService.storage
      .from('ghostshare')
      .createSignedUploadUrl('test/test-file.txt')
    
    if (error) {
      console.error('   Signed URL error:', error.message)
      if (error.message.includes('The resource was not found')) {
        console.log('   This might be because the bucket policies are not set up correctly.')
        console.log('   Please follow the STORAGE_SETUP.md guide to set up the policies.')
      }
    } else {
      console.log('   ✓ Signed URL generation working')
    }
  } catch (err) {
    console.error('   Signed URL test failed:', err.message)
  }
  
  console.log('\nSetup verification complete.')
  console.log('\nIf any tests failed, please:')
  console.log('1. Run the setup.sql script in your Supabase SQL editor')
  console.log('2. Follow the STORAGE_SETUP.md guide to set up storage policies')
}

testSetup()