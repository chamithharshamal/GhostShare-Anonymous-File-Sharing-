-- Create the files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  delete_after_send BOOLEAN DEFAULT false,
  one_time BOOLEAN DEFAULT false,
  sent BOOLEAN DEFAULT false,
  email TEXT,
  password_hash TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_files_expires_at ON files(expires_at);
CREATE INDEX IF NOT EXISTS idx_files_sent ON files(sent);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert files" ON files;
DROP POLICY IF EXISTS "Anyone can select files" ON files;
DROP POLICY IF EXISTS "Anyone can update sent status" ON files;

-- Create policies for anonymous access
CREATE POLICY "Anyone can insert files" ON files
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can select files" ON files
FOR SELECT TO anon
USING (true);

CREATE POLICY "Anyone can update sent status" ON files
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON TABLE files TO anon;
GRANT ALL ON TABLE files TO authenticated;

-- Create storage bucket for GhostShare
INSERT INTO storage.buckets (id, name, public)
VALUES ('ghostshare', 'ghostshare', false)
ON CONFLICT (id) DO NOTHING;

-- Note: Storage policies are typically managed through the Supabase dashboard
-- rather than SQL scripts, as they require special permissions.
-- You'll need to set these up manually in the Supabase dashboard:
-- 1. Go to Storage > Buckets > ghostshare
-- 2. Click on "Policies" 
-- 3. Create policies for insert and select operations for the anon role