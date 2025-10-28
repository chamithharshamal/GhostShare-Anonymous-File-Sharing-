-- Create storage bucket for GhostShare
INSERT INTO storage.buckets (id, name, public)
VALUES ('ghostshare', 'ghostshare', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies for anonymous users to upload files
CREATE POLICY "Anyone can upload files" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'ghostshare');

-- Create policies for anyone to download files with valid token
CREATE POLICY "Anyone can download files with token" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'ghostshare');

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;