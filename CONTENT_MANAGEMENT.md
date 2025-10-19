# Content Management System

This document describes the new centralized content management system for editing all website text content through the admin panel.

## Overview

Instead of hardcoding text content in the source code, all editable text is now managed through the database and can be updated via the admin panel. This allows non-technical users to update website content without touching code.

## Admin Panel Structure

The admin panel now has a **網站內容管理** (Website Content Management) section with separate pages for editing different parts of the site:

### Admin Menu
```
管理後台 (Admin Dashboard)
├── 儀表板 (Dashboard)
├── 建案管理 (Projects Management)
├── 網站內容管理 (Content Management)
│   ├── 首頁內容 (Homepage Content)          → /admin/content/homepage
│   ├── 建案頁面 (Projects Page)            → /admin/content/projects-page
│   ├── 聯絡頁面 (Contact Page)             → /admin/content/contact-page
│   └── 關於我們頁面 (About Us)             → /admin/content/about
├── 帳號設定 (Settings)
└── 潛在客戶 (Leads)
```

## Database Tables

### `homepage_content`
Manages all text content on the homepage:
- Hero section (badge, title, description)
- Stats section (3 items with label + value)
- Featured projects section (title + description)
- Value propositions (3 cards with title + description)
- Brand promise section (title + description)
- Consultation CTA section (title + description)

### `contact_page_content`
Manages contact page text:
- Page title and description
- Address (label + value + business hours)
- Phone (label + value)
- Email (label + value)

### `projects_page_content`
Manages projects listing page text:
- Page title
- Page description

### `about_page`
Already existed - manages about page content

## Frontend Pages Updated

All public-facing pages now fetch content from the database:

- **HomePage** (`src/pages/HomePage.tsx`) - Fetches from `homepage_content`
- **ContactPage** (`src/pages/ContactPage.tsx`) - Fetches from `contact_page_content`
- **ProjectsPage** (`src/pages/ProjectsPage.tsx`) - Fetches from `projects_page_content`
- **AboutPage** (`src/pages/AboutPage.tsx`) - Already fetches from `about_page`

## Data Models

New data model files created:
- `src/data/homepage.ts` - Types and mappers for homepage content
- `src/data/contactPage.ts` - Types and mappers for contact page content
- `src/data/projectsPage.ts` - Types and mappers for projects page content

## Admin Pages Created

New admin components for content editing:
- `src/pages/admin/AdminHomePageContent.tsx` - Edit homepage content
- `src/pages/admin/AdminContactPageContent.tsx` - Edit contact page content
- `src/pages/admin/AdminProjectsPageContent.tsx` - Edit projects page content

## How to Use

1. Log in to the admin panel at `/admin/login`
2. Navigate to **網站內容管理** section in the sidebar
3. Select the page you want to edit
4. Update the text content in the form fields
5. Click **儲存變更** (Save Changes)
6. Changes appear immediately on the public website

## Database Seeding

Default content is automatically inserted when running `supabase/seed.sql`. This includes all current Chinese text content.

## Benefits

✅ Non-technical users can update website content
✅ No code deployment needed for text changes
✅ Organized by page/section for easy navigation
✅ Changes reflect immediately
✅ Type-safe with TypeScript
✅ Fallback to default content if database is unavailable

## Migration Notes

All hardcoded text has been replaced with dynamic content from the database. The existing text has been preserved as default values in both the data models and database seed file.
