# Supabase Setup Guide

This guide will help you set up Supabase for your Uphouse project to fix the Netlify storage issue.

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create new project:
   - **Project name**: `uphouse`
   - **Database password**: Choose a strong password
   - **Region**: Choose closest to your users

### 2. Set Up Database
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire content of `supabase-schema.sql`
3. Click **Run** to create tables and insert sample data

### 3. Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI...`

### 4. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Replace with your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Deploy to Netlify
1. In Netlify dashboard → **Site settings** → **Environment variables**
2. Add the same two variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy your site

## ✅ How It Works

The hybrid storage system automatically detects:
- **Localhost**: Uses file storage OR Supabase (whichever is available)
- **Netlify**: Uses Supabase (since file system is read-only)

## 🔄 Migration

Your existing projects will automatically work:
- **Localhost**: Continues using `data/projects.json` if Supabase isn't configured
- **Netlify**: Switches to Supabase automatically

## 🛠️ Tables Created

- **projects**: Your portfolio projects
- **hero_images**: Homepage carousel images
- **contacts**: Contact form submissions

## 📊 Free Tier Limits

Supabase free tier includes:
- ✅ 50MB database storage
- ✅ 100MB file storage
- ✅ 50,000 monthly active users
- ✅ Up to 500MB bandwidth per month

Perfect for your portfolio site!

## 🔧 Troubleshooting

**Environment variables not working?**
- Make sure variables start with `NEXT_PUBLIC_`
- Restart your dev server after adding `.env.local`
- Check Netlify environment variables are set correctly

**Database connection failed?**
- Verify your Project URL and anon key
- Check if your IP is blocked (shouldn't be with RLS policies)
- Make sure you ran the SQL schema setup

**Still seeing file storage on localhost?**
- This is normal! The system uses file storage as fallback
- Add Supabase env vars to force Supabase usage locally

## 🎯 Next Steps

After setup, your portfolio will work identically on:
- ✅ **Localhost** (development)
- ✅ **Netlify** (production)
- ✅ **Any other hosting** (Vercel, etc.)

No more differences between environments!