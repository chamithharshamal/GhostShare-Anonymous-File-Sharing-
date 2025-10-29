# Vercel Deployment Guide for GhostShare

This guide will help you properly configure and deploy the GhostShare application to Vercel.

## Environment Variables Setup

When deploying to Vercel, you need to configure the environment variables in the Vercel dashboard. The `.env.local` file is not used in production deployments.

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL** - Your Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Your Supabase anonymous key
3. **SUPABASE_SERVICE_ROLE_KEY** - Your Supabase service role key
4. **MAILJET_API_KEY** - Your Mailjet API key
5. **MAILJET_API_SECRET** - Your Mailjet API secret
6. **MAILJET_FROM_EMAIL** - Your verified sender email address
7. **NEXT_PUBLIC_MAX_FILE_SIZE** - Maximum file size in bytes (default: 104857600 for 100MB)
8. **NEXT_PUBLIC_APP_URL** - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
9. **CRON_AUTH_TOKEN** - A secure token for cron jobs
10. **SUPABASE_ACCESS_TOKEN** - Your Supabase access token (for CLI operations)

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your GhostShare project
3. Go to Settings > Environment Variables
4. Add each of the required environment variables listed above

### Example Values

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_API_SECRET=your_mailjet_api_secret
MAILJET_FROM_EMAIL=your_verified_email@example.com
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
NEXT_PUBLIC_APP_URL=https://your-ghostshare-app.vercel.app
CRON_AUTH_TOKEN=your_secure_cron_token
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
```

## Updating NEXT_PUBLIC_APP_URL

Make sure to update the `NEXT_PUBLIC_APP_URL` environment variable to match your actual Vercel deployment URL. This is crucial for:
- Generating correct download links
- QR code generation
- Email template links

## Supabase Configuration

Ensure your Supabase project is properly configured:

1. Database tables are created using the setup script
2. Storage bucket `ghostshare` exists
3. RLS policies are correctly set up
4. Storage policies are configured for the `ghostshare` bucket

## Troubleshooting

### "Application not properly configured" Error

This error occurs when:
1. Environment variables are not set in Vercel
2. Supabase credentials are incorrect
3. Network connectivity issues between Vercel and Supabase

### Verification Steps

1. Check that all environment variables are correctly set in Vercel
2. Verify that Supabase credentials are correct
3. Test the Supabase connection using the Supabase dashboard
4. Check Vercel logs for specific error messages

## Redeployment

After setting up the environment variables:
1. Make a small change to trigger a new deployment
2. Or redeploy the latest commit from the Vercel dashboard

## Additional Notes

- Never commit sensitive environment variables to your repository
- Use Vercel's preview deployments to test configuration changes
- Monitor Vercel logs for any errors during deployment