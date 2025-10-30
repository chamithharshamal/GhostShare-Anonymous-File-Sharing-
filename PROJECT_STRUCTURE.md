# ShadeDrop Project Structure

This document provides an overview of the ShadeDrop application's directory structure and key files.

## Root Directory

```
.
├── README.md                 # Project overview and setup instructions
├── VERCEL_DEPLOYMENT_GUIDE.md # Vercel deployment guide
├── PROJECT_STRUCTURE.md      # This document
├── package.json             # Node.js dependencies and scripts
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── vercel.json              # Vercel deployment configuration
├── .env.local.example       # Example environment variables
├── .gitignore               # Git ignore rules
├── public/                  # Static assets
│   ├── favicon.ico          # Favicon
│   └── robots.txt           # Robots.txt
├── src/                     # Source code
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility libraries
│   └── styles/              # Global styles
└── supabase/                # Supabase configuration and setup
    ├── setup.sql            # Database schema and RLS policies
    ├── STORAGE_SETUP.md     # Storage bucket setup guide
    └── test-setup.js        # Supabase test script
```

## src/app/ Directory

The main Next.js app directory using the App Router:

```
src/app/
├── page.tsx                 # Main upload page
├── layout.tsx               # Root layout
├── globals.css              # Global CSS styles
├── debug/                   # Debug pages
│   ├── [id]/page.tsx        # Debug file by ID
│   └── page.tsx             # Debug tools
├── diagnose/                # Diagnostics page
│   └── page.tsx
├── download/                # Download pages
│   └── [id]/page.tsx        # File download page
├── api/                     # API routes
│   ├── cleanup/route.ts     # Cleanup expired files
│   ├── delete/[id]/route.ts # Delete file
│   ├── download/[id]/route.ts # Download file
│   ├── health/route.ts      # Health check
│   ├── request-upload/route.ts # Request upload URL
│   └── send-link/route.ts   # Send download link via email
└── test-upload/             # Test upload page
    └── page.tsx
```

## src/components/ Directory

Reusable React components:

```
src/components/
├── FileUploader.tsx         # Drag-and-drop file uploader
├── FilePreview.tsx          # File preview component
├── QRCodeDisplay.tsx        # QR code generator
├── LinkCard.tsx             # Download link display
├── ProgressCard.tsx         # Upload progress indicator
├── ConfirmModal.tsx         # Custom confirmation dialog
├── Icons.tsx                # SVG icon components
└── ShadeDropIcon.tsx        # ShadeDrop logo icon
```

## src/lib/ Directory

Utility libraries and helpers:

```
src/lib/
├── supabaseClient.ts        # Supabase client configuration
├── filePreview.ts           # File preview utilities
└── utils.ts                 # General utility functions
```

## supabase/ Directory

Supabase configuration and setup files:

```
supabase/
├── setup.sql                # Database schema, tables, and policies
├── STORAGE_SETUP.md         # Storage bucket configuration guide
└── test-setup.js            # Automated test setup script
```

## Key Features

- **Anonymous File Sharing**: No user accounts required
- **Secure Storage**: Files stored in private Supabase Storage
- **Password Protection**: Optional file encryption
- **Expiration**: Configurable file expiration times
- **One-time Downloads**: Files deleted after first access
- **Email Integration**: Send links via Mailjet
- **QR Codes**: Mobile-friendly access via QR codes
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Modern dark theme UI

## Security

- **Row Level Security**: Database access policies
- **Signed URLs**: Secure file access
- **Password Hashing**: SHA-256 for password protection
- **Automatic Cleanup**: Expired files removed automatically