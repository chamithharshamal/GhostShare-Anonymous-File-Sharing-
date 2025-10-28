# GhostShare Project Structure

## Directory Structure

```
ghostshare/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/                # API routes
│   │   │   ├── request-upload/ # Request upload URL endpoint
│   │   │   ├── send-link/      # Send download link via email
│   │   │   ├── download/       # Download file endpoint
│   │   │   ├── cleanup/        # Cleanup expired files
│   │   │   └── health/         # Health check endpoint
│   │   ├── download/           # Download page
│   │   │   └── [id]/           # Dynamic download page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main upload page
│   │   ├── loading.tsx         # Loading state
│   │   ├── error.tsx           # Error state
│   │   └── not-found.tsx       # 404 page
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utility functions and services
│   └── types/                  # TypeScript types (if needed)
├── public/                     # Static assets
├── supabase/                   # Supabase configuration and migrations
│   ├── migrations/             # Database migration scripts
│   └── config.toml             # Supabase CLI configuration
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── next.config.ts             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vercel.json                # Vercel deployment configuration
├── README.md                  # Project documentation
├── LICENSE                    # License file
└── PROJECT_STRUCTURE.md       # This file
```

## Key Files

### API Routes
- `src/app/api/request-upload/route.ts` - Generates signed upload URLs
- `src/app/api/send-link/route.ts` - Sends download links via email
- `src/app/api/download/[id]/route.ts` - Handles file downloads with password verification
- `src/app/api/cleanup/route.ts` - Cleans up expired files (cron job)

### Components
- `src/components/FileUploader.tsx` - Drag and drop file upload component
- `src/components/QRCodeDisplay.tsx` - QR code generation component
- `src/components/FilePreview.tsx` - File preview component

### Utilities
- `src/lib/supabaseClient.ts` - Supabase client configuration
- `src/lib/filePreview.ts` - File preview utility functions

### Pages
- `src/app/page.tsx` - Main upload page
- `src/app/download/[id]/page.tsx` - File download page

## Supabase Setup

### Database Schema
- `supabase/migrations/001_create_files_table.sql` - Files table schema
- `supabase/migrations/002_storage_policies.sql` - Storage bucket and policies

### Configuration
- `supabase/config.toml` - Local development configuration

## Environment Variables
- `.env.example` - Template for required environment variables

## Deployment
- `vercel.json` - Vercel cron job configuration