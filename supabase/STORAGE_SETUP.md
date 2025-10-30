# Supabase Storage Setup Guide

This guide will help you set up the storage bucket and policies for ShadeDrop manually through the Supabase dashboard.

## Step 1: Create the Storage Bucket

1. Log in to your Supabase dashboard
2. Select your project
3. Navigate to **Storage** > **Buckets** in the left sidebar
4. Click the **New Bucket** button
5. Fill in the form:
   - **Name**: `ghostshare`
   - **Public**: Uncheck (keep it private)
6. Click **Create**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up policies to allow anonymous users to upload and download files.

### Add Insert Policy (Upload)

1. In the Buckets list, find and click on the `ghostshare` bucket
2. Click on the **Policies** tab
3. Click **Add Policy**
4. Fill in the form:
   - **Policy name**: `Anyone can upload files`
   - **Operation**: `INSERT`
   - **Roles**: Check `anon`
   - **Using**: `bucket_id = 'ghostshare'`
5. Click **Save**

### Add Select Policy (Download)

1. Click **Add Policy** again
2. Fill in the form:
   - **Policy name**: `Anyone can download files with token`
   - **Operation**: `SELECT`
   - **Roles**: Check `anon`
   - **Using**: `bucket_id = 'ghostshare'`
3. Click **Save**

## Verification

After setting up the policies, your storage configuration should look like this:

- **Bucket Name**: `ghostshare`
- **Public**: No (private)
- **Policies**:
  - `Anyone can upload files` (INSERT for anon role)
  - `Anyone can download files with token` (SELECT for anon role)

## Troubleshooting

If you encounter issues:

1. **Ensure the bucket name is exactly `ghostshare`** - this must match the code in your application
2. **Check that both policies are created** - missing policies will cause upload/download failures
3. **Verify the policy conditions** - the `bucket_id = 'ghostshare'` condition is critical
4. **Make sure you're using the service role key** in your backend API routes for elevated permissions

Your ShadeDrop application should now be able to upload and download files properly!