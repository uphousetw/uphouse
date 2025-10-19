# 專案需求文件（PRD）

> 適用對象：建設公司官方網站｜技術棧：Cloudflare + Supabase + Clerk Auth + React + Tailwind CSS + shadcn/UI

---

## 1) 專案概要
- **目標**：建立建設公司品牌形象網站，呈現公司資訊與建案內容，並提供洽詢入口。
- **範圍（MVP）**：
  - 首頁
  - 關於我們
  - 建案一覽（含建案內頁）
  - 聯絡我們（表單）
- **不包含**：會員系統、付款流程、CRM 深度整合、複雜的後台工作流（可於後續版本規劃）。

---

## 2) 角色與使用情境
- **潛在買方**：透過 Google 或廣告進站 → 瀏覽建案 → 留資。
- **投資者**：比較區域建案 → 參考規格 → 聯絡。
- **公司內部行銷**：更新建案資訊。
- **合作夥伴**：查詢建案與公司背景。

---

## 3) 資訊架構
### 主要導覽
- 首頁
- 關於我們
- 建案一覽
- 聯絡我們

### 網站地圖
- `/` 首頁：品牌 Hero、主打建案、CTA
- `/about` 關於我們：公司介紹、里程碑
- `/projects` 建案一覽：篩選/列表卡片
- `/projects/:slug` 建案內頁：建案規格、相簿、CTA
- `/contact` 聯絡我們：表單、地圖、聯絡方式

---

## 4) 功能需求
### 首頁
- Hero 區塊（圖/文字）
- 建案精選（可後台配置）
- CTA（撥打電話、表單連結）
- **最新消息**：目前不需要，但保留擴充介面。

### 關於我們
- 公司簡介
- 團隊/里程碑

### 建案一覽
- 篩選器：區域、房型、價位、狀態（規劃/熱銷/完銷）
- 卡片列表：圖、名稱、位置、價格區間、狀態

### 建案內頁
- 基本資訊：地點、坪數、格局、戶數、特色
- 相簿（圖片）
- CTA（表單、撥打電話）
- **工程進度相簿**：目前不需要，但保留擴充介面。
- **文件下載**：目前不需要，但可擴充。
- **影片**：目前不需要。

### 聯絡我們
- 表單：姓名、電話、Email、訊息
- 表單驗證與反垃圾（Cloudflare Turnstile）
- 聯絡方式（電話、地址、地圖、Line、FB、IG）

---

## 5) 技術需求
- **前端**：React + Tailwind CSS + shadcn/ui（以資料驅動的組件實作，不硬編內容；支援 Draft/Published 預覽）
- **後端/CMS**：
  - **資料庫**：Supabase Postgres（儲存所有內容、建案、用戶資料）
  - **身份驗證**：Clerk Auth（處理 Admin 登入、用戶管理、邀請與密碼重設）
  - **整合方式**：Clerk 作為 Supabase **第三方認證提供者**（Native Integration）
    - Clerk 簽發 JWT session token（包含 `"role": "authenticated"` claim）
    - Supabase 自動驗證 Clerk-signed tokens（無需分享 JWT secret）
    - RLS 策略使用 `auth.jwt()->>'sub'` 直接存取 Clerk user ID
  - **權限管理**：Supabase RLS 策略查詢 `profiles` 表的 `role` 欄位（`admin` / `editor`）
- **部署/媒體**：Cloudflare Pages（前端與 CDN 快取）；**圖片媒體改用 Cloudinary 託管**（前端僅存取 URL 與 `public_id`）。
- **安全性**：Cloudflare Turnstile、防火牆、Rate Limiting；Supabase RLS 與角色權限；審計紀錄

---

## 6) 後端登入與 Admin 管理

### 身份與權限架構

> **整合方式**: Clerk 作為 Supabase **第三方認證提供者**（Native Integration，2025 年推薦方式）

- **角色**：
  - `admin`（完全存取）：可管理所有內容、用戶、系統設定
  - `editor`（內容編輯）：可編輯內容，但不可變更系統設定或用戶權限

- **認證流程（Native Integration）**：
  1. Admin 透過 **Clerk Auth** 登入（支援 Email/Password、SSO、MFA）
  2. Clerk 自動簽發 JWT session token（包含 `"role": "authenticated"` 與 `"sub"` claims）
  3. 前端使用 `getToken({ template: 'supabase' })` 取得 token
  4. 前端將 token 放入 `Authorization: Bearer <token>` header，傳送至 Supabase
  5. Supabase 自動驗證 Clerk-signed token（已設定為信任的第三方提供者）
  6. RLS 策略使用 `auth.jwt()->>'sub'` 取得 Clerk user ID（字串格式）
  7. RLS 策略查詢 `profiles` 表，比對 `clerk_user_id` 欄位，取得用戶 `role`
  8. 根據 `role` 授予對應的資料存取權限（admin 全存取，editor 受限）

- **設定步驟**：
  1. **Supabase Dashboard** → Authentication → Third-Party Auth → 啟用 **Clerk**
  2. **Clerk Dashboard** → Integrations → Supabase → 新增連接
  3. Supabase 自動信任 Clerk-signed tokens（無需手動配置 JWT template）

- **用戶管理**：
  - Clerk Dashboard 管理 Admin 帳號邀請與組織 (Organizations)
  - Supabase `profiles` 表儲存額外角色與權限（admin/editor）
  - Clerk webhook 自動同步用戶建立/刪除至 Supabase
  - 支援密碼重設、MFA、帳號停用、審計日誌

### 內容管理範圍（皆不硬編）
- **首頁**：Hero（標題/副標/背景圖）、精選建案排序、CTA 連結、品牌區塊文案。
- **關於我們**：公司簡介（Rich Text/Markdown）、里程碑（可增刪排序）。
- **建案一覽/內頁**：建案 CRUD、相簿管理、狀態（規劃/熱銷/完銷）、特色標籤、價格/坪數區間。
- **導覽/頁尾**：導覽選單項目、社群連結、聯絡資訊。
- **聯絡我們**：表單目的地 Email、感興趣建案清單來源（同步建案表）。

### 工作流程
- 草稿 Draft → 發佈 Published
- 支援排程發佈（可選）
- **版本與審計**：每次變更存版本（記錄修改者、時間、差異摘要）
- **預覽模式**：Admin 端可預覽 Draft（以帶簽名 Token 的預覽連結）

---

## 7) 資料模型（Supabase）

### 核心資料表

#### `profiles`（用戶資料與權限）
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE NOT NULL,  -- Clerk 'sub' claim (字串格式，非 UUID)
  email text,
  role text NOT NULL DEFAULT 'editor',  -- admin | editor
  metadata jsonb DEFAULT '{}'::jsonb,   -- 額外用戶資料
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 自動設定 clerk_user_id 為當前 JWT sub claim
ALTER TABLE profiles
  ALTER COLUMN clerk_user_id
  SET DEFAULT (auth.jwt()->>'sub');

-- 索引優化
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
```

**欄位說明**：
- `clerk_user_id`: Clerk 用戶 ID（字串格式，如 `user_2abc...`）
- `role`: 應用層級角色（`admin` 或 `editor`）
- `metadata`: 儲存額外資料（如組織 ID、權限設定等）

#### `projects`（建案）
- `id` (uuid, pk)
- `slug` (text, unique)
- `name` (text)
- `status` (enum: planning|hot|soldout)
- `location` (text)
- `address` (text)
- `lat`/`lng` (numeric)
- `household_count` (int)
- `layout_options` (jsonb: 房型/坪數帶)
- `price_range` (int4range or jsonb)
- `features` (text[])
- `cover_image_public_id` (text)
- `cover_image_url` (text)
- `published_at` (timestamptz)
- `is_published` (bool)
- `created_by` (uuid, fk → profiles)
- `updated_by` (uuid, fk → profiles)

#### `project_images`（建案相簿）
- `id` (uuid, pk)
- `project_id` (uuid, fk)
- `public_id` (text) — Cloudinary ID
- `secure_url` (text)
- `format` (text)
- `bytes` (int)
- `width` (int)
- `height` (int)
- `alt` (text)
- `sort` (int)

#### `pages`（通用頁面內容）
- `id` (uuid, pk)
- `slug` (text, unique) — about/home
- `title` (text)
- `content` (jsonb) — 區塊化：hero/sections/cards，圖片以 Cloudinary `public_id` 與 URL 儲存
- `is_published` (bool)
- `published_at` (timestamptz)
- `created_by` (uuid, fk → profiles)
- `updated_by` (uuid, fk → profiles)

#### `navigation_links`（導覽）
- `id` (uuid, pk)
- `label` (text)
- `href` (text)
- `sort` (int)
- `is_active` (bool)

#### `site_settings`（站點設定）
- `id` (uuid, pk)
- `key` (text, unique) — 例：cta_phone、social_links、cloudinary_folder
- `value` (jsonb)
- `updated_by` (uuid, fk → profiles)
- `updated_at` (timestamptz)

#### `leads`（表單送出）
- `id` (uuid, pk)
- `name` (text)
- `phone` (text)
- `email` (text)
- `message` (text)
- `interest_projects` (uuid[])
- `created_at` (timestamptz)
- `ip_address` (inet)
- `user_agent` (text)

### Row Level Security (RLS) 策略

> **重要**: 使用 `auth.jwt()->>'sub'` 取得 Clerk user ID（字串格式）

#### Public 存取（未登入用戶）
```sql
-- 只能讀取已發佈內容
CREATE POLICY "public_read_published_projects" ON projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "public_read_published_pages" ON pages
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "public_read_navigation" ON navigation_links
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- 可插入 leads（表單提交）
CREATE POLICY "public_insert_leads" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

#### 輔助函數（Helper Functions）
```sql
-- 取得當前用戶的 Clerk ID
CREATE OR REPLACE FUNCTION auth.clerk_user_id()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    auth.jwt()->>'sub',
    ''
  )::text;
$$;

-- 檢查用戶角色
CREATE OR REPLACE FUNCTION auth.has_role(required_role text)
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE clerk_user_id = auth.clerk_user_id()
    AND role = required_role
  );
$$;

-- 檢查用戶是否有任一角色
CREATE OR REPLACE FUNCTION auth.has_any_role(required_roles text[])
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE clerk_user_id = auth.clerk_user_id()
    AND role = ANY(required_roles)
  );
$$;
```

#### Admin 完全存取
```sql
-- Admin 可讀寫所有資料
CREATE POLICY "admin_all_access" ON projects
  FOR ALL
  TO authenticated
  USING (auth.has_role('admin'))
  WITH CHECK (auth.has_role('admin'));

-- 或使用內聯方式（無需輔助函數）
CREATE POLICY "admin_all_access_inline" ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE clerk_user_id = (auth.jwt()->>'sub')::text
      AND role = 'admin'
    )
  );
```

#### Editor 受限存取
```sql
-- Editor 可編輯內容（包含 admin 也可存取）
CREATE POLICY "editor_content_access" ON projects
  FOR ALL
  TO authenticated
  USING (auth.has_any_role(ARRAY['admin', 'editor']))
  WITH CHECK (auth.has_any_role(ARRAY['admin', 'editor']));

-- Editor 無法存取 site_settings（只有 admin 可以）
CREATE POLICY "admin_only_settings" ON site_settings
  FOR ALL
  TO authenticated
  USING (auth.has_role('admin'))
  WITH CHECK (auth.has_role('admin'));

-- Editor 可讀取 site_settings，但不能修改
CREATE POLICY "editor_read_settings" ON site_settings
  FOR SELECT
  TO authenticated
  USING (auth.has_any_role(ARRAY['admin', 'editor']));
```

#### 用戶只能編輯自己創建的內容
```sql
-- 用戶只能查看/編輯自己的草稿
CREATE POLICY "users_own_drafts" ON projects
  FOR ALL
  TO authenticated
  USING (
    created_by = (auth.jwt()->>'sub')::text
    OR is_published = true
    OR auth.has_role('admin')
  )
  WITH CHECK (
    created_by = (auth.jwt()->>'sub')::text
    OR auth.has_role('admin')
  );
```

#### Leads 存取控制
```sql
-- 只有 admin 可以讀取 leads
CREATE POLICY "admin_read_leads" ON leads
  FOR SELECT
  TO authenticated
  USING (auth.has_role('admin'));

-- 所有人都可以新增 leads（表單提交）
CREATE POLICY "anyone_insert_leads" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

---

## 8) API / 取用方式

### 前端 API 呼叫（使用 Clerk + Supabase Native Integration）

#### 初始化 Supabase Client

```tsx
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side: 使用 Clerk token
export function useSupabaseClient() {
  const { getToken } = useAuth()

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      async fetch(url, options = {}) {
        const clerkToken = await getToken({ template: 'supabase' })

        const headers = new Headers(options?.headers)
        headers.set('Authorization', `Bearer ${clerkToken}`)

        return fetch(url, {
          ...options,
          headers,
        })
      },
    },
  })

  return supabase
}

// Server-side (Next.js App Router)
import { auth } from '@clerk/nextjs/server'

export async function createServerSupabaseClient() {
  const { getToken } = auth()
  const token = await getToken({ template: 'supabase' })

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
```

#### 使用範例

```tsx
// app/admin/projects/page.tsx
'use client'

import { useSupabaseClient } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'

export default function AdminProjectsPage() {
  const supabase = useSupabaseClient()
  const { user } = useUser()

  // 查詢建案（RLS 自動套用權限）
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  // 新增建案（created_by 自動設為當前 Clerk user ID）
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: '新建案',
      slug: 'new-project',
      status: 'planning',
      is_published: false,
    })

  return <div>{/* UI */}</div>
}
```

### Supabase Edge Functions

#### `clerk-webhook` （必須）
**用途**: 同步 Clerk 用戶至 Supabase `profiles` 表

```typescript
// supabase/functions/clerk-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const payload = await req.json()
  const eventType = req.headers.get('svix-event-type')

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (eventType === 'user.created') {
    const { id, email_addresses } = payload.data

    // 新增用戶到 profiles 表
    const { error } = await supabase.from('profiles').insert({
      clerk_user_id: id,
      email: email_addresses[0]?.email_address,
      role: 'editor',  // 預設角色
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = payload.data

    // 刪除用戶資料
    await supabase.from('profiles').delete().eq('clerk_user_id', id)
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
```

**Clerk Webhook 設定**:
1. Clerk Dashboard → Webhooks → Add Endpoint
2. Endpoint URL: `https://<project-ref>.supabase.co/functions/v1/clerk-webhook`
3. 訂閱事件: `user.created`, `user.deleted`, `user.updated`
4. 複製 Signing Secret 至 Supabase Edge Function secrets

#### `revalidate` （推薦）
**用途**: 清除 Cloudflare CDN 快取

```typescript
// supabase/functions/revalidate/index.ts
serve(async (req) => {
  const { paths, tags } = await req.json()

  // 呼叫 Cloudflare API 清除快取
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${Deno.env.get('CLOUDFLARE_ZONE_ID')}/purge_cache`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('CLOUDFLARE_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: paths,
        tags: tags,
      }),
    }
  )

  return new Response(JSON.stringify(await response.json()), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
```

#### `cloudinary-signature` （選用）
**用途**: 產生 Cloudinary 安全上傳簽名

```typescript
// supabase/functions/cloudinary-signature/index.ts
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts'

serve(async (req) => {
  const { folder, public_id } = await req.json()

  const timestamp = Math.round(Date.now() / 1000)
  const params = {
    timestamp,
    folder: folder || 'uphouse',
    public_id,
  }

  // 產生簽名
  const signature = createHmac('sha256', Deno.env.get('CLOUDINARY_API_SECRET')!)
    .update(Object.entries(params).sort().map(([k, v]) => `${k}=${v}`).join('&'))
    .digest('hex')

  return new Response(JSON.stringify({
    signature,
    timestamp,
    api_key: Deno.env.get('CLOUDINARY_API_KEY'),
    cloud_name: Deno.env.get('CLOUDINARY_CLOUD_NAME'),
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

#### `webhook-cloudinary` （選用）
**用途**: 接收 Cloudinary 上傳完成通知

```typescript
// supabase/functions/webhook-cloudinary/index.ts
serve(async (req) => {
  const payload = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 更新 project_images 表的中繼資料
  const { error } = await supabase
    .from('project_images')
    .update({
      width: payload.width,
      height: payload.height,
      format: payload.format,
      bytes: payload.bytes,
      secure_url: payload.secure_url,
    })
    .eq('public_id', payload.public_id)

  return new Response(JSON.stringify({ success: !error }), {
    status: error ? 500 : 200,
  })
})
```

---

## 9) 品牌色彩規範

> 詳細設計規範請參考：[UPHOUSE_DESIGN_SYSTEM.md](./UPHOUSE_DESIGN_SYSTEM.md)

### 標準色彩（Light Mode）
使用 **shadcn/ui** 命名規範：

| 層級 | 語意 Token | HEX 色碼 | 用途 | 比例 |
|------|-----------|---------|------|------|
| L1 | `--background` | `#FEFAE0` | 背景色、留白區域 | 60% |
| L2 | `--secondary` | `#F4F6F2` | 卡片、表面層 | - |
| L3 | `--primary` | `#283618` | 品牌主色（深綠） | 30% |
| L4 | `--accent` | `#DDA15E` | CTA、強調色（琥珀） | 10% |
| L5 | `--border` | `#E5E8E2` | 邊框、分隔線 | - |
| L6 | `--foreground` | `#1A1A1A` | 主要文字 | 30% |
| L7 | `--muted-foreground` | `#6B6B6B` | 次要文字 | 30% |

### 標準色彩（Dark Mode）
Dark 模式色彩由系統自動計算，遵循以下原則：
- 背景 L 值：6-10（深色、低飽和）
- 文字 L 值：≥90（淺色、低飽和）
- 保持色相一致性

| 層級 | 語意 Token | HEX 色碼 | 用途 |
|------|-----------|---------|------|
| L1 | `--background` | `#1A1E17` | 深色背景 |
| L2 | `--secondary` | `#232920` | 深色表面 |
| L3 | `--primary` | `#A3B18A` | 夜間主色（亮綠） |
| L4 | `--accent` | `#E9C46A` | 夜間 CTA（亮黃） |
| L5 | `--border` | `#2F352C` | 深色邊框 |
| L6 | `--foreground` | `#F4F6F2` | 夜間主要文字 |
| L7 | `--muted-foreground` | `#B5B8B1` | 夜間次要文字 |

### 色彩管理原則
- **單一真實來源（SSOT）**：所有色彩定義於 `tailwind.config.js`
- **禁止硬編碼**：不得在 CSS 直接寫 HEX/RGB 色碼
- **使用語意類別**：如 `bg-primary`、`text-muted-foreground`
- **自動對比度**：系統自動計算符合 WCAG AA 標準的文字顏色

---

## 10) 非功能性需求
- **效能**：首頁 LCP ≤ 2.5s；使用 **Cloudinary 轉檔**（`f_auto`, `q_auto`, DPR/寬度自適應）產生 WebP/AVIF 與多尺寸；Lazyload 與原生 `loading=lazy`。
- **可靠度**：每日資料庫快照；Cloudinary 資產啟用版本化與備援（資料庫僅存 URL/`public_id`）。
- **可維運性**：.env 以 Cloudflare Pages 專案變數管理；分環境（dev/stage/prod）。
- **可擴充**：預留「最新消息」、「工程進度相簿」、「文件下載」資料表，但預設關閉前端路由。
- **可訪問性（A11y）**：
  - 所有文字對比度 ≥ 4.5:1（AA）
  - 主標題對比度 ≥ 7:1（AAA）
  - 所有可點擊元素 ≥ 44×44px（Fitts's Law）
  - 完整鍵盤導航支援
  - ARIA 屬性完整標註

---

## 11) 版本控管與流程（Git/GitHub）
- **Repo**：GitHub 私有倉庫，啟用 Branch protection、Required reviews（≥1）、必跑 CI。
- **分支模式**：
  - `main`：穩定可發佈；與 **prod** 對應。
  - `develop`：整合測試；與 **stage** 對應。
  - `feature/*`：功能開發；完成後對 `develop` 發 PR。
  - `hotfix/*`：緊急修補；對 `main` 發 PR，合併後回灌 `develop`。
- **提交規範**：Conventional Commits（feat/fix/docs/chore/refactor/perf/test/build/ci），自動產生 CHANGELOG。
- **版本編號**：Semantic Versioning（MAJOR.MINOR.PATCH）；`vX.Y.Z` Tag。
- **PR 規範**：
  - PR Template（需求背景、變更內容、測試步驟、風險/回滾方式）。
  - 必跑檢查：TypeScript build、ESLint、Prettier、單元測試（若有）。
- **CI/CD：GitHub Actions**
  - **Preview**：對 PR 建置 Cloudflare Pages Preview，留言預覽網址（連動「預覽模式」）。
  - **Stage**：合併 `develop` 觸發部署至 stage 網域；自動執行 DB migration（受保護）。
  - **Prod**：發佈 Release 或合併 `main` 觸發 prod 部署；完成後觸發 Edge Function `revalidate` 清快取。
- **資料遷移**：以 `supabase/migrations` 版本化（SQL 腳本），PR 檢視差異。
- **存取權限**：CODEOWNERS 指派審核人；保護機密（使用 GitHub Environments Secrets）。

---

## 12) 相關文件

### 設計系統
- [UPHOUSE_DESIGN_SYSTEM.md](./UPHOUSE_DESIGN_SYSTEM.md) - 完整 UI/UX 設計規範
  - 色彩系統（60/30/10 規則、WCAG 標準）
  - 按鈕系統（P1/P2/P3 層級、狀態規則）
  - 排版與字體（LINE Seed TW、8px Grid）
  - 元件規範（Card、Navbar、Form）
  - 可訪問性（A11y）要求
  - 開發指南與程式碼範例

---

**文件版本**: 2.0
**最後更新**: 2025-10-12
**變更內容**:
- 更新認證架構為 Clerk Auth + Supabase DB
- 新增品牌色彩規範（PRD 標準色）
- 新增 RLS 策略詳細說明
- 新增相關文件索引
