# 🧩 Uphouse Design System — Complete Documentation (2025)

> **Business Context**: See [建設公司網站prd_UPDATED.md](./建設公司網站prd_UPDATED.md) for business requirements and feature scope.

---

## 📄 Table of Contents

1. [Overview & Setup](#overview--setup)
2. [Design Philosophy](#design-philosophy)
3. [Color System](#color-system)
4. [Typography & Spacing](#typography--spacing)
5. [Button System](#button-system)
6. [Component Specifications](#component-specifications)
7. [Accessibility (A11y)](#accessibility-a11y)
8. [Development Guidelines](#development-guidelines)

---

## Overview & Setup

### Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Authentication:** Clerk Auth
- **Deployment:** Cloudflare Pages
- **Media:** Cloudinary CDN
- **State:** Zustand
- **Testing:** Vitest + Playwright

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase CLI: `npm install -g supabase`
- Git

### Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd uphouse
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development
npm run dev
```

### Project Structure

```
uphouse/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── hooks/           # Custom hooks
│   ├── stores/          # Zustand stores
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── supabase/
│   ├── migrations/      # Database migrations
│   └── functions/       # Edge Functions
└── docs/               # Documentation
```

---

## Design Philosophy

### Core Principles

**核心概念**: **穩定 × 留白 × 信任感**

**設計哲學**:
- **Mobile First** — 小螢幕保留核心訊息，大螢幕強化留白與層次
- **資料驅動** — 所有內容來自 CMS，無硬編碼
- **可訪問優先** — WCAG AA 標準，完整鍵盤導航

**實作基礎**:
- **Tailwind CSS** (`darkMode: 'class'`)
- **shadcn/ui** 元件庫
- **自托管 LINE Seed TW** 字體

### Code & Color Management Rules

#### 單一真實來源 (SSOT)
所有顏色必須集中定義於 `tailwind.config.js`：

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#fefae0',      // L1 背景
          surface: '#f4f6f2',   // L2 表面
          border: '#e5e8e2',    // L5 邊框
          text: '#1a1a1a',      // L6 主文字
          muted: '#6b6b6b',     // L7 次文字
          primary: '#283618',   // L3 深綠
          accent: '#dda15e',    // L4 琥珀
        },
        // ... Dark mode colors
      }
    }
  }
}
```

#### 禁止硬編碼
❌ **錯誤做法**:
```tsx
<div className="bg-[#283618]">  // 禁止
<div style={{ color: '#dda15e' }}>  // 禁止
```

✅ **正確做法**:
```tsx
<div className="bg-primary">  // 使用語意類別
<div className="text-muted-foreground">  // 使用語意類別
```

#### 深色模式切換
透過 `<html class="dark">` 啟用：

```tsx
// ThemeToggle.tsx
document.documentElement.classList.toggle('dark')
```

---

## Color System

> **Business Requirement**: 參考 [PRD Section 9](./建設公司網站prd_UPDATED.md#9-品牌色彩規範)

### 60 / 30 / 10 Rule

配色策略遵循 **60 / 30 / 10 比例分配**：

| 比例 | 類別 | 語意用途 | 氛圍描述 |
|------|------|---------|---------|
| **60%** | Base | 背景色系、留白區域 | 穩定基調、柔和、呼吸感 |
| **30%** | Text / Structure | 文字、結構、導覽列、邊界 | 穩重、可信賴、建立層次與可讀性 |
| **10%** | Accent | 品牌強調、CTA、按鈕 | 溫暖、有力量、吸引注意力 |

### Standard Colors (Light Mode)

使用 **shadcn/ui** 命名規範：

| 層級 | shadcn Token | Tailwind Class | HEX | 用途 |
|------|-------------|----------------|-----|------|
| L1 | `background` | `bg-background` | `#FEFAE0` | 背景、留白 (60%) |
| L2 | `secondary` | `bg-secondary` | `#F4F6F2` | 卡片、表面層 |
| L3 | `primary` | `bg-primary` | `#283618` | 品牌主色（深綠）(30%) |
| L4 | `accent` | `bg-accent` | `#DDA15E` | CTA 琥珀 (10%) |
| L5 | `border` | `border-border` | `#E5E8E2` | 邊框、分隔線 |
| L6 | `foreground` | `text-foreground` | `#1A1A1A` | 主要文字 (30%) |
| L7 | `muted-foreground` | `text-muted-foreground` | `#6B6B6B` | 次要文字 |

### Standard Colors (Dark Mode)

| 層級 | shadcn Token | HEX | 用途 |
|------|-------------|-----|------|
| L1 | `background` | `#1A1E17` | 深色背景 |
| L2 | `secondary` | `#232920` | 深色表面 |
| L3 | `primary` | `#A3B18A` | 夜間主色（亮綠） |
| L4 | `accent` | `#E9C46A` | 夜間 CTA（亮黃） |
| L5 | `border` | `#2F352C` | 深色邊框 |
| L6 | `foreground` | `#F4F6F2` | 夜間主要文字 |
| L7 | `muted-foreground` | `#B5B8B1` | 夜間次要文字 |

### WCAG Contrast Requirements

所有設計必須符合以下對比標準：

| 元素 | 最低對比度 | WCAG 等級 |
|------|-----------|----------|
| **正文對背景** | ≥ **4.5:1** | AA |
| **主文案**（H1, H2） | ≥ **7:1** | AAA |
| **CTA 對背景** | ≥ **4.5:1** | AA |
| **次要文字** (muted) | ≥ **3:1** | - |

### HSL Adjustment Guidelines

色彩調整需以 **HSL 的 L (亮度) / S (飽和度)** 為衡量指標：

#### Light Mode
- **Base**: L 調至 **94–98**, S 降至 **≤ 20**
- **Primary Text**: 對 Base 對比 ≥ 7:1，需加深 (L -5~-15) 並降飽和
- **CTA**: 確保對 Base **≥ 4.5:1**

#### Dark Mode
- **Base**: L 調至 **6–10**, S 降至 **≤ 20**
- **Primary Text**: L 提亮至 **≥ 90**, S 降至 **≤ 10**
- **CTA**: 提亮 10–20 或增飽和 10–20，確保對 Base **≥ 4.5:1**

### Visual Structure Mapping

| 視覺層級 | Light Mode | Dark Mode | 功能說明 | 明度差 |
|---------|-----------|-----------|---------|-------|
| **背景層** (L1) | #FEFAE0 (米白) | #1A1E17 (深灰綠) | 整體基底，控制氣氛明暗 | 5-8% |
| **卡片層** (L2) | #F4F6F2 (淺綠灰) | #232920 (中灰綠) | 模組／卡片區，提供層次分隔 | 5-8% |
| **主色層** (L3) | #283618 (深綠) | #A3B18A (亮綠) | 品牌核心導向色 | - |
| **強調層** (L4) | #DDA15E (琥珀) | #E9C46A (亮黃) | 行動焦點、CTA、hover | - |
| **文字層** (L6/L7) | #1A1A1A / #6B6B6B | #F4F6F2 / #B5B8B1 | 主／次層內容可讀性對比 | - |
| **邊界層** (L5) | #E5E8E2 (極淺灰綠) | #2F352C (低對比柔灰) | 分隔、框線層次 | - |

### Implementation Example

```tsx
// Hero Section
<section className="bg-background text-foreground">
  <h1 className="text-primary font-bold">建設公司</h1>
  <p className="text-muted-foreground">專業建設團隊</p>
  <Button className="bg-accent hover:bg-accent/90">
    立即聯絡
  </Button>
</section>

// Card Component
<Card className="bg-secondary border-border">
  <CardTitle className="text-foreground">建案名稱</CardTitle>
  <CardDescription className="text-muted-foreground">
    位置資訊
  </CardDescription>
</Card>
```

---

## Typography & Spacing

### Font System

**字體**: 全域載入並自托管 **LINE Seed TW**

```css
/* globals.css */
@font-face {
  font-family: 'LINE Seed TW';
  src: url('/fonts/LINESeedTW_Rg.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'LINE Seed TW';
  src: url('/fonts/LINESeedTW_Bd.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
```

### Font Scales

**最小字級**: **16px** (body text & clickable elements)

| 元素 | Mobile | Desktop | Weight | Tailwind Class |
|------|--------|---------|--------|----------------|
| **H1** | 28-32px | 48-64px | Bold (700) | `text-3xl md:text-5xl font-bold` |
| **H2** | 22-24px | 32-40px | Semibold (600) | `text-2xl md:text-4xl font-semibold` |
| **H3** | 18-20px | 24-28px | Semibold (600) | `text-xl md:text-2xl font-semibold` |
| **Body** | 16px | 16px | Regular (400) | `text-base leading-relaxed` |
| **Small** | 14px | 14px | Regular (400) | `text-sm` |

### Spacing System (8px Grid)

基於 8px 網格建立間距 Token：

| Token | Value | Tailwind | 用途 |
|-------|-------|----------|------|
| **XS** | 4px | `space-x-1`, `p-1` | Icon 內距 |
| **S** | 8px | `space-x-2`, `p-2` | 元件內距 |
| **M** | 16px | `space-x-4`, `p-4` | 元素間距 |
| **L** | 24px | `space-x-6`, `p-6` | 區塊留白 |
| **XL** | 32px | `space-x-8`, `p-8` | Section 間距 |
| **XXL** | 48px | `space-x-12`, `p-12` | Hero/大段落間距 |

### Example Usage

```tsx
// Typography hierarchy
<div className="space-y-6">
  <h1 className="text-3xl md:text-5xl font-bold text-foreground">
    專案標題
  </h1>
  <h2 className="text-2xl md:text-4xl font-semibold text-foreground">
    次標題
  </h2>
  <p className="text-base leading-relaxed text-muted-foreground">
    內文描述...
  </p>
</div>

// Spacing application
<section className="py-12 md:py-16">  {/* XXL vertical spacing */}
  <div className="container mx-auto px-4">  {/* M horizontal padding */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">  {/* L gap */}
      {/* Cards */}
    </div>
  </div>
</section>
```

---

## Button System

> **UX Principles**: Von Restorff Effect, Hick's Law, Fitts's Law

### Button Hierarchy

按鈕設計旨在透過清晰的層級劃分降低用戶認知負載：

| 優先級 | 變體 | UX 法則應用 | 每頁限制 |
|--------|------|------------|---------|
| **P1 (Primary)** | 實心強調色 | **Von Restorff Effect**: 必須與眾不同，易被記住 | **1 個** |
| **P2 (Secondary)** | 中性/外框 | **Hick's Law**: 提供次要選項，避免選擇超載 | 1-2 個 |
| **P3 (Tertiary/Ghost)** | 文字/透明 | **認知負載**: 最低干擾，用於不緊急操作 | 視需要 |
| **Destructive** | 破壞性 | **安全性**: 避免誤操作 | 一般頁面用 outline |

### Button Variants

```tsx
import { Button } from '@/components/ui/button'

// P1 - Primary (每頁面限 1 個)
<Button variant="default">立即預約</Button>

// P2 - Secondary (1-2 個)
<Button variant="secondary">了解更多</Button>
<Button variant="outline">聯絡我們</Button>

// P3 - Tertiary (視需要)
<Button variant="ghost">取消</Button>
<Button variant="link">查看詳情</Button>

// Destructive
<Button variant="destructive-outline">刪除</Button>  // 一般頁面
<Button variant="destructive">確認刪除</Button>      // 確認對話框
```

### Button Sizing (Fitts's Law)

**所有可點擊區域 ≥ 44×44px**

| Size | Height | Padding | Font | Tailwind Class |
|------|--------|---------|------|----------------|
| **Default** | 44px | px-6 py-2 | 16px | `h-11 px-6 text-base` |
| **Small** | 44px | px-4 py-2 | 14px | `h-10 px-4 text-sm` |
| **Large** | 48px | px-8 py-3 | 18px | `h-12 px-8 text-lg` |
| **Icon** | 44px × 44px | p-2 | - | `h-11 w-11` |

### Button States (Doherty Threshold)

所有互動必須提供即時視覺回饋 (150-200ms)：

| 狀態 | Light Mode Behavior | Dark Mode Behavior | Tailwind Implementation |
|------|--------------------|--------------------|------------------------|
| **Normal** | 基準狀態 | 基準狀態 | `bg-primary text-primary-foreground` |
| **Hover** | 明度 ΔL **-6~-12** | 明度 ΔL **+6~+10** | `hover:bg-primary/90` |
| **Pressed** | 明度 ΔL **-10~-16** | 明度 ΔL **+10~+16** | `active:bg-primary/80` |
| **Focus** | Focus ring 2px | Focus ring 2px | `focus-visible:ring-2 ring-accent` |
| **Disabled** | Opacity 60-70% | Opacity 60-70% | `disabled:opacity-60` |
| **Loading** | Spinner + disabled | Spinner + disabled | `disabled:opacity-60` |

### Button Component Implementation

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
        ghost: "bg-transparent text-foreground hover:bg-accent/10",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        "destructive-outline": "border-2 border-destructive bg-transparent text-destructive hover:bg-destructive/10",
      },
      size: {
        default: "h-11 min-h-[44px] px-6 py-2",
        sm: "h-10 min-h-[44px] px-4 text-sm",
        lg: "h-12 min-h-[44px] px-8 text-lg",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Usage Examples

```tsx
// Form submission (P1 right, P2 left)
<div className="flex justify-end gap-4">
  <Button variant="outline">取消</Button>
  <Button variant="default">確認送出</Button>
</div>

// Hero CTA
<div className="flex flex-col sm:flex-row gap-4">
  <Button size="lg" variant="default">立即預約</Button>
  <Button size="lg" variant="outline">了解更多</Button>
</div>

// Destructive confirmation dialog
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogTitle>確定要刪除？</AlertDialogTitle>
    <AlertDialogDescription>
      此操作無法復原
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction asChild>
        <Button variant="destructive">確認刪除</Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Component Specifications

### Card (Law of Common Region)

使用 `--secondary` 背景、`--border` 邊框，將相關資訊視覺化分組：

```tsx
<Card className="bg-secondary border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle className="text-foreground">建案名稱</CardTitle>
    <CardDescription className="text-muted-foreground">
      台北市大安區
    </CardDescription>
  </CardHeader>
  <CardContent>
    <img src="..." alt="..." className="rounded-lg" />
    <div className="mt-4 space-y-2">
      <p className="text-foreground">坪數：25-35坪</p>
      <p className="text-muted-foreground">總戶數：120戶</p>
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="outline" className="w-full">查看詳情</Button>
  </CardFooter>
</Card>
```

### Navbar

固定頂部，使用 `--background` + `backdrop-blur`，滾動後變實色：

```tsx
<nav className={cn(
  "sticky top-0 z-50 w-full border-b border-border",
  "bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  isScrolled && "bg-background shadow-sm"
)}>
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <Logo />
      <NavigationMenu />
      <ThemeToggle />
    </div>
  </div>
</nav>
```

### Form

Label 置上，輸入框 `focus:ring` 需明顯：

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name" className="text-foreground">
      姓名 <span className="text-destructive">*</span>
    </Label>
    <Input
      id="name"
      type="text"
      className={cn(
        "bg-background border-border text-foreground",
        "focus-visible:ring-2 focus-visible:ring-accent",
        errors.name && "border-destructive"
      )}
      aria-invalid={!!errors.name}
      aria-describedby={errors.name ? "name-error" : undefined}
    />
    {errors.name && (
      <p id="name-error" className="text-sm text-destructive">
        {errors.name.message}
      </p>
    )}
  </div>
</form>
```

### Badge (Status Labels)

```tsx
// 建案狀態標籤
<Badge variant="destructive">熱銷中</Badge>
<Badge variant="secondary" className="text-secondary-foreground">規劃中</Badge>
<Badge variant="muted" className="bg-muted text-muted-button-foreground">完銷</Badge>
```

### Footer

使用深層表面混合：

```tsx
<footer className="bg-primary text-primary-foreground py-10">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-semibold mb-4">關於我們</h3>
        <p className="text-sm opacity-90">專業建設團隊...</p>
      </div>
      <div>
        <h3 className="font-semibold mb-4">聯絡資訊</h3>
        <ul className="space-y-2 text-sm opacity-90">
          <li>電話: 02-1234-5678</li>
          <li>Email: info@uphouse.com</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4">追蹤我們</h3>
        <div className="flex gap-4">
          <a href="#" className="hover:text-accent transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
```

---

## Accessibility (A11y)

### Keyboard Navigation

**所有互動元素必須可透過鍵盤存取**：

```tsx
// Focus indicators
<Button className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
  Click me
</Button>

// Tab order (logical flow)
<form>
  <Input tabIndex={1} />
  <Input tabIndex={2} />
  <Button tabIndex={3}>Submit</Button>
</form>

// Skip links
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  跳至主要內容
</a>
```

### ARIA Support

```tsx
// Form errors
<Input
  aria-invalid={!!errors.email}
  aria-describedby="email-error"
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-destructive">
    {errors.email.message}
  </p>
)}

// Dynamic content
<div aria-live="polite" aria-atomic="true">
  {toast.message}
</div>

// Buttons with icons
<Button aria-label="關閉對話框">
  <X className="h-4 w-4" />
</Button>

// Images
<img src="..." alt="建案外觀照片" />
```

### Focus Management

```tsx
// Modal focus trap
import { Dialog } from '@radix-ui/react-dialog'

<Dialog>
  <DialogContent>
    {/* Focus automatically trapped */}
    <DialogTitle>標題</DialogTitle>
    <DialogDescription>描述</DialogDescription>
    <Button onClick={handleClose}>關閉</Button>
  </DialogContent>
</Dialog>

// Restore focus after dialog close
const previousFocus = useRef<HTMLElement | null>(null)

const openDialog = () => {
  previousFocus.current = document.activeElement as HTMLElement
  setIsOpen(true)
}

const closeDialog = () => {
  setIsOpen(false)
  previousFocus.current?.focus()
}
```

### Minimum Requirements Checklist

- [ ] 所有可點擊元素 ≥ **44×44px**
- [ ] 鍵盤導航完整（Tab 順序正確）
- [ ] Focus ring 清楚可見
- [ ] 文字對比度 ≥ **4.5:1** (AA)
- [ ] 主標題對比度 ≥ **7:1** (AAA)
- [ ] 表單錯誤有 ARIA 屬性
- [ ] 圖片有 alt 文字
- [ ] 動態內容有 aria-live

---

## Development Guidelines

### Tailwind Config Setup

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Light mode (PRD standard colors)
          base: '#fefae0',
          surface: '#f4f6f2',
          border: '#e5e8e2',
          text: '#1a1a1a',
          muted: '#6b6b6b',
          primary: '#283618',
          accent: '#dda15e',
        },
        brandDark: {
          // Dark mode (auto-calculated)
          base: '#1a1e17',
          surface: '#232920',
          border: '#2f352c',
          text: '#f4f6f2',
          muted: '#b5b8b1',
          primary: '#a3b18a',
          accent: '#e9c46a',
        },
        // shadcn/ui semantic tokens (auto-generated from brand colors)
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      fontFamily: {
        sans: ['LINE Seed TW', 'sans-serif'],
      },
    },
  },
}
```

### CSS Variables

```css
/* src/globals.css */
@layer base {
  :root {
    /* Light mode */
    --background: 52 94% 94%;  /* #FEFAE0 */
    --foreground: 0 0% 10%;    /* #1A1A1A */

    --primary: 84 51% 15%;     /* #283618 */
    --primary-foreground: 0 0% 100%;

    --secondary: 90 26% 95%;   /* #F4F6F2 */
    --secondary-foreground: 0 0% 10%;

    --accent: 32 61% 61%;      /* #DDA15E */
    --accent-foreground: 0 0% 10%;

    --muted: 90 26% 95%;
    --muted-foreground: 0 0% 42%;  /* #6B6B6B */

    --border: 90 22% 91%;      /* #E5E8E2 */

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
  }

  .dark {
    /* Dark mode */
    --background: 90 20% 10%;  /* #1A1E17 */
    --foreground: 90 16% 95%;  /* #F4F6F2 */

    --primary: 90 27% 62%;     /* #A3B18A */
    --primary-foreground: 0 0% 10%;

    --secondary: 90 18% 15%;   /* #232920 */
    --secondary-foreground: 90 16% 95%;

    --accent: 41 77% 68%;      /* #E9C46A */
    --accent-foreground: 0 0% 10%;

    --muted: 90 18% 15%;
    --muted-foreground: 90 10% 70%;  /* #B5B8B1 */

    --border: 90 12% 19%;      /* #2F352C */

    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 100%;
  }
}
```

### Responsive Breakpoints

```tsx
// Mobile First approach
<div className="
  px-4           // Mobile: 16px padding
  md:px-6        // Tablet (768px+): 24px padding
  lg:px-8        // Desktop (1024px+): 32px padding
  grid
  grid-cols-1    // Mobile: 1 column
  md:grid-cols-2 // Tablet: 2 columns
  lg:grid-cols-3 // Desktop: 3 columns
  gap-6          // 24px gap
">
  {/* Cards */}
</div>
```

### Pre-Launch Checklist

以下項目必須在發布前完成驗證：

#### Visual Quality
- [ ] Base/文字對比達標（AA），Dark 模式亦同
- [ ] CTA 對比 ≥ 4.5:1，hover/pressed 差異明顯（ΔL 6-12）
- [ ] 深色模式色票實際閱覽不偏灰、不發螢
- [ ] 1 → 2 → 3 欄 RWD 完整

#### Interaction
- [ ] 可點元素 ≥ 44×44px
- [ ] 鍵盤導航完整
- [ ] Focus ring 清楚
- [ ] 所有按鈕有 hover/pressed 回饋
- [ ] 表單驗證即時顯示

#### Accessibility
- [ ] WCAG AA 合規（4.5:1 文字對比）
- [ ] ARIA 屬性完整
- [ ] alt 文字完整
- [ ] 無鍵盤陷阱
- [ ] Skip links 正常運作

#### Performance
- [ ] 首頁 LCP ≤ 2.5s
- [ ] 圖片使用 Cloudinary 優化
- [ ] Lazy loading 啟用
- [ ] Code splitting 設定

---

## Related Documents

### Business Requirements
- [建設公司網站prd_UPDATED.md](./建設公司網站prd_UPDATED.md) - Complete product requirements
  - Feature scope & MVP definition
  - User roles & permissions
  - Database schema & RLS policies
  - Authentication architecture (Clerk + Supabase)

### Technical Documentation
- README.md - Setup & development guide
- API.md - API endpoints & data formats
- DEPLOYMENT.md - Deployment process & environments

### Design Resources
- Figma: [Design Files](https://figma.com/...) _(if available)_
- Brand Guidelines: [Brand Assets](./brand/) _(if available)_

---

**Document Version**: 2.0
**Last Updated**: 2025-10-12
**Maintained by**: Uphouse Development Team

**Change Log**:
- Removed ColorTester/Coolors testing features (no longer needed)
- Standardized all colors to PRD specification
- Consolidated redundant sections
- Added cross-references to PRD
- Updated to shadcn/ui naming conventions
- Added comprehensive A11y guidelines
