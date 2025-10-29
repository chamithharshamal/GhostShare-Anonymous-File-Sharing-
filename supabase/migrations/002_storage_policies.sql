-- Create storage bucket for GhostShare
INSERT INTO storage.buckets (id, name, public)
VALUES ('ghostshare', 'ghostshare', false)
ON CONFLICT (id) DO NOTHING;

-- Note: Storage policies cannot be created via SQL scripts due to permission restrictions.
-- Storage policies must be set up manually through the Supabase dashboard.
-- 
-- To set up storage policies, follow these steps:
-- 
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Storage > Buckets
-- 3. Click on the 'ghostshare' bucket
-- 4. Go to the Policies tab
-- 5. Add the following policies:
-- 
-- Policy 1 (Upload):
--   - Name: "Anyone can upload files"
--   - Operation: INSERT
--   - Roles: anon
--   - Using: bucket_id = 'ghostshare'
-- 
-- Policy 2 (Download):
--   - Name: "Anyone can download files with token"
--   - Operation: SELECT
--   - Roles: anon
--   - Using: bucket_id = 'ghostshare'
-- 
-- These policies allow anonymous users to:
-- 1. Upload files to the ghostshare bucket
-- 2. Download files from the ghostshare bucket (with valid signed URLs)